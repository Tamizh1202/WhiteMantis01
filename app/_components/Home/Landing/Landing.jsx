"use client";
import React from "react";
import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <>
      <div className={styles.Main}>
        <video className={styles.Video} autoPlay muted loop playsInline>
          <source src="/videos/yuvilanding.mp4" type="video/mp4" />
        </video>

        <div className={styles.Overlay}>
          <div className={styles.Marquee}>
            <h2>
              Origin-roasted. Dubai-made. Delivered to
              you.
            </h2>
          </div>
          <div className={styles.Content}>
            <div className={styles.BottomText}>
              <h4>WHITE MANTIS COFFEE ROASTERS</h4>
              <p>
                Born in Dubai. Roasting since 2016. White
                Mantis is an Emirati-owned specialty
                roastery that sources rare beans direct
                from origin, roasts with precision in Al
                Quoz, and delivers coffee that's genuinely
                worth drinking — every single morning.
              </p>
            </div>
            <div className={styles.RightBottomText}>
              <p style={{ textAlign: "right" }}>Since 2020 Dubai</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
