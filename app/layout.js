import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import Footer from "./_components/Footer/Footer";
import CartSideBar from "./_components/CartSideBar/CartSideBar";
import NewsLetter from "./academy/_components/NewsLetter/NewsLetter";
import Navbar from "./_components/Navbar/Navbar";
import NavbarMobile from "./_components/Navbar/NavbarMobile";
import GlobalLoader from "./_components/GlobalLoader/GlobalLoader";
import CouponModal from "./_components/CouponModal/CouponModal";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WhiteMantis",
  description: "WhiteMantis",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "WhiteMantis",
    description: "WhiteMantis",
    images: [
      {
        url: "/social-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "WhiteMantis",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhiteMantis",
    description: "WhiteMantis",
    images: ["/social-thumbnail.png"],
  },
};


export default async function RootLayout({ children }) {
  let categories = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/web-categories?sort=createdAt&select[slug]=true&select[title]=true&depth=0&limit=100`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    categories = data.docs || [];
  } catch (error) {
    console.error("Failed to fetch categories in layout:", error);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Toaster
            position="top-right"
            containerStyle={{
              top: 100,
              right: 24,
              zIndex: 9999,
            }}
          />
          <GlobalLoader />
          <Navbar categories={categories} />
          <NavbarMobile categories={categories} />
          {children}

          <Footer categories={categories} />
          <CartSideBar />
          <CouponModal />
          <NewsLetter />
        </Providers>
      </body>
    </html>
  );
}

