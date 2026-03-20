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
                <h3>Subscribe and save </h3>
                <p style={{width: "100%"}}>
                  Your coffee, always on time. Set your preferred delivery
                  schedule and receive freshly roasted coffee at regular
                  intervals. Enjoy added savings, priority roasting, and the
                  confidence of consistent quality in every delivery, so your
                  coffee routine stays effortless and uninterrupted.
                </p>
              </div>
              <div className={styles.RightTopButton}>
                <p>Explore subscription </p>
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
