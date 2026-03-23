import React from "react";
import styles from "./Community.module.css";
import Image from "next/image";
import Link from "next/link";
import one from "./1.png";

const Community = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainConatiner}>
          <div className={styles.Top}>
            <div className={styles.TopLeft}>
              <h3>
                We built this in Dubai.
                <br /> For Dubai.
              </h3>
            </div>
            <div className={styles.TopRight}>
              <p>
                White Mantis started because Dubai
                deserved better specialty coffee — not
                imported and relabelled, but sourced with
                care, roasted with intention, and served
                with full transparency from farm to cup. We
                work directly with farmers in Ethiopia,
                Colombia, Indonesia, and beyond. We roast
                small batches in Al Quoz and share every
                detail: origin, process, elevation, tasting notes. We support the cafés and
                businesses that pour our coffee, and we
                take the time to help their teams
                understand what they're serving. This is
                not a commodity business. We're building
                something with a long view — a roastery
                that represents Dubai on the world stage.
              </p>
              <Link href="/about-us">
                <button className={styles.knowMore}>
                  <span>Read Our Story</span>

                  <svg
                    width="13"
                    height="14"
                    viewBox="0 0 13 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.9941 12.1425H10.9951V3.45074L1.40959 13.1543L0.000253677 11.7276L9.58574 2.02405H0.999784V0.000364304H12.9941V12.1425Z"
                      fill="#6C7A5F"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
          <div className={styles.Bottom}>
            <Image src={one} alt="whitemantis" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
