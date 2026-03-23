"use client";

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
              Set up your coffee once and never think
              about it again. Pick your roast, pick your
              format, pick your schedule — and we'll
              send freshly roasted coffee to your door
              every week, fortnight, or month. Pause or
              cancel anytime. Free delivery on 6 and 12-
              month plans.
            </p>
          </div>

          <div
            className={styles.RightBottom}
            onClick={() => {
              document
                .getElementById("Subscriptions")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <h4>Explore Subscriptions </h4>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
