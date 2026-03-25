"use client";
import React, { useEffect, useState } from "react";
import styles from "./TheRoster.module.css";
import Image from "next/image";
import One from "./1.png";
import Two from "./2.png";
import Three from "./3.png";

import CommunityPopup from "../CommunityPopup/CommunityPopup";

const images = [One, Two, Three];

const TheRoster = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.MainConatiner}>
        <div className={styles.Left}>
          <div className={styles.LeftTop}>
            <h3>The Inner Circle</h3>
            <p>
              First access to new roasts and seasonal
              releases before they go live. Brewing
              guides written by our team. Exclusive
              subscriber only deals. This is for people
              who take coffee seriously and want to
              know more than just what's in the bag.
            </p>
          </div>
          <div className={styles.LeftBottom}>
            <button
              className={styles.JoinBtn}
              onClick={() => setOpenPopup(true)}
            >
              Join the Inner Circle
            </button>
          </div>
        </div>

        <div className={styles.Right}>
          {images.map((img, index) => (
            <div
              key={index}
              className={`${styles.imageWrap} ${activeIndex === index ? styles.active : styles.inactive
                }`}
            >
              <Image src={img} alt="image" fill />
            </div>
          ))}
        </div>
      </div>
      <CommunityPopup isOpen={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
};

export default TheRoster;
