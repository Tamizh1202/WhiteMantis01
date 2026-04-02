"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import apple from "../Footer/appstore.png";
import google from "../Footer/googleplay.png";
import axiosClient from "@/lib/axios";
const Logo = "/White-Mantis-White-Logo.svg";

const Footer = ({ categories }) => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [newsletterError, setNewsletterError] = useState(false);

  if (pathname.startsWith("/auth")) return null;

  return (
    <footer className={styles.Main}>

      {/* ── TOP ROW: Logo/Info left + Nav columns right ── */}
      <div className={styles.TopRow}>

        {/* Left: logo, brand name, address, phone, email */}
        <div className={styles.BrandCol}>
          <Link href="/">
            <Image
              src={Logo}
              alt="White Mantis Logo"
              width={80}
              height={50}
              priority
              className={styles.LogoImage}
            />
          </Link>
          <div className={styles.AddressBlock}>
            <p className={styles.AddressLabel}>Our Store</p>
            <p>Warehouse #2 – 26<br />26th St – Al Quoz Ind.fourth, Al Quoz, Dubai</p>
          </div>

          <div className={styles.ContactRow}>
            <div>
              <p className={styles.ContactLabel}>Phone</p>
              <Link href="tel:+97158 9535337"><p>05 8953 5337</p></Link>
            </div>
            <div>
              <p className={styles.ContactLabel}>Email</p>
              <Link href="mailto:hello@whitemantis.ae"><p>hello@whitemantis.ae</p></Link>
            </div>
          </div>
        </div>

        {/* Right: 4 nav columns */}
        <div className={styles.NavColumns}>

          <div className={styles.NavCol}>
            <h4 className={styles.NavHeading}>Company</h4>
            <Link href="/about-us"><p>About us</p></Link>
            <Link href="/academy"><p>Academy</p></Link>
            <Link href="/subscription"><p>Subscription</p></Link>
            <Link href="/blogs"><p>Blogs</p></Link>
            <Link href="/wholesale"><p>Wholesale</p></Link>
          </div>

          <div className={styles.NavCol}>
            <h4 className={styles.NavHeading}>Shop</h4>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.id} href={`/shop/${cat.slug}`}><p>{cat.title}</p></Link>
              ))
            ) : (
              <>
                <Link href="/shop/coffee-beans"><p>Coffee Beans</p></Link>
                <Link href="/shop/capsules"><p>Coffee Capsules</p></Link>
                <Link href="/shop/drip-bags"><p>Coffee Drip Bags</p></Link>
                <Link href="/shop/merchandise"><p>Merchandise</p></Link>
                <Link href="/shop/equipment"><p>Equipment</p></Link>
              </>
            )}
          </div>

          <div className={styles.NavCol}>
            <h4 className={styles.NavHeading}>Account</h4>
            <Link href="/account/profile"><p>Profile</p></Link>
            <Link href="/account/orders"><p>Orders</p></Link>
            <Link href="/account/wishlist"><p>Wishlist</p></Link>
            <Link href="/account/subscription"><p>Manage Subscription</p></Link>
            <Link href="/account/whitemantis-beans"><p>White Mantis Subscription</p></Link>
          </div>

          <div className={styles.NavCol}>
            <h4 className={styles.NavHeading}>Support</h4>
            <Link href="/careers"><p>Careers</p></Link>
            <Link href="/contact"><p>Contact Us</p></Link>
            <a
              href="https://www.instagram.com/whitemantis.ae"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.InstagramLink}
            >
              <p>
                Instagram&nbsp;
                <svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: "middle" }}>
                  <path d="M0.354342 7.58134L7.36212 0.501629M7.36212 0.501629V6.87337M7.36212 0.501629H1.05512" stroke="white" strokeWidth="1" />
                </svg>
              </p>
            </a>
          </div>

        </div>
      </div>

      {/* ── MIDDLE ROW: 3 equal columns ── */}
      <div className={styles.MidRow}>

        {/* Col 1: App download */}
        <div className={styles.MidCol}>
          <h3 className={styles.MidHeading}>Your Complete Coffee Experience.</h3>
          <p>Order ahead at our cafés, earn rewards, manage subscriptions, and explore new releases all in one seamless experience.</p>
          <div className={styles.AppButtons}>
            <button className={styles.AppBtn}>
              <Image src={google} alt="Google Play" width={24} height={24} className={styles.AppIcon} />
              <div className={styles.AppBtnText}>
                <span className={styles.AppBtnSub}>Get it on</span>
                <span className={styles.AppBtnMain}>Google Play</span>
              </div>
            </button>
            <button className={styles.AppBtn}>
              <Image src={apple} alt="App Store" width={24} height={24} className={styles.AppIcon} />
              <div className={styles.AppBtnText}>
                <span className={styles.AppBtnSub}>Download on the</span>
                <span className={styles.AppBtnMain}>App Store</span>
              </div>
            </button>
          </div>
        </div>

        {/* Col 2: Rewards */}
        <div className={styles.MidCol}>
          <h3 className={styles.MidHeading}>Brew. Earn. Enjoy.</h3>
          <p>Join White Mantis Rewards, earn points on every purchase and redeem for free coffee, exclusives, and perks.</p>
          <Link href="/account/whitemantis-beans" style={{ textDecoration: "none" }}>
            <button className={styles.RewardsBtn}>Explore Rewards</button>
          </Link>
        </div>

        {/* Col 3: Newsletter */}
        <div className={styles.MidCol} id="join-community">
          <h3 className={styles.MidHeading}>Join Our Community</h3>
          <p>Explore coffee beyond the cup with curated stories, insights, and slow rituals.</p>
          <div className={styles.NewsletterRow}>
            <input
              type="email"
              placeholder="Email address"
              className={styles.NewsletterInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning
            />
            <button
              className={styles.SubscribeBtn}
              disabled={loading}
              onClick={async () => {
                if (!email) {
                  setNewsletterError(true);
                  setNewsletterMsg("Please enter a valid email address.");
                  return;
                }
                setLoading(true);
                setNewsletterMsg("");
                setNewsletterError(false);
                try {
                  const res = await axiosClient.post("/api/newsletters", { email });
                  setNewsletterError(false);
                  setNewsletterMsg(res?.data?.message || "Subscribed successfully!");
                  setEmail("");
                } catch (err) {
                  setNewsletterError(true);
                  const errData = err?.response?.data;
                  setNewsletterMsg(
                    errData?.message ||
                    errData?.error ||
                    errData?.errors?.[0]?.message ||
                    "You're already subscribed! We'll keep you in the loop.",
                  );
                } finally {
                  setLoading(false);
                  setTimeout(() => setNewsletterMsg(""), 4000);
                }
              }}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          {newsletterMsg && (
            <p className={newsletterError ? styles.NewsletterError : styles.NewsletterSuccess}>
              {newsletterMsg}
            </p>
          )}
        </div>
        <div className={styles.LegalLinksMob}>
          <Link href="/terms-and-conditions"><p>Terms and Conditions</p></Link>
          <Link href="/privacy-policy"><p>Privacy Policy</p></Link>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className={styles.BottomBar}>
        <div className={styles.Divider} />
        <div className={styles.BottomRow}>
          <p className={styles.Copyright}>© 2026 White Mantis</p>
          <div className={styles.LegalLinks}>
            <Link href="/terms-and-conditions"><p>Terms and Conditions</p></Link>
            <Link href="/privacy-policy"><p>Privacy Policy</p></Link>
          </div>
          <p className={styles.CraftedBy}>
            Crafted by{" "}
            <Link href="https://integramagna.com" target="_blank" rel="noopener noreferrer" className={styles.IM}>
              Integra Magna
            </Link>
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;