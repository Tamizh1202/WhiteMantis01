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
    title: "STEP 1 — PICK YOUR FORMAT",
    description:
      "Whole beans, drip bags, or Nespresso-compatible capsules. If you're not sure, whole beans give you the most flexibility.",
  },
  {
    title: "STEP 2 — CHOOSE YOUR COFFEE",
    description:
      "Filter by origin, roast level, or tasting notes. Or tell us how you brew — we'll suggest what works best for your setup.",
  },
  {
    title: "STEP 3 — SET YOUR DELIVERY SCHEDULE",
    description:
      "Customize your schedule: Confirm the number of bags per shipment and your delivery frequency. Select your total duration from the 3, 6, or 12-month plans.",
  },
  {
    title: "STEP 4 — REVIEW AND CONFIRM",
    description:
      "Double-check your choices, pay once, and your first bag ships within 2 days of roasting. Your subscription won't auto-renew — we'll remind you before it ends.",
  },
];

const imgs = [TopImage1, TopImage2, TopImage3, TopImage4];
const BREAKPOINT = 1240;
const n = stepsData.length;

export default function Steps() {
  const rootRef = useRef(null);
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const baselineRef = useRef(null);
  const activeLineRef = useRef(null);
  const timelineRef = useRef(null);
  const baselineSizeRef = useRef(0);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    let isMobile = window.innerWidth <= BREAKPOINT;
    let st = null;
    let ctx = null;
    let isMounted = true;
    let resizeTimer = null;

    const getDotEls = () => Array.from(root.querySelectorAll("[data-dot]"));
    const getStepEls = () => Array.from(root.querySelectorAll("[data-step]"));

    const measureBaseline = () => {
      if (!baselineRef.current) return;
      const rect = baselineRef.current.getBoundingClientRect();
      baselineSizeRef.current = isMobile ? rect.height : rect.width;
    };

    const computeDotPositions = () => {
      if (!isMobile || !timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const DOT_SIZE = 14;
      getStepEls().forEach((step, i) => {
        const h3 = step.querySelector("h3");
        if (!h3) return;
        const h3Rect = h3.getBoundingClientRect();
        const center = h3Rect.top + h3Rect.height / 2 - timelineRect.top - DOT_SIZE / 2;
        gsap.set(getDotEls()[i], { top: Math.max(0, center) });
      });
    };

    const getActiveIndex = (progress) =>
      Math.min(Math.floor(progress * n), n - 1);

    const updateFromProgress = (progress) => {
      if (!activeLineRef.current) return;

      const size = baselineSizeRef.current;
      if (isMobile) {
        gsap.set(activeLineRef.current, { height: `${progress * size}px` });
      } else {
        gsap.set(activeLineRef.current, { width: `${progress * size}px` });
      }

      const activeIndex = getActiveIndex(progress);

      getDotEls().forEach((dot, i) => {
        gsap.set(dot, {
          opacity: i <= activeIndex ? 1 : 0.45,
          scale: i === activeIndex ? 1.15 : 1,
        });
      });

      getStepEls().forEach((step, i) => {
        gsap.set(step, { opacity: i === activeIndex ? 1 : 0.35 });
      });

      if (
        imgs[activeIndex] &&
        imgARef.current &&
        imgARef.current.dataset.current !== String(activeIndex)
      ) {
        imgARef.current.src = imgs[activeIndex].src ?? imgs[activeIndex];
        imgARef.current.dataset.current = String(activeIndex);
        gsap.set(imgARef.current, { autoAlpha: 1 });
        if (imgBRef.current) gsap.set(imgBRef.current, { autoAlpha: 0 });
      }
    };

    const initVisuals = () => {
      measureBaseline();

      if (imgARef.current) {
        imgARef.current.src = imgs[0].src ?? imgs[0];
        imgARef.current.dataset.current = "0";
        gsap.set(imgARef.current, { autoAlpha: 1 });
      }
      if (imgBRef.current) gsap.set(imgBRef.current, { autoAlpha: 0 });

      if (isMobile) {
        gsap.set(activeLineRef.current, { width: "2px", height: "0px" });
      } else {
        gsap.set(activeLineRef.current, { height: "2px", width: "0px" });
      }

      getDotEls().forEach((d, i) =>
        gsap.set(d, {
          opacity: i === 0 ? 1 : 0.45,
          scale: i === 0 ? 1.15 : 1,
          ...(isMobile ? { xPercent: -50 } : {}),
        }),
      );
      getStepEls().forEach((s, i) =>
        gsap.set(s, { opacity: i === 0 ? 1 : 0.35 }),
      );

      computeDotPositions();
    };

    const buildST = () => {
      if (st) { st.kill(); st = null; }
      const pinDistance = window.innerHeight * (n + 0.5);
      st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: `+=${pinDistance}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (!isMounted) return;
          updateFromProgress(self.progress);
        },
        onRefresh() {
          measureBaseline();
          if (st) updateFromProgress(st.progress);
        },
      });
    };

    const rebuild = () => {
      if (ctx) ctx.revert();
      ctx = gsap.context(() => {
        initVisuals();
        buildST();
      }, root);
    };

    rebuild();
    ScrollTrigger.refresh();

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= BREAKPOINT;
        if (wasMobile !== isMobile) {
          rebuild();
          ScrollTrigger.refresh();
        } else {
          measureBaseline();
          computeDotPositions();
          if (st) updateFromProgress(st.progress);
        }
      }, 100);
    };

    window.addEventListener("resize", onResize);

    return () => {
      isMounted = false;
      clearTimeout(resizeTimer);
      if (st) st.kill();
      window.removeEventListener("resize", onResize);
      if (ctx) ctx.revert();
    };
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

              <div ref={timelineRef} className={styles.timeline}>
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
