"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ProductMain.module.css";
import Image from "next/image";
import productImg from "./1.png";
import Polygon from "./polygon.png";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Observer from "gsap/Observer";
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
  const containerRef = useRef(null);
  const leftRefDetails = useRef([]);
  const rightRefDetails = useRef([]);

  const polygonRefImage = useRef(null);

  const topRef = useRef(null);
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
    }; // Initial check

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // console.log("Bottom: ", polygonRef.current.getBoundingClientRect().bottom);
    let ctx;

    const init = async () => {
      // const { gsap } = await import("gsap");
      // const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsap.registerPlugin(Observer); // const isMobile = window.innerWidth <= 640; // Removed local declaration
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: true });
        tl.timeScale(0.4); // console.log("Timeline active: ", tl.isActive());

        tl.fromTo(
          [topLeftRef.current, topRightRef.current],
          { opacity: 0, y: -500 },
          { opacity: 1, y: 0 },
          0,
        );

        tl.fromTo(
          [leftRef.current, rightRef.current],
          { opacity: 1, y: 0 },
          { opacity: 0, y: 500 },
          0,
        );
        tl.fromTo(
          [leftRefDetails.current],
          { opacity: 1, x: 0 },
          { opacity: 0, x: 200, stagger: 0.1 },
          0,
        );
        tl.fromTo(
          [rightRefDetails.current],
          { opacity: 1, x: 0 },
          { opacity: 0, x: -200, stagger: 0.1 },
          0,
        );
        tl.fromTo(
          [polygonRefImage.current],
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            origin: "center center",
            perspective: 1000,
          },
          { rotateX: -180, scale: 0.5, y: 600 },
          0,
        ); // Check scroll position for initial state

        if (window.scrollY > 100) {
          tl.progress(0);
        } else {
          tl.progress(1);
        }

        Observer.create({
          target: containerRef.current,
          type: "wheel,touch",
          onUp: (self) => {
            // console.log("Up in this section");
            tl.play();
          },
          onDown: (self) => {
            // console.log("Down in this section");
            tl.reverse();
          },
          tolerance: 10, // wheelSpeed: -1,
          // preventDefault: ,
        });
      }, containerRef);
    };

    init();

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
    return () => ctx && ctx.revert();
  }, [isMobile]);
  return (
    <div className={styles.main}>
            
      <div className={styles.MainConatiner} ref={containerRef}>
                
        <div className={styles.Top} ref={topRef}>
                    
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
              <div
                key={i}
                ref={(el) => (leftRefDetails.current[i] = el)}
                className={styles.detailItem}
              >
                                
                <h4 className={styles.detailTitle}>{item.title}</h4>
                                
                <p className={styles.detailDesc}>
                                    {item.description || item.desc}
                                  
                </p>
                              
              </div>
            ))}
                      
          </div>
                    
          <div className={styles.DetailsCenter} ref={polygonRef}>
                        
            <Image src={Polygon} alt="Polygon" ref={polygonRefImage} />
                      
          </div>
                    
          <div className={styles.DetailsRight} ref={rightRef}>
                        
            {rightDetails.map((item, i) => (
              <div
                key={i}
                ref={(el) => (rightRefDetails.current[i] = el)}
                className={styles.detailItem}
              >
                                
                <h4 className={styles.detailTitle}>{item.title}</h4>
                                
                <p className={styles.detailDesc}>
                                    {item.description || item.desc}
                                  
                </p>
                              
              </div>
            ))}
                      
          </div>
                  
        </div>
              
      </div>
          
    </div>
  );
};
export default ProductMain;
