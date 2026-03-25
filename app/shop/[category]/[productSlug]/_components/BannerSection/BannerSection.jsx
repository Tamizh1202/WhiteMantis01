"use client";
import React from "react";
import Image from "next/image";
import styles from "./BannerSection.module.css";
import banner from "./1.png";
const BannerSection = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.bgWrap}>
        <Image
          src={banner}
          alt="coffee farm"
          fill
          sizes="(min-width: 1200px) 100vw, 100vw"
          priority
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <div className={styles.card}>
          <h3 className={styles.title}>
            SUSTAINABILITY & TRACEABILITY
          </h3>
          <p className={styles.text}>
            Selective hand-picking, small-lot processing, and transparent premiums support long-term soil health and producer livelihoods. Each bag is traceable to plot and process date, ensuring the clarity you taste is matched by clarity in sourcing.
          </p>
        </div>
      </div>
    </section>
  );
};
export default BannerSection;







