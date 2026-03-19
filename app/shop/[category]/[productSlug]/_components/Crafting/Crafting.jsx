"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "./Crafting.module.css";
import Image from "next/image";
import { CraftingComponentData } from "@/utils/PDPUtils";
import image from "./1.png";    

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const IMAGE_URL = `${BACKEND_URL}${process.env.NEXT_PUBLIC_CRAFTING_IMAGE_URL}`
const VIDEO_URL = `${BACKEND_URL}${process.env.NEXT_PUBLIC_CRAFTING_VIDEO_URL}`

const Crafting = ({ product }) => {
  const specsRef = useRef(null);
  const [syncedHeight, setSyncedHeight] = useState(0);

  const craftingData = CraftingComponentData(product.brewGuide) || {};
  const [active, setActive] = useState(Object.keys(craftingData)[0] || null);

  const current = active ? craftingData[active] : null;

  useLayoutEffect(() => {
    if (!specsRef.current) return;

    const updateHeight = () =>
      setSyncedHeight(specsRef.current.offsetHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(specsRef.current);

    return () => observer.disconnect();
  }, [active]);

  if (!active || !current) return null;

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>

        <div className={styles.Left}>
          <div className={styles.LeftTop}>
            <h3>Brewing guide</h3>
          </div>

          <div className={styles.LeftBottom}>

            <div className={styles.LeftBottomFilters}>
              {Object.keys(craftingData).map((key, index) => (
                <React.Fragment key={key}>
                  <div
                    className={`${styles.FilterName} ${active === key
                      ? styles.activeFilter
                      : styles.inactiveFilter
                      }`}
                    onClick={() => setActive(key)}
                  >
                    <h4 style={{ cursor: "pointer", textTransform: "capitalize" }}>{key}</h4>
                  </div>
                  {index < Object.keys(craftingData).length - 1 && <div className={styles.Line}></div>}
                </React.Fragment>
              ))}
            </div>


            <div className={styles.LeftBottomFiltersData}>
              <div
                className={styles.LeftBottomFiltersDataImage}
                style={{ height: syncedHeight }}
              >
                {VIDEO_URL ? (
                  <video
                    key={VIDEO_URL}
                    src={VIDEO_URL}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.videoveer}
                  />
                ) : (
                  <Image src={IMAGE_URL} alt={active} width={500} height={500} />
                )}
              </div>

              <div
                className={styles.LeftBottomFiltersDataInfo}
                ref={specsRef}
              >
                {current.map((item, i) => (
                  <div className={styles.one} key={i}>
                    <h4>{item.title}</h4>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.Right}>
          <div className={styles.RightTop}>
            <p>To achieve exceptional coffee, prepare your clean brewing tools and be consistent with grind size (based on roast date/method), water quality, weight, ratios, and time. Remember, let your palate guide you to personalize the best recipe, so brew often and have fun!</p>
          </div>

          <div
            className={styles.RightBottom}
            style={{ height: syncedHeight }}
          >
            <Image src={image} alt="Brewing Guide" width={500} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crafting;
