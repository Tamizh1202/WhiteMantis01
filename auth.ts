import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { SignJWT, importPKCS8 } from "jose";

async function generateAppleSecret(): Promise<string> {
  const privateKey = await importPKCS8(
    (process.env.APPLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    "ES256"
  );
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID! })
    .setIssuer(process.env.APPLE_TEAM_ID!)
    .setIssuedAt()
    .setExpirationTime("180d") // Apple's max is 6 months
    .setAudience("https://appleid.apple.com")
    .setSubject(process.env.APPLE_ID!)
    .sign(privateKey);
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const appleSecret = await generateAppleSecret();

  return {
    providers: [
      Credentials({
        id: "otp",
        name: "OTP",
        credentials: {
          user: { label: "User Data", type: "text" },
          token: { label: "Payload Token", type: "text" },
        },
        async authorize(credentials) {
          if (!credentials?.user || !credentials?.token) return null;

          try {
            const user = JSON.parse(credentials.user as string);
            const payloadToken = credentials.token as string;

            return {
              id: user.id.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImage: user.profileImage,
              stripeCustomerId: user.stripeCustomerId,
              "paylaod-token": payloadToken,
              success: true,
              isNewUser: user.isNewUser,
            };
          } catch (e: any) {
            console.error("Authorize error:", e.message);
            return null;
          }
        },
      }),
      Google({
        clientId: process.env.GOOGLE_CLIENT_KEY!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
      Apple({
        clientId: process.env.APPLE_ID!,
        clientSecret: appleSecret,
      }),
    ],

    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7,
    },

    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider === "google") {
          if (!account.id_token) {
            console.error("Google Sign-In failed: No id_token returned");
            return false;
          }
          return true;
        }
        if (account?.provider === "apple") {
          if (!account.id_token) {
            console.error("Apple Sign-In failed: No id_token returned");
            return false;
          }
          return true;
        }
        return !!user;
      },

      async jwt({ token, user, account, trigger, session }: any) {
        if (trigger === "update" && session) {
          if (session.user?.profileImage) token.profileImage = session.user.profileImage;
          if (session.profileImage) token.profileImage = session.profileImage;
          if (session.user?.firstName) token.firstName = session.user.firstName;
          if (session.user?.lastName) token.lastName = session.user.lastName;
          if (session.user?.email) token.email = session.user.email;
          if (session.user?.id) token.id = session.user.id;
          if (session.user?.stripeCustomerId) token.stripeCustomerId = session.user.stripeCustomerId;
          if (session.user?.["paylaod-token"]) token.payloadToken = session.user["paylaod-token"];
          if (session.user?.success !== undefined) token.success = session.user.success;
          if (session.user?.isNewUser !== undefined) token.isNewUser = session.user.isNewUser;
        }

        if (account && user) {
          if (account.provider === "google") {
            token.googleIdToken = account.id_token;
            token.isGoogleLogin = true;
          }
          if (account.provider === "apple") {
            token.appleIdToken = account.id_token;
            token.isAppleLogin = true;
          }

          token.id = user.id;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.profileImage = user.profileImage;
          token.stripeCustomerId = user.stripeCustomerId;
          token.payloadToken = user["paylaod-token"];
          token.email = user.email;
          token.isNewUser = user.isNewUser;
          token.success = user.success;
        }
        return token;
      },

      async session({ session, token }: any) {
        if (!session.user) session.user = {};

        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;

        const firstName = (token.firstName as string) || "";
        const lastName = (token.lastName as string) || "";

        if (firstName && lastName && firstName === lastName) {
          session.user.name = firstName;
        } else {
          session.user.name = `${firstName} ${lastName}`.trim() || null;
        }

        session.user.profileImage = token.profileImage;
        session.user.stripeCustomerId = token.stripeCustomerId;
        session.user["paylaod-token"] = token.payloadToken;
        session.user.email = token.email;
        session.user.isNewUser = token.isNewUser;
        session.user.success = token.success;
        session.googleIdToken = token.googleIdToken;
        session.isGoogleLogin = token.isGoogleLogin;
        session.appleIdToken = token.appleIdToken;
        session.isAppleLogin = token.isAppleLogin;

        return session;
      },
    },
  };
});
