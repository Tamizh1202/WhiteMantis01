"use client";
import React from "react";
import styles from "./Landing.module.css";
import Image from "next/image";
import one from "./1.png";
import two from "./cropped.png";

const Landing = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainConatiner}>
          <div className={styles.LeftConatiner}>
            <div className={styles.LeftConatinerTop}>
              {/* <h3>Art & Science of Coffee Mastery</h3>
              <div className={styles.line}></div>
              <p>The White Mantis Roster</p> */}
            </div>
            <div className={styles.LeftConatinerBottom}>
              <Image src={one} alt="workshop image one" />
            </div>
          </div>
          <div className={styles.MiddleConatiner}>
            <div className={styles.MiddleConatinerTop}>
              <p>
                Learn directly from the people who source, roast, and brew it
                every day. Our workshops run from beginner tasting sessions to
                professional barista training — small groups, hands-on, inside
                our Al Quoz roastery.
              </p>
            </div>
            <div
              className={styles.MiddleConatinerBottom}
              onClick={() => {
                const el = document.getElementById("upcoming-workshops");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.MiddleConatinerBottomLeft}>
                <h5>Explore Workshops</h5>
              </div>
              <div className={styles.MiddleConatinerBottomRight}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1H11V9.59L1.41 0L0 1.41L9.59 11H1V13H13V1Z"
                    fill="#6C7A5F"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.RightConatiner}>
            <Image src={two} alt="workshop image two" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
