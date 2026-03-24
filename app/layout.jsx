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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/web-categories?sort=createdAt&select[slug]=true&select[title]=true&depth=0&limit=100`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );
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
          <a
            href="https://wa.me/971589535337"
            target="_blank"
            rel="noopener noreferrer"
            className="WhatsAppFloat"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="40" r="40" fill="white" />
              <path
                d="M50.805 43.9677C50.2411 43.6822 47.4947 42.342 46.9814 42.1508C46.4681 41.968 46.0955 41.8723 45.7214 42.4362C45.3558 42.9861 44.2786 44.2447 43.9495 44.6117C43.6205 44.9788 43.297 45.0069 42.7416 44.758C42.1777 44.4725 40.3762 43.8861 38.2373 41.968C36.5667 40.4816 35.4544 38.6506 35.1239 38.0867C34.7948 37.5298 35.0873 37.2148 35.3658 36.9364C35.6217 36.6805 35.9297 36.2923 36.2152 35.9548C36.4866 35.6173 36.5738 35.3909 36.772 35.0253C36.9548 34.6302 36.8606 34.3222 36.7214 34.0438C36.5822 33.7653 35.4614 31.0048 34.9931 29.9052C34.5459 28.8139 34.0777 28.9531 33.7331 28.9531C33.4111 28.9236 33.037 28.9236 32.6644 28.9236C32.2917 28.9236 31.6828 29.0628 31.1695 29.5972C30.6562 30.1611 29.2064 31.5083 29.2064 34.2336C29.2064 36.9659 31.2131 39.6097 31.4916 40.0048C31.777 40.3705 35.4389 45.9955 41.0569 48.4128C42.397 48.9767 43.4377 49.3142 44.2505 49.5927C45.5906 50.0173 46.8141 49.9583 47.7802 49.8191C48.8489 49.6433 51.0905 48.4634 51.5602 47.1458C52.0369 45.8197 52.0369 44.7214 51.8977 44.4725C51.7584 44.2166 51.3928 44.0773 50.8289 43.8284L50.805 43.9677ZM40.6167 57.7812H40.5872C37.2614 57.7812 33.9736 56.8798 31.102 55.1952L30.4284 54.793L23.3972 56.6239L25.2872 49.7825L24.833 49.0794C22.9762 46.1266 21.9911 42.7096 21.9909 39.2216C21.9909 29.0122 30.3483 20.6844 40.6308 20.6844C45.6117 20.6844 50.2847 22.625 53.8003 26.1406C55.5345 27.8544 56.9101 29.8962 57.8468 32.1472C58.7836 34.3981 59.2628 36.813 59.2566 39.2511C59.2425 49.4534 50.8922 57.7812 40.6237 57.7812H40.6167ZM56.4736 23.4673C52.1958 19.3358 46.5708 17 40.5872 17C28.2459 17 18.1969 27.0055 18.1898 39.3017C18.1898 43.228 19.215 47.0586 21.1781 50.4491L18 62L29.88 58.902C33.1704 60.678 36.8495 61.6114 40.5886 61.6189H40.5956C52.9439 61.6189 62.993 51.6134 63 39.3088C63 33.3547 60.6783 27.7508 56.4455 23.5391L56.4736 23.4673Z"
                fill="#6C7A5F"
              />
            </svg>
          </a>
        </Providers>
      </body>
    </html>
  );
}
