"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Recommendation.module.css";
import Image from "next/image";
import Wishlist from "../../../../../_components/Whishlist";
import AddToCart from "../../../../../_components/AddToCart";
import { formatImageUrl } from "@/lib/imageUtils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BuyNowPopup from "@/app/shop/[category]/_components/Listing/_components/BuyNowPopup/BuyNowPopup";
import SubscriptionPopup from "@/app/shop/[category]/_components/Listing/_components/SubscriptionPopup";
import AddToCartPopup from "@/app/_components/AddToCartPopup/AddToCartPopup";
import { getSmallestVariantDisplayData } from "@/app/_utils/productVariants";

const Recommendation = ({ product }) => {
  const params = useParams();
  const router = useRouter();
  const { category } = params;

  // Subscription Popup State
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(2);
  const popupRef = useRef(null);

  // Add to Cart Popup State
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [productForCart, setProductForCart] = useState(null);

  useEffect(() => {
    if (!showSubscribePopup) return;
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSubscribePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSubscribePopup]);

  if (!product || !Array.isArray(product) || product.length === 0) {
    return null;
  }

  // Helper to get display data - Using shared utility
  const getDisplayData = (product) => {
    return getSmallestVariantDisplayData(product);
  };

  const handleOpenSubscribePopup = (p) => {
    let subFreqs = [];
    let discount = 0;

    if (p.hasVariantOptions && p.variants?.length > 0) {
      const subVariant =
        p.variants.find((v) => v.hasVariantSub) || p.variants[0];
      subFreqs = subVariant.subFreq || [];
      discount = subVariant.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: p,
        variant: subVariant,
        isVariant: true,
        discount,
        subFreqs,
      });
    } else {
      subFreqs = p.subFreq || [];
      discount = p.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: p,
        isVariant: false,
        discount,
        subFreqs,
      });
    }

    if (subFreqs.length > 0) {
      setSelectedFrequency(subFreqs[0]);
    }

    setSelectedQuantity(2);
    setShowSubscribePopup(true);
  };

  const handleSubscriptionCheckout = () => {
    if (!selectedProduct || !selectedFrequency) return;
    const params = new URLSearchParams({
      mode: "subscription",
      productId: selectedProduct.parent.id,
      subscriptionId: selectedFrequency.id || selectedFrequency._id || "",
      variationId: selectedProduct.isVariant ? selectedProduct.variant.id : "",
      quantity: selectedQuantity.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const getFrequencyLabel = (freq) => {
    if (!freq) return "";
    const plural = freq.duration > 1 ? "s" : "";
    return `Every ${freq.duration} ${freq.interval}${plural}`;
  };

  const handleOpenCartPopup = (item) => {
    setProductForCart(item);
    setShowCartPopup(true);
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainConatiner}>
          <div className={styles.Top}>
            <h3>YOU MAY ALSO LIKE</h3>
          </div>

          <div className={styles.Bottom}>
            <div className={styles.ProductsGrid}>
              {product.map((item) => {
                const displayData = getDisplayData(item);
                const cartProduct = {
                  productId: item.id,
                  variationId: item.hasVariantOptions
                    ? item.variants?.[0]?.id
                    : null,
                  quantity: 1,
                };
                const isOutOfStock = item.hasVariantOptions
                  ? !item.variants?.some((v) => v.variantInStock)
                  : item.inStock === false;

                const stockQuantity = item.hasVariantOptions
                  ? item.variants?.[0]?.variantStockQuantity
                  : item.stockQuantity;

                const isLowStock =
                  !isOutOfStock && stockQuantity > 0 && stockQuantity <= 10;

                const productUrl = `/shop/${category}/${item.slug}`;

                return (
                  <div className={styles.ProductCard} key={item.id}>
                    <div className={styles.ProductTop}>
                      {isLowStock && (
                        <div className={styles.LowStockBadge}>
                          Only few left
                        </div>
                      )}
                      <div className={styles.WishlistIcon}>
                        <Wishlist product={item} />
                      </div>
                      <Link
                        href={productUrl}
                        className={`${styles.ProductImage} ${isOutOfStock ? styles.Muted : ""}`}
                      >
                        {displayData.image ? (
                          <Image
                            src={displayData.image}
                            alt={item.name}
                            width={300}
                            height={300}
                          />
                        ) : (
                          <div className={styles.NoImage}>No Image</div>
                        )}
                      </Link>
                    </div>

                    <div className={styles.ProductBottom}>
                      <Link
                        href={productUrl}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className={styles.ProductInfo}>
                          <div className={styles.ProductPrice}>
                            <h4>AED {displayData.price}</h4>
                            {displayData.sale_price &&
                              displayData.sale_price !==
                                displayData.regular_price && (
                                <p className={styles.OldPrice}>
                                  AED {displayData.regular_price}
                                </p>
                              )}
                          </div>
                          <div className={styles.Line}></div>
                          <div className={styles.ProductName}>
                            <h3>{`${item.name} ${item.tagline || ""}`}</h3>
                            <p>{item.tastingNotes}</p>
                          </div>
                        </div>
                      </Link>

                      <div className={styles.ProductActions}>
                        {isOutOfStock ? (
                          <div className={styles.OutOfStockRow}>
                            <button className={styles.OutOfStockBtn} disabled>
                              Out of Stock
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className={styles.DesktopActions}>
                              {item.hasVariantOptions &&
                              item.variants?.length > 1 ? (
                                <button
                                  className={styles.AddToCart}
                                  onClick={() => handleOpenCartPopup(item)}
                                >
                                  Add to Cart
                                </button>
                              ) : (
                                <AddToCart product={cartProduct} />
                              )}
                              {(item.hasSimpleSub ||
                                (item.hasVariantOptions &&
                                  item.variants?.some(
                                    (v) => v.hasVariantSub,
                                  ))) && (
                                <button
                                  className={styles.Subscribe}
                                  onClick={() => handleOpenSubscribePopup(item)}
                                >
                                  Subscribe
                                </button>
                              )}
                            </div>
                            <div className={styles.MobileActions}>
                              {item.hasVariantOptions &&
                              item.variants?.length > 1 ? (
                                <button
                                  className={styles.AddToCart}
                                  onClick={() => handleOpenCartPopup(item)}
                                  style={{
                                    width: "100%",
                                    backgroundColor: "#6C7A5F",
                                    color: "#ffffff",
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    border: "none",
                                    padding: "12px 22px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Buy Now
                                </button>
                              ) : (
                                <BuyNowPopup
                                  product={item}
                                  getDisplayData={getDisplayData}
                                  handleOpenSubscribePopup={
                                    handleOpenSubscribePopup
                                  }
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
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

      <SubscriptionPopup
        showSubscribePopup={showSubscribePopup}
        setShowSubscribePopup={setShowSubscribePopup}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedFrequency={selectedFrequency}
        setSelectedFrequency={setSelectedFrequency}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleSubscriptionCheckout={handleSubscriptionCheckout}
        getFrequencyLabel={getFrequencyLabel}
        popupRef={popupRef}
        styles={styles}
      />

      {/* Add to Cart Popup */}
      <AddToCartPopup
        showCartPopup={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        selectedProduct={productForCart}
      />
    </>
  );
};

export default Recommendation;
