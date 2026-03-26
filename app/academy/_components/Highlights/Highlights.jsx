import React from "react";
import styles from "./Highlights.module.css";
import Image from "next/image";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";
import four from "./4.png";

const highlightsData = [
  {
    id: 1,
    title: "Geisha Workshop Series",
    date: "October 2024",
    image: one,
  },
  {
    id: 2,
    title: "Roastery Tour",
    date: "September 2024",
    image: two,
  },
  {
    id: 3,
    title: "Barista Training",
    date: "August 2024",
    image: three,
  },
  {
    id: 4,
    title: "Cupping Session",
    date: "July 2024",
    image: four,
  },
];

const Highlights = () => {
  return (
    <div className={styles.main}>
      <div className={styles.MainConatiner}>
        <div className={styles.Heading}>
          <h3>COURSE HIGHLIGHTS</h3>
        </div>

        <div className={styles.BottomContainer}>
          {/* --- DESKTOP VIEW: structure unchanged --- */}
          <div className={styles.DesktopView}>
            <div className={styles.Left}>
              <div className={styles.imageWrapper}>
                <Image src={highlightsData[0].image} alt="Highlights Image" className={styles.image} />
                <div className={styles.overlay}>
                  <h4>{highlightsData[0].title}</h4>
                  <p>{highlightsData[0].date}</p>
                </div>
              </div>
            </div>

            <div className={styles.Right}>
              <div className={styles.RightTop}>
                <div className={styles.imageWrapper}>
                  <Image src={highlightsData[1].image} alt="Highlights Image" className={styles.image} />
                  <div className={styles.overlay}>
                    <h4>{highlightsData[1].title}</h4>
                    <p>{highlightsData[1].date}</p>
                  </div>
                </div>

                <div className={styles.imageWrapper}>
                  <Image src={highlightsData[2].image} alt="Highlights Image" className={styles.image} />
                  <div className={styles.overlay}>
                    <h4>{highlightsData[2].title}</h4>
                    <p>{highlightsData[2].date}</p>
                  </div>
                </div>
              </div>

              <div className={styles.RightBottom}>
                <div className={styles.imageWrapper}>
                  <Image src={highlightsData[3].image} alt="Highlights Image" className={styles.image} />
                  <div className={styles.overlay}>
                    <h4>{highlightsData[3].title}</h4>
                    <p>{highlightsData[3].date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- MOBILE VIEW: now mapped --- */}
          <div className={styles.MobileScroller}>
            {highlightsData.map((item) => (
              <div key={item.id} className={styles.imageWrapper}>
                <Image src={item.image} alt="Highlights Image" className={styles.image} />
                <div className={styles.overlay}>
                  <h4>{item.title}</h4>
                  <p>{item.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* <button data-newsletter="open" className={styles.DesktopOnlyBtn}>
            sample
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Highlights;