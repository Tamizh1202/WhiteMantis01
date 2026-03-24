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
  if (pathname.startsWith("/auth")) {
    return null;
  }
  return (
    <>
      {/* chnge link path with crct one later veer dont forget */}
      <div className={styles.Main}>
        <div className={styles.MainConatiner1}>
          {/* LEFT MOST: Logo */}
          <div className={styles.TopLeft}>
            <Link href="/">
              <Image
                src={Logo}
                alt="White Mantis Logo"
                width={157}
                height={97}
                priority
                className={styles.LogoImage}
              />
            </Link>
          </div>

          {/* RIGHT SECTIONS WRAPPER */}
          <div className={styles.topright}>
            {/* SECTION 1: BREW. EARN. ENJOY. */}
            <div className={styles.topright1}>
              <h2>Every order earns. Redeem for free coffee.</h2>
              <div className={styles.toprightBottom}>
                <div className={styles.txt1}>
                  <p style={{ textDecoration: "underline" }}>
                    White Mantis Rewards
                  </p>
                  <p>
                    Earn points on every order — beans, capsules, drip bags,
                    subscriptions. Redeem for free coffee, early access to
                    limited roasts, and exclusive member offers. It's automatic
                    when you create an account.
                  </p>
                </div>
                <div className={styles.btn1}>
                  <Link
                    href="/account/whitemantis-beans"
                    style={{ textDecoration: "none" }}
                  >
                    <button className={styles.SubscribeButton}>
                      See How It Works
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTION 2: YOUR COMPLETE COFFEE EXPERIENCE (20% Width) */}
            <div className={styles.topright2}>
              <div className={styles.topright21}>
                <h2>Everything White Mantis, in one app.</h2>
                <div className={styles.topright21Bottom}>
                  <div className={styles.topright21txt}>
                    <p style={{ textDecoration: "underline" }}>
                      White Mantis App
                    </p>
                    <p>
                      Order ahead. Track your subscription. Earn rewards. Get
                      first access to new roasts. Available on iOS and Android.
                    </p>
                  </div>
                  <div className={styles.splitButtoms}>
                    <button className={styles.btns2}>
                      <Image
                        src={google}
                        alt="Google Play"
                        width={24}
                        height={24}
                        className={styles.ButtonIcon}
                      />
                      <div className={styles.TextContainer}>
                        <span className={styles.btnhead}>Get it on</span>
                        <span className={styles.btnbody}>Google Play</span>
                      </div>
                    </button>
                    <button className={styles.btns2}>
                      <Image
                        src={apple}
                        alt="App Store"
                        width={24}
                        height={24}
                        className={styles.ButtonIcon}
                      />
                      <div className={styles.TextContainer}>
                        <span className={styles.btnhead}>Download on the</span>
                        <span className={styles.btnbody}>App Store</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.MainConatiner2}>
          <div className={styles.Top}>
            <div className={styles.TopMiddle}>
              <div className={styles.MobOne}>
                <div className={styles.TopMiddleOne}>
                  <div className={styles.TopMiddleOneTop}>
                    <h4>Company</h4>
                  </div>
                  <div className={styles.TopMiddleOneBottom}>
                    <Link href="/about-us">
                      <p>About us</p>
                    </Link>
                    <Link href="/academy">
                      <p>Academy</p>
                    </Link>
                    <Link href="/subscription">
                      <p>Subscription</p>
                    </Link>
                    <Link href="/blogs">
                      <p>Blogs</p>
                    </Link>
                    {/* <Link href="/careers">
                      <p>Careers</p>
                    </Link> */}
                    {/* <Link href="/wholesale">
                      <p>Wholesale</p>
                    </Link> */}
                    {/* <Link href="/contact">
                      <p>Contact Us</p>
                    </Link> */}
                  </div>
                </div>

                <div className={styles.TopMiddleTwo}>
                  <div className={styles.TopMiddleTwoTop}>
                    <h4>Shop</h4>
                  </div>
                  <div className={styles.TopMiddleTwoBottom}>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <Link key={category.id} href={`/shop/${category.slug}`}>
                          <p>{category.title}</p>
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link href="/shop/coffee-beans">
                          <p>Coffee Beans</p>
                        </Link>
                        <Link href="/shop/capsules">
                          <p>Coffee Capsules</p>
                        </Link>
                        <Link href="/shop/drip-bags">
                          <p>Coffee Drip Bags</p>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.MobTwo}>
                <div className={styles.TopMiddleThree}>
                  <div className={styles.TopMiddleThreeTop}>
                    <h4>Account</h4>
                  </div>
                  <div className={styles.TopMiddleThreeBottom}>
                    <Link href="/account/profile">
                      <p>Profile</p>
                    </Link>
                    <Link href="/account/orders">
                      <p>Orders</p>
                    </Link>
                    <Link href="/account/wishlist">
                      <p>Wishlist</p>
                    </Link>
                    <Link href="/account/subscription">
                      <p>Manage Subscription</p>
                    </Link>
                    <Link href="account/whitemantis-beans">
                      <p>White Mantis Beans</p>
                    </Link>
                  </div>
                </div>

                <div className={styles.TopMiddleFour}>
                  <div className={styles.TopMiddleFourTop}>
                    <h4>Support</h4>
                  </div>
                  <div className={styles.TopMiddleFourBottom}>
                    <Link href="/wholesale">
                      <p>Wholesale</p>
                    </Link>
                    <Link href="/contact">
                      <p>Contact Us</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.TopRight}>
              <div className={styles.TopRightTop} id="join-community">
                <div className={styles.NewslHeading}>
                  <h4>Stay in the Loop</h4>
                </div>
                <div className={styles.NewsLetter}>
                  <div className={styles.NewsLetterRow}>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className={styles.NewsLetterInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      suppressHydrationWarning
                    />

                    <button
                      className={styles.SubscribeButton}
                      disabled={loading}
                      onClick={async () => {
                        if (!email) {
                          setNewsletterError(true);
                          setNewsletterMsg(
                            "Please enter a valid email address.",
                          );
                          return;
                        }

                        setLoading(true);
                        setNewsletterMsg("");
                        setNewsletterError(false);

                        try {
                          const res = await axiosClient.post(
                            "/api/newsletters",
                            { email },
                          );

                          setNewsletterError(false);
                          setNewsletterMsg(
                            res?.data?.message || "Subscribed successfully!",
                          );
                          setEmail("");
                        } catch (err) {
                          console.log("Newsletter error full:", err);
                          console.log(
                            "Newsletter error response:",
                            err?.response,
                          );
                          console.log(
                            "Newsletter error response data:",
                            err?.response?.data,
                          );
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
                    <p
                      className={
                        newsletterError
                          ? styles.NewsletterError
                          : styles.NewsletterSuccess
                      }
                    >
                      {newsletterMsg}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.TopRightMiddle}>
                <div className={styles.Phone}>
                  <p style={{ fontWeight: "bold" }}>Phone</p>
                  <Link href="tel:+971589535337">
                    <p>+971 58 953 5337</p>
                  </Link>
                </div>
                <div className={styles.Email}>
                  <p style={{ fontWeight: "bold" }}>Email</p>
                  <Link href="mailto:hello@whitemantis.ae">
                    <p>hello@whitemantis.ae</p>
                  </Link>
                </div>
              </div>

              <div className={styles.Address}>
                <p>Roastery & Lab</p>
                <p>
                  Warehouse 2-26, <br />
                  26th Street Al Quoz Industrial Area 4 Dubai, UAE
                </p>
              </div>

              <div className={styles.TopRightBottomMobile}>
                <Link href="/terms-and-conditions">
                  <p>Terms and Conditions</p>
                </Link>
                <Link href="/privacy-policy">
                  <p>Privacy Policy</p>
                </Link>
              </div>
              <div className={styles.Socials}>
                <a
                  href="https://www.instagram.com/whitemantis.ae?igsh=cHl5NnQ3ZDY4OGNt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>Instagram</p>
                </a>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.354342 7.58134L7.36212 0.501629M7.36212 0.501629V6.87337M7.36212 0.501629H1.05512"
                    stroke="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.Bottom}>
            <div className={styles.line}></div>
            <div className={styles.BottomBottom}>
              <div className={styles.BottomBottomLeft}>
                <p>© 2026 White Mantis Coffee Roasters LLC</p>
              </div>

              <div className={styles.BottomBottomMiddle}>
                <div className={styles.TandC}>
                  <Link href="/terms-and-conditions">
                    <p>Terms and Conditions</p>
                  </Link>
                </div>
                <div className={styles.PrivacyPolicy}>
                  <Link href="/privacy-policy">
                    <p>Privacy Policy</p>
                  </Link>
                </div>
              </div>

              <div className={styles.BottomBottomRight}>
                <p>
                  Crafted by{" "}
                  <Link
                    href="https://integramagna.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.IM}
                  >
                    Integra Magna
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
