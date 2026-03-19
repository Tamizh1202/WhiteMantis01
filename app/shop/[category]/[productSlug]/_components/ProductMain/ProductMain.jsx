"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ProductMain.module.css";
import Image from "next/image";
import productImg from "./1.png";
import Polygon from "./polygon.png";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useProductImage } from "../../_context/ProductImageContext";
import { formatImageUrl } from "@/lib/imageUtils";
import { getProductDetails } from "@/utils/PDPUtils";

// ... (existing imports and helpers) ...
const ProductMain = ({ product }) => {
  const { selectedImage, selectedVariant } = useProductImage(); // Use context
  const detailsRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const polygonRef = useRef(null);
  const middleRef = useRef(null);
  const topLeftRef = useRef(null);
  const topRightRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const isOutOfStock = product?.hasVariantOptions
    ? selectedVariant
      ? !selectedVariant.variantInStock
      : !product?.variants?.some((v) => v.variantInStock)
    : product?.inStock === false;

  const stockQuantity = product?.hasVariantOptions
    ? selectedVariant
      ? selectedVariant.variantStockQuantity
      : product?.variants?.[0]?.variantStockQuantity
    : product?.stockQuantity;

  const isLowStock = !isOutOfStock && stockQuantity > 0 && stockQuantity <= 10;

  const productImage =
    formatImageUrl(selectedImage) ||
    formatImageUrl(product?.productImage) ||
    productImg;
  const { leftDetails, rightDetails } = getProductDetails(product);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      ScrollTrigger.refresh();
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ctx;

    const init = async () => {
      // const { gsap } = await import("gsap");
      // const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      // const isMobile = window.innerWidth <= 640; // Removed local declaration

      ctx = gsap.context(() => {
        if (!detailsRef.current || !middleRef.current || !polygonRef.current)
          return;

        const leftItems = leftRef.current
          ? Array.from(leftRef.current.children)
          : [];
        const rightItems = rightRef.current
          ? Array.from(rightRef.current.children)
          : [];

        gsap.set([leftItems, rightItems], {
          autoAlpha: 0,
          y: 40,
        });

        gsap.set(polygonRef.current, {
          autoAlpha: 0,
          rotation: -45,
          y: 80,
          scale: 0.85,
        });

        gsap.set(middleRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: detailsRef.current,

            // 🔥 FIX: different start/end for mobile
            start: isMobile ? "top 65%" : "top 90%",
            end: isMobile ? "top 20%" : "top 30%",
            // markers: true,
            scrub: isMobile ? 0.6 : 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          middleRef.current,
          {
            y: () => {
              const imgRect = middleRef.current.getBoundingClientRect();
              const polyRect = polygonRef.current.getBoundingClientRect();

              const polyY = gsap.getProperty(polygonRef.current, "y");

              const imgCenter = imgRect.top + imgRect.height / 2;
              const polyCenter = polyRect.top + polyRect.height / 2 - polyY;

              return polyCenter - imgCenter;
            },
            scale: isMobile ? 0.6 : 0.95,
            ease: "none",
          },
          0,
        );

        tl.to(
          polygonRef.current,
          {
            autoAlpha: 1,
            rotation: 0,
            y: 0,
            scale: 1,
            ease: "power3.out",
          },
          0,
        );

        tl.to(
          leftItems,
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.1,
        );

        tl.to(
          rightItems,
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.1,
        );

        tl.to(
          [topLeftRef.current, topRightRef.current],
          {
            autoAlpha: 0,
            y: -30,
            ease: "power2.out",
          },
          0,
        );
      }, detailsRef);
    };

    init();

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
    return () => ctx && ctx.revert();
  }, [isMobile]);
  return (
    <div className={styles.main}>
      <div className={styles.MainConatiner}>
        <div className={styles.Top}>
          <div className={styles.left} ref={topLeftRef}>
            <div className={styles.LeftTop}>
              <h1>{product?.name || "Product Name"}</h1>
              <h3>{product?.tagline}</h3>
            </div>
            <div className={styles.LeftBottom}>
              <div>
                <h4>Farm</h4>
                <p>{product?.farm}</p>
              </div>

              <div>
                <h4>Tasting Notes</h4>
                <p>{product?.tastingNotes}</p>
              </div>

              <div>
                <h4>Variety</h4>
                <p>{product?.variety}</p>
              </div>
            </div>
          </div>
          <div className={styles.Middle} ref={middleRef}>
            <Image src={productImage} alt="Product" width={500} height={500} />
          </div>
          <div className={styles.Right} ref={topRightRef}>
            {product?.description}
            <div />
          </div>
        </div>
        <div className={styles.DetailsSection} ref={detailsRef}>
          <div className={styles.DetailsLeft} ref={leftRef}>
            {leftDetails.map((item, i) => (
              <div key={i}>
                <h4>{item.title}</h4>
                <p>{item.description || item.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.DetailsCenter} ref={polygonRef}>
            <Image src={Polygon} alt="Polygon" />
          </div>
          <div className={styles.DetailsRight} ref={rightRef}>
            {rightDetails.map((item, i) => (
              <div key={i}>
                <h4>{item.title}</h4>
                <p>{item.description || item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductMain;
