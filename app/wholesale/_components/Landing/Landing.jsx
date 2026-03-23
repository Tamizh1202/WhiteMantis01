import React from "react";
import styles from "./Landing.module.css";
import Link from "next/link";

const Landing = () => {
  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.Left}></div>

        <div className={styles.Right}>
          <div className={styles.RightTop}>
            <p>
              We've been supplying cafés, restaurants,
              hotels, and offices across Dubai for over a
              decade. What we offer isn't just coffee —
              it's a complete program: bean selection,
              recipe development, barista training, and a
              team that picks up the phone.
            </p>
          </div>

          <Link href="#wholesaleEnquiry" className={styles.RightBottom}>
            <h4>Explore WHOLESALE </h4>
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="29" height="29" stroke="white" />
              <path
                d="M21.0469 8.85938H19.0469V17.4494L9.45687 7.85938L8.04688 9.26937L17.6369 18.8594H9.04688V20.8594H21.0469V8.85938Z"
                fill="white"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
