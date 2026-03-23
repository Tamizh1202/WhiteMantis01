import React from "react";
import styles from "./WhyUs.module.css";
import Image from "next/image";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";
import four from "./4.png";

const WhyUs = () => {
  return (
    <>
      <div className={styles.Main}>
        <div className={styles.MainContainer}>
          <div className={styles.Top}>
            <h3>Why Choose Us ?</h3>
          </div>
          <div className={styles.Bottom}>
            <div className={styles.Card}>
              <div className={styles.ImageContainer}>
                <Image src={one} alt="Quality Assurance" />
              </div>
              <div className={styles.TextContainer}>
                <h3>Tailored Business Solutions </h3>
                <p>
                  We build your coffee program from scratch
                  — from bean selection to brew recipe to
                  staff training. No template. No generic
                  blend.
                </p>
              </div>
            </div>
            <div className={styles.Card}>
              <div className={styles.ImageContainer}>
                <Image src={two} alt="Quality Assurance" />
              </div>
              <div className={styles.TextContainer}>
                <h3>Sustainable & Ethical Sourcing </h3>
                <p>We pay above fair trade price, visit our farm
                  partners in person, and only work with
                  growers whose practices we can stand
                  behind publicly.</p>
              </div>
            </div>
            <div className={styles.Card}>
              <div className={styles.ImageContainer}>
                <Image src={three} alt="Quality Assurance" />
              </div>
              <div className={styles.TextContainer}>
                <h3>Expert Craftsmanship </h3>
                <p>
                  A decade of roasting means we've made
                  every mistake and fixed it. Our profiles are
                  built on data and refined by taste —
                  obsessively.
                </p>
              </div>
            </div>
            <div className={styles.Card}>
              <div className={styles.ImageContainer}>
                <Image src={four} alt="Quality Assurance" />
              </div>
              <div className={styles.TextContainer}>
                <h3>A Legacy of Quality </h3>
                <p>We were roasting specialty coffee in Dubai
                  before it was a trend. That early
                  commitment built something you can taste
                  in every bag today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyUs;
