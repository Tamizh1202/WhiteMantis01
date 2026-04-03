"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "./Crafting.module.css";
import Image from "next/image";
import image from "./1.png";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const Crafting = ({ product, brewingGuide }) => {

  console.log("brewingGuide", brewingGuide);
  const specsRef = useRef(null);
  const [syncedHeight, setSyncedHeight] = useState(0);

  // Use dynamic brewingGuide from category if available, otherwise fallback to product.brewGuide
  const tabs = brewingGuide?.tabs || [];

  // Initialize active tab with the first tab name
  const [activeTabName, setActiveTabName] = useState(tabs[0]?.tabName || null);

  // Find the current active tab data
  const currentTab =
    tabs.find((tab) => tab.tabName === activeTabName) || tabs[0];

  // Set active tab name if not set and tabs available
  if (!activeTabName && tabs.length > 0) {
    setActiveTabName(tabs[0].tabName);
  }

  const VIDEO_URL = currentTab?.video?.url
    ? `${BACKEND_URL}${currentTab.video.url}`
    : null;
  const IMAGE_URL = image;

  useLayoutEffect(() => {
    if (!specsRef.current) return;

    const updateHeight = () => setSyncedHeight(specsRef.current.offsetHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(specsRef.current);

    return () => observer.disconnect();
  }, [activeTabName]);

  if (tabs.length === 0) return null;

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>
        <div className={styles.Left}>
          <div className={styles.LeftTop}>
            <h3>Brewing guide</h3>
          </div>

          <div className={styles.LeftBottom}>
            <div className={styles.LeftBottomFilters}>
              {tabs.map((tab, index) => (
                <React.Fragment key={tab.id || index}>
                  <div
                    className={`${styles.FilterName} ${
                      activeTabName === tab.tabName
                        ? styles.activeFilter
                        : styles.inactiveFilter
                    }`}
                    onClick={() => setActiveTabName(tab.tabName)}
                  >
                    <h4
                      style={{ cursor: "pointer", textTransform: "capitalize" }}
                    >
                      {tab.tabName}
                    </h4>
                  </div>
                  {index < tabs.length - 1 && (
                    <div className={styles.Line}></div>
                  )}
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
                  <Image
                    src={IMAGE_URL}
                    alt={activeTabName}
                    width={500}
                    height={500}
                  />
                )}
              </div>

              <div className={styles.LeftBottomFiltersDataInfo} ref={specsRef}>
                {currentTab?.parameters?.map((item, i) => (
                  <div className={styles.one} key={item.id || i}>
                    <h4>{item.label}</h4>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.Right}>
          <div className={styles.RightTop}>
            <p>
              To achieve exceptional coffee, prepare your clean brewing tools
              and be consistent with grind size (based on roast date/method),
              water quality, weight, ratios, and time. Remember, let your palate
              guide you to personalize the best recipe, so brew often and have
              fun!
            </p>
          </div>

          <div className={styles.RightBottom} style={{ height: syncedHeight }}>
            <Image src={image} alt="Brewing Guide" width={500} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crafting;
