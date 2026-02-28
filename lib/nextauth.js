import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axiosClient from "./axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        user: { label: "User Data", type: "text" },
        token: { label: "Payload Token", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.user || !credentials?.token) return null;

        try {
          const user = JSON.parse(credentials.user);
          const payloadToken = credentials.token;

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
        } catch (e) {
          console.error("Authorize error:", e.message);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_KEY,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!account.id_token) {
          console.error("Google Sign-In failed: No id_token returned");
          return false;
        }
        // Verification happens on the frontend after sign-in is complete
        return true;
      }
      return !!user;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session?.profileImage) {
        token.profileImage = session.profileImage;
      }

      // Initial sign in
      if (account && user) {
        if (account.provider === "google") {
          token.googleIdToken = account.id_token;
          token.isGoogleLogin = true;
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

    async session({ session, token }) {
      if (!session.user) session.user = {};

      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.profileImage = token.profileImage;
      session.user.stripeCustomerId = token.stripeCustomerId;
      session.user["paylaod-token"] = token.payloadToken;
      session.user.email = token.email;
      session.user.isNewUser = token.isNewUser;
      session.user.success = token.success;
      session.googleIdToken = token.googleIdToken;
      session.isGoogleLogin = token.isGoogleLogin;

      return session;
    },
  },
};
