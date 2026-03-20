"use client";
import React, { useLayoutEffect, useRef } from "react";

import styles from "./Steps.module.css";
import TopImage1 from "./1.png";
import TopImage2 from "./2.png";
import TopImage3 from "./3.png";
import TopImage4 from "./4.png";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const stepsData = [
  {
    title: "SELECT YOUR FORMAT",
    description:
      "Choose your physical type: Coffee Beans, Capsules, or Drip Bags. This selection determines your immediate brewing and customization options.",
  },
  {
    title: "DEFINE YOUR COFFEE PROFILE",
    description:
      "Curate your perfect flavor: Use Category, Brew Method, Origin, and Process filters to find your ideal blend and product name.",
  },
  {
    title: "SET YOUR SCHEDULE & QUANTITY",
    description:
      "Customize your schedule: Confirm the number of bags per shipment and your delivery frequency. Select your total duration from the 3, 6, or 12-month plans.",
  },
  {
    title: "REVIEW & CHECKOUT",
    description:
      "Review, pay, and receive: Your customized coffee arrives fresh. Subscription will not auto-renew, and you can cancel anytime.",
  },
];

const imgs = [TopImage1, TopImage2, TopImage3, TopImage4];
const BREAKPOINT = 1240;
const DOT_RADIUS = 8;
const DOT_RADIUS_MOBILE = 7;

export default function Steps() {
  const rootRef = useRef(null);
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const baselineRef = useRef(null);
  const activeLineRef = useRef(null);
  const centersRef = useRef([]);
  const baselineWidthRef = useRef(0);

  useLayoutEffect(() => {
    let tl = gsap.timeline();

    
  }, []);

  return (
    <div className={styles.main} ref={rootRef}>
      <div className={styles.MainConatiner}>
        <div className={styles.TopSection}>
          <div className={styles.TopImage}>
            <img ref={imgARef} className={styles.layerImg} alt="imgA" />
            <img
              ref={imgBRef}
              className={`${styles.layerImg} ${styles.layerTop}`}
              alt="imgB"
            />
          </div>
        </div>

        <div className={styles.BottomSection}>
          <div className={styles.BottomTop}>
            <h3>HOW IT WORKS ?</h3>
          </div>

          <div className={styles.BottomBottom}>
            <div className={styles.BottomBottomWrapper}>
              <div className={styles.BottomBottomTop}>
                {stepsData.map((step, i) => (
                  <div key={i} data-step={i} className={styles.stepBox}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>

              <div className={styles.timeline}>
                <div ref={baselineRef} className={styles.timelineBaseline} />
                <div ref={activeLineRef} className={styles.timelineActive} />
                {stepsData.map((_, i) => (
                  <span key={i} data-dot={i} className={styles.dot} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
