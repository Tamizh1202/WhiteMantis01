'use client';
import React from "react";
import styles from "./Subscribe.module.css";
import Image from "next/image";
import one from "./1.png";
import two from "./2.png";

const Subscribe = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.Left}>
            <Image src={one} alt="image" />
          </div>
          <div className={styles.Right}>
            <div className={styles.RightTop}>
              <div className={styles.RightTopContent}>
                <h3>Never run out. Never settle. </h3>
                <p style={{ width: "100%" }}>
                  Set your coffee once and forget the reorder.
                  Choose your roast, your format, your
                  schedule and we'll send freshly roasted
                  coffee to your door on time, every time.
                  Subscribers get up to 20% off, early access
                  to limited roasts, and free delivery on 6 and
                  12-month plans.
                </p>
              </div>
              <div className={styles.RightTopButton} onClick={() => window.location.href = "/subscription"}>
                <p>Build Your Plan</p>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 7.38462H6.76923V2.09846L0.867692 8L0 7.13231L5.90154 1.23077H0.615384V0H8V7.38462Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.RightBottom}>
              <Image src={two} alt="two" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;
