'use client'
import React from "react";
import styles from "./Recommendation.module.css";
import Image from "next/image";
import primg from "./1.png";
import Wishlist from "../../../../../_components/Whishlist";
import AddToCart from "../../../../../_components/AddToCart";
import { formatImageUrl } from "@/lib/imageUtils";
import Link from "next/link";
import { useParams } from "next/navigation";

const Recommendation = ({ product }) => {

  const params = useParams();
  const { category } = params;

  if (!product || !Array.isArray(product) || product.length === 0) {
    return null;
  }

  const getLowestWeightPrice = (item) => {
    if (item.hasVariantOptions && item.variants && item.variants.length > 0) {
      // Sort variants by extracting number from variantName (e.g., "250g" -> 250)
      const sortedVariants = [...item.variants].sort((a, b) => {
        const weightA = parseInt(a.variantName) || 0;
        const weightB = parseInt(b.variantName) || 0;
        return weightA - weightB;
      });
      const lowest = sortedVariants[0];
      return {
        regularPrice: lowest.variantRegularPrice,
        salePrice: lowest.variantSalePrice,
      };
    }
    return {
      regularPrice: item.regularPrice,
      salePrice: item.salePrice,
    };
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainConatiner}>
          <div className={styles.Top}>
            <h3>YOU MAY ALSO LIKE</h3>
          </div>

          <div className={styles.Bottom}>
            <div className={styles.BottomTop}>
              {product.map((item, index) => {
                const { regularPrice, salePrice } = getLowestWeightPrice(item);
                return (
                  <div className={item.cardClass || styles[`RCard${(index % 3) + 1}`]} key={item.id || index}>
                    <div className={styles.RCardTop}>
                      <div className={styles.WishlistIcon} style={{ position: 'relative', zIndex: 10 }}>
                        <Wishlist product={item} />
                      </div>

                      <div className={styles.ProductImage}>
                        <Image
                          src={formatImageUrl(item.productImage)}
                          alt={item.name || "Product Image"}
                          width={300}
                          height={300}
                        />
                      </div>
                    </div>

                    <div className={styles.RCardInfo}>
                      <div className={styles.RCardPricing}>
                        {salePrice ? (
                          <>
                            <h4>AED {salePrice}</h4>
                            <p>AED {regularPrice}</p>
                          </>
                        ) : (
                          <h4>AED {regularPrice || "Price N/A"}</h4>
                        )}
                      </div>

                      <div className={styles.Line}></div>

                      <div className={styles.RCardTitle}>
                        <h4>{item.name}</h4>
                        <p>{item.tagline}</p>
                      </div>
                    </div>

                    <div className={styles.RCardBottom}>
                      <AddToCart />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.BottomBottom}>
              <Link href={`/shop/${category}`} className={styles.Exploremore}>
                Explore more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recommendation;
