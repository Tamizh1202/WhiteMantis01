"use client";

import { useRouter } from "next/navigation";
import styles from "./StickyBar.module.css";
import { useCart } from "../../../../../_context/CartContext";
import { useProductImage } from "../../_context/ProductImageContext";
import React, { useState, useEffect, useRef } from "react";

const StickyBar = ({ product }) => {
  const router = useRouter();
  const { addToCart, refresh } = useCart();
  const { setSelectedImage } = useProductImage();
  const popupRef = useRef(null);

  // Helper to get variants sorted by weight
  const getSortedVariants = (item) => {
    if (!item?.variants || item.variants.length === 0) return [];
    return [...item.variants].sort((a, b) => {
      const weightA = parseInt(a.variantName) || 0;
      const weightB = parseInt(b.variantName) || 0;
      return weightA - weightB;
    });
  };

  const sortedVariants = getSortedVariants(product);
  const [selectedWeight, setSelectedWeight] = useState(
    product?.hasVariantOptions ? sortedVariants[0] : null
  );

  const [qty, setQty] = useState(1);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showWeightMenu, setShowWeightMenu] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSubWeight, setSelectedSubWeight] = useState(null);

  // Initialize subscription defaults when popup opens
  useEffect(() => {
    if (showSubscribe) {
      if (product?.hasVariantOptions && selectedWeight) {
        setSelectedSubWeight(selectedWeight.variantName);
        if (selectedWeight.subFreq?.length > 0) {
          setSelectedFrequency(selectedWeight.subFreq[0]);
        }
      } else if (product?.hasSimpleSub && product.subFreq?.length > 0) {
        setSelectedFrequency(product.subFreq[0]);
      }
    }
  }, [showSubscribe, selectedWeight, product]);

  // Handle buy now - add to cart
  const handleBuyNow = async () => {
    try {
      await addToCart(product.id, qty, selectedWeight?.id || null);
    } catch (error) {
      console.error("Error adding to cart from PDP:", error);
    }
  };

  useEffect(() => {
    if (!showSubscribe) return;

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSubscribe(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSubscribe]);

  // Handle subscription checkout
  const handleSubscription = () => {
    if (!selectedFrequency) {
      console.error("Please select all subscription options");
      return;
    }

    // Navigate to checkout with subscription details
    const params = new URLSearchParams({
      mode: "subscription",
      productId: product.id.toString(),
      variantId: selectedWeight ? selectedWeight.id.toString() : "",
      frequencyId: selectedFrequency.id.toString(),
      quantity: selectedQuantity.toString(),
    });

    router.push(`/checkout?${params.toString()}`);
  };

  const getFrequencyLabel = (freq) => {
    if (!freq) return "";
    return `Every ${freq.duration} ${freq.interval}${freq.duration > 1 ? "s" : ""}`;
  };

  // Determine current price based on product type and selection
  const simplePrice = product?.hasVariantOptions
    ? (selectedWeight?.variantSalePrice || selectedWeight?.variantRegularPrice || 0)
    : (product?.salePrice || product?.regularPrice || 0);

  const subscriptionOptions = {
    quantities: [1, 2, 3], // Default bag amounts
    weights: sortedVariants.map(v => v.variantName),
    frequencies: product?.hasVariantOptions ? selectedWeight?.subFreq : product?.subFreq || []
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.Left}>
            <h4>{`${product?.name} ${product?.tagline}`}</h4>
            <p>{product?.description || ""}</p>
          </div>

          <div className={styles.Center}>
            <div className={styles.WeightDropdown}>
              {product?.hasVariantOptions ? (
                <>
                  <button
                    className={styles.WeightSelect}
                    onClick={() => setShowWeightMenu((prev) => !prev)}
                  >
                    <span>{selectedWeight?.variantName}g</span>

                    <svg
                      width="13"
                      height="8"
                      viewBox="0 0 13 8"
                      xmlns="http://www.w3.org/2000/svg"
                      className={
                        showWeightMenu ? styles.RotateUp : styles.RotateDown
                      }
                    >
                      <path
                        d="M6.25635 0L0.0000755461 7.40326L12.5126 7.40326L6.25635 0Z"
                        fill="#6C7A5F"
                      />
                    </svg>
                  </button>

                  {showWeightMenu && (
                    <div className={styles.WeightMenu}>
                      {product?.variants?.map((v) => (
                        <button
                          key={v.id}
                          className={styles.WeightMenuItem}
                          onClick={() => {
                            setSelectedWeight(v);
                            setShowWeightMenu(false);
                          }}
                        >
                          {v.variantName}g
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.SingleWeight}>
                  {selectedWeight?.variantName}g
                </div>
              )}
            </div>

            <div className={styles.CountIncDec}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{String(qty).padStart(2, "0")}</span>
              <button
                onClick={() => setQty((q) => Math.min(5, q + 1))}
                disabled={qty >= 5}
                style={{
                  opacity: qty >= 5 ? 0.5 : 1,
                  cursor: qty >= 5 ? "not-allowed" : "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.Right}>
            <p className={styles.type}>Purchase type :</p>

            <div className={styles.Cta}>
              {(selectedWeight?.hasVariantSub || product?.hasSimpleSub) && (
                <button
                  className={styles.SubscribeCta}
                  onClick={() => setShowSubscribe(true)}
                >
                  <span>Subscribe &amp; save</span>

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="18"
                      height="18"
                      rx="9"
                      transform="matrix(-1 0 0 1 18 0)"
                      fill="#6C7A5F"
                    />
                    <path
                      d="M8 6L11 9L8 12"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <button
                className={styles.AddtoCartPriceCta}
                onClick={handleBuyNow}
              >
                Buy for AED {simplePrice.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSubscribe && (selectedWeight?.hasVariantSub || product?.hasSimpleSub) && (
        <div className={styles.PopupOverlay}>
          <div className={styles.Popup} ref={popupRef}>

            <button
              className={styles.PopupClose}
              onClick={() => setShowSubscribe(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <h3>COFFEE BEANS SUBSCRIPTION</h3>

            {/* Bag Amount */}
            <div className={styles.SubscriptionSection}>
              <h4>Bag Amount</h4>
              <div className={styles.FrequencyOptions}>
                {subscriptionOptions.quantities.map((quantity) => (
                  <button
                    key={quantity}
                    className={
                      selectedQuantity === quantity
                        ? styles.ActiveFrequency
                        : styles.FrequencyBtn
                    }
                    onClick={() => setSelectedQuantity(quantity)}
                  >
                    {quantity}x
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            {product.hasVariantOptions && (
              <div className={styles.SubscriptionSection}>
                <h4>Size</h4>
                <div className={styles.FrequencyOptions}>
                  {sortedVariants.map((v) => (
                    <button
                      key={v.id}
                      className={
                        selectedSubWeight === v.variantName
                          ? styles.ActiveFrequency
                          : styles.FrequencyBtn
                      }
                      onClick={() => {
                        setSelectedWeight(v);
                        setSelectedSubWeight(v.variantName);
                      }}
                    >
                      {v.variantName}g
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Frequency */}
            <div className={styles.SubscriptionSection}>
              <h4>Frequency</h4>
              <div className={styles.FrequencyOptions}>
                {subscriptionOptions.frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    className={
                      selectedFrequency?.id === freq.id
                        ? styles.ActiveFrequency
                        : styles.FrequencyBtn
                    }
                    onClick={() => setSelectedFrequency(freq)}
                  >
                    {getFrequencyLabel(freq)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.PopupActions}>
              {(() => {
                const basePrice = product.hasVariantOptions
                  ? Number(selectedWeight?.variantSalePrice || selectedWeight?.variantRegularPrice)
                  : Number(product.salePrice || product.regularPrice);

                const discount = product.hasVariantOptions
                  ? (Number(selectedWeight?.subscriptionDiscount) || 0)
                  : (Number(product.subscriptionDiscount) || 0);

                const finalPrice = discount > 0 ? basePrice - (basePrice * discount) / 100 : basePrice;

                return (
                  <button
                    onClick={handleSubscription}
                    className={styles.PopupConfirm}
                  >
                    Subscribe – AED {Math.round(finalPrice * selectedQuantity)}
                    {discount > 0 && <> (Save {discount}%)</>}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StickyBar;
