import React from "react";
import styles from "./Shop.module.css";
import Image from "next/image";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";
import Link from "next/link";

const Shop = ({ categories = [] }) => {
  // Find specific categories from backend data
  const beans = categories.find((cat) =>
    cat.title.toLowerCase().includes("beans"),
  );
  const dripbags = categories.find((cat) =>
    cat.title.toLowerCase().includes("dripbags"),
  );
  const capsules = categories.find((cat) =>
    cat.title.toLowerCase().includes("capsules"),
  );

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainConatiner}>
          <div className={styles.Top}>
            <h3>Find Your Coffee</h3>
          </div>
          <div className={styles.Botttom}>
            <Link
              href={`/shop/${beans?.slug || "coffee-beans"}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.One}>
                <div className={styles.OneTop}>
                  <div className={styles.OneTopTop}>
                    <h4>01</h4>
                    <h4>Whole Beans</h4>
                  </div>
                  <div className={styles.OneTopBottom}>
                    <p>
                      Single-origin and seasonal blends, roasted
                      to order in Al Quoz. Every bag reflects a
                      decision — about where it comes from, how
                      it's processed, and how it's meant to taste.
                    </p>
                    <div className={styles.arrowextra}>
                      <h5>Shop now</h5>
                      <svg
                        width="13"
                        height="14"
                        viewBox="0 0 13 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.9941 12.1425H10.9951V3.45074L1.40959 13.1543L0.000253677 11.7276L9.58574 2.02405H0.999784V0.000364304H12.9941V12.1425Z"
                          fill="#6C7A5F"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className={styles.OneBottom}>
                  <Image src={one} alt="sample" />
                </div>
              </div>
            </Link>
            <Link
              href={`/shop/${dripbags?.slug || "coffee-dripbags"}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.One}>
                <div className={styles.OneTop}>
                  <div className={styles.OneTopTop}>
                    <h4>02</h4>
                    <h4>Coffee Drips</h4>
                  </div>
                  <div className={styles.OneTopBottom}>
                    <p>
                      Specialty coffee that travels. Tear open,
                      pour over hot water, and get the same
                      roastery quality whether you're at the
                      office, in a hotel, or on the road.
                    </p>
                    <div className={styles.arrowextra}>
                      <h5>Shop now</h5>
                      <svg
                        width="13"
                        height="14"
                        viewBox="0 0 13 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.9941 12.1425H10.9951V3.45074L1.40959 13.1543L0.000253677 11.7276L9.58574 2.02405H0.999784V0.000364304H12.9941V12.1425Z"
                          fill="#6C7A5F"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className={styles.OneBottom}>
                  <Image src={two} alt="sample" />
                </div>
              </div>
            </Link>
            <Link
              href={`/shop/${capsules?.slug || "coffee-capsules"}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.One}>
                <div className={styles.OneTop}>
                  <div className={styles.OneTopTop}>
                    <h4>03</h4>
                    <h4>Coffee Capsules</h4>
                  </div>
                  <div className={styles.OneTopBottom}>
                    <p>
                      Nespresso-compatible. Specialty-grade. For
                      mornings when the machine does the work
                      — but the coffee still comes from
                      somewhere worth knowing.
                    </p>
                    <div className={styles.arrowextra}>
                      <h5>Shop now</h5>
                      <svg
                        width="13"
                        height="14"
                        viewBox="0 0 13 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.9941 12.1425H10.9951V3.45074L1.40959 13.1543L0.000253677 11.7276L9.58574 2.02405H0.999784V0.000364304H12.9941V12.1425Z"
                          fill="#6C7A5F"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={styles.OneBottom}>
                  <Image src={three} alt="sample" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
