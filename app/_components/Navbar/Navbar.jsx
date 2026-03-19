"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "../../_context/CartContext";
import axiosClient from "@/lib/axios";

const Logo = "/White-mantis-animated-logo.gif";

const Navbar = ({ categories: initialCategories }) => {

  const closeShopDropdown = () => {
    setShopOpen(false);
  };

  const pathname = usePathname();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef(null);
  const { isCartOpen, openCart, closeCart, items } = useCart();
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setIsScrollingDown(
        currentPosition > scrollPosition && currentPosition > 50,
      );
      setScrollPosition(currentPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShopOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShopOpen(false);
    }, 200);
  };

  return (
    <div className={`${styles.Main} ${isScrollingDown ? styles.hide : ""}`}>
      <div className={styles.MainCoantiner}>
        <div className={styles.Left}>
          <div className={styles.LogoContainer}>
            <Link href="/">
              <Image
                src={Logo}
                alt="White Mantis Logo"
                width={170}
                height={78}
                unoptimized
              />
            </Link>
          </div>

          <div className={styles.PageslInks}>
            <div
              className={styles.OurShopWrapper}
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`${styles.OurShops} ${pathname.startsWith("/shop") ? styles.active : ""
                  }`}
                onClick={() => setShopOpen((prev) => !prev)}
              >
                <p>Our Shop</p>
                <svg
                  className={`${styles.Arrow} ${shopOpen ? styles.ArrowOpen : ""
                    }`}
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                >
                  <path
                    d="M3.89844 0L7.79555 4.5H0.00132322L3.89844 0Z"
                    fill="#6E736A"
                  />
                </svg>
              </div>

              <div
                className={`${styles.DummyMain} ${shopOpen ? styles.DummyMainOpen : ""
                  }`}
              >
                <div className={styles.DummyMainCoantiner}>
                  <div className={styles.DummyLeft}>
                    <div className={styles.DummyLeftOne}>
                      <h3>OUR Shop</h3>
                      <p>
                        From home brewing to bulk supply, discover coffee and
                        equipment made to perform.
                      </p>
                    </div>

                    <div className={styles.DummyLine}></div>

                    <div className={styles.DummyLeftTwo}>
                      <div className={styles.DummyLeftTwoLeft}>
                        <div className={styles.DummyLeftTwoLeftTop}>
                          <h4>Coffee</h4>
                        </div>
                        <div className={styles.DummyLeftTwoLeftBottom}>

                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/shop/${category.slug}`}
                              onClick={closeShopDropdown}
                            >
                              <p>{category.title}</p>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* <div className={styles.DummyLeftTwoRight}>
                        <div className={styles.DummyLeftTwoRightTop}>
                          <h4>Essentials</h4>
                        </div>
                        <div className={styles.DummyLeftTwoRightBottom}>
                          <Link href="/shop/merchandise"><p>Merchandise</p></Link>
                          <Link href="/shop/equipment"><p>Equipments</p></Link>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className={styles.DummyRight}>
                    <div className={styles.DummyRightOne}>
                      <div className={styles.DummyRightOneTop}>
                        <h4>Seasonal Release</h4>
                        <p>
                          Indonesia Banner Mariah Triple Wet Hull Citrus, nutty,
                          chocolate
                        </p>
                      </div>
                      <div className={styles.DummyRightOneBottom}>
                        <Link href={categories.length > 0 ? `/shop/${categories[0].slug}` : "/shop/coffee-beans"}>
                          <button className={styles.DummyExplore}>
                            Explore
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* <div className={styles.DummyRightTwo}>
                      <div className={styles.DummyRightTwoTop}>
                        <h4>Subscription</h4>
                        <p>Coffee to your door</p>
                      </div>
                      <div className={styles.DummyRightTwoBottom}>
                        <Link href="/subscription">
                          <button className={styles.DummyTwoExplore}>
                            Explore
                          </button>
                        </Link>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/about-us"
              className={pathname === "/about-us" ? styles.active : ""}
            >
              <div className={styles.AboutUspg}>
                <p>About Us</p>
              </div>
            </Link>

            <Link
              href="/academy"
              className={pathname === "/academy" ? styles.active : ""}
            >
              <div className={styles.Workshopspg}>
                <p>Academy</p>
              </div>
            </Link>

            <Link
              href="/subscription"
              className={pathname === "/subscription" ? styles.active : ""}
            >
              <div className={styles.Subscriptionpg}>
                <p>Subscription</p>
              </div>
            </Link>
          </div>
        </div>

        <div className={styles.Right}>

          <Link
            href="/wholesale"
            className={pathname === "/wholesale" ? styles.active : ""}
          >
            <div className={styles.AboutUspg}>
              <p>Wholesale</p>
            </div>
          </Link>

          <Link
            href="/contact"
            className={pathname === "/contact" ? styles.active : ""}
          >
            <p>Contact Us</p>
          </Link>

          <Link
            href="/blogs"
            className={pathname === "/blogs" ? styles.active : ""}
          >
            <p>Blogs</p>
          </Link>

          <Link
            href=""
            onClick={() => (isCartOpen ? closeCart() : openCart())}
            className={pathname === "/cart" ? styles.active : ""}
            style={{ cursor: "pointer" }}
          >
            <p>
              Cart
              {Array.isArray(items) && items.length > 0 && (
                <span
                  style={{
                    color: "#6c7a5f",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  ({items.length})
                </span>
              )}
            </p>
          </Link>
          {session && (
            <Link
              href="/account"
              className={pathname.startsWith("/account") ? styles.active : ""}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.8106 13.4114C21.8106 11.0306 19.881 9.10016 17.5002 9.09997C15.1193 9.09997 13.1888 11.0304 13.1888 13.4114C13.189 15.7921 15.1194 17.7217 17.5002 17.7217C19.8809 17.7215 21.8104 15.792 21.8106 13.4114ZM23.4105 13.4114C23.4104 16.6756 20.7645 19.3215 17.5002 19.3217C14.2358 19.3217 11.5891 16.6758 11.5889 13.4114C11.5889 10.1468 14.2357 7.5 17.5002 7.5C20.7646 7.50019 23.4105 10.1469 23.4105 13.4114Z"
                  fill="#171717"
                  stroke="#171717"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M24.8774 26.7006C24.8774 24.744 24.1006 22.8666 22.717 21.483C21.3335 20.0996 19.4569 19.3227 17.5004 19.3226C15.5438 19.3226 13.6664 20.0994 12.2828 21.483C10.8992 22.8666 10.1224 24.744 10.1224 26.7006C10.1222 27.1423 9.76415 27.5006 9.32245 27.5006C8.88074 27.5006 8.52265 27.1423 8.52246 26.7006C8.52246 24.3196 9.46795 22.0354 11.1516 20.3518C12.8352 18.6681 15.1194 17.7227 17.5004 17.7227C19.8812 17.7227 22.1647 18.6683 23.8482 20.3518C25.5319 22.0354 26.4774 24.3196 26.4774 26.7006C26.4772 27.1423 26.1191 27.5006 25.6774 27.5006C25.2358 27.5004 24.8776 27.1422 24.8774 26.7006Z"
                  fill="#171717"
                  stroke="#171717"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>

            </Link>
          )}
          {!session && (
            <Link
              href="/auth"
              className={pathname.startsWith("/auth") ? styles.active : ""}
              style={{ cursor: "pointer" }}
            >
              <p>Start Here</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
