"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname } from "next/navigation";
import styles from "./Begins.module.css";
import Image from "next/image";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";

const slides = [
  { id: 1, src: one, label: "Hambella Estate, Ethiopia" },
  { id: 2, src: two, label: "Santa Leticia Estate, El Salvador" },
  { id: 3, src: three, label: "Geisha Village, Ethiopia" },
  { id: 4, src: one, label: "Aalamin — Central Sumatra, Indonesia" },
  { id: 5, src: two, label: "Thogarihunkal Estate, India" },
];

export default function Begins() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "keepSnaps",  // ← was false, this stops it at the last slide
  });

  // Navigation logic
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    const snapList = emblaApi.scrollSnapList();
    const lastSnap = snapList[snapList.length - 1];
    const currentSnap = snapList[emblaApi.selectedScrollSnap()];
    setNextBtnDisabled(currentSnap >= lastSnap);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    emblaApi.on("settle", onSelect);   // ← this is the fix, fires after drag settles
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(rafId);
      setMounted(false);
    };
  }, [pathname]);

  if (!mounted) {
    return (
      <section className={styles.Main}>
        <div className={styles.MainContainer}>
          <div className={styles.Top}>
            <h3>WHERE OUR COFFEE BEGINS</h3>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.Main} key={`wholesale-carousel-${pathname}`}>
      <div className={styles.MainContainer}>
        <div className={styles.Top}>
          <h3>WHERE OUR COFFEE BEGINS</h3>

          {/* Navigation Buttons */}
          <div className={styles.controls}>
            <button
              className={styles.navButton}
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              aria-label="Previous slide"
            >
              <svg width="47" height="47" viewBox="0 0 47 47" fill="none">
                <circle cx="23.5" cy="23.5" r="23.5" fill="#6C7A5F" />
                <path d="M27 16L20 23.5L27 31" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className={styles.navButton}
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              aria-label="Next slide"
            >
              <svg width="47" height="47" viewBox="0 0 47 47" fill="none">
                <circle cx="23.5" cy="23.5" r="23.5" fill="#6C7A5F" />
                <path d="M20 16L27 23.5L20 31" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.track}>
            {slides.map((s) => (
              <div key={`wholesale-slide-${s.id}`} className={styles.cardWrap}>
                <div className={styles.card}>
                  <Image src={s.src} alt={s.label} fill sizes="(max-width: 1440px) 540px" style={{ objectFit: "cover" }} draggable={false} />
                </div>
                <p className={styles.caption}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}