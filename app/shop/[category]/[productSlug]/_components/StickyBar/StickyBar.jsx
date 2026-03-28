"use client";

import { useRouter } from "next/navigation";
import styles from "./StickyBar.module.css";
import { useCart } from "../../../../../_context/CartContext";
import { useProductImage } from "../../_context/ProductImageContext";
import React, { useState, useEffect, useRef } from "react";

const StickyBar = ({ product }) => {
  const router = useRouter();
  const { addToCart, refresh, items } = useCart();
  const { setSelectedImage, selectedVariant, setSelectedVariant } =
    useProductImage();
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
    product?.hasVariantOptions ? sortedVariants[0] : null,
  );

  const [qty, setQty] = useState(1);
  const [qtyError, setQtyError] = useState("");
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showWeightMenu, setShowWeightMenu] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSubWeight, setSelectedSubWeight] = useState(null);

  // Sync selectedWeight with context's selectedVariant
  useEffect(() => {
    if (product?.hasVariantOptions) {
      if (selectedWeight) {
        setSelectedVariant(selectedWeight);
        if (selectedWeight.variantImage?.url) {
          setSelectedImage(selectedWeight.variantImage);
        }
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedWeight, product, setSelectedVariant, setSelectedImage]);

  // Initial setup for simple product subscription defaults
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
    if (isOutOfStock) return;
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
    if (!selectedFrequency || isOutOfStock) {
      console.error(
        "Please select all subscription options or item is out of stock",
      );
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

    setShowSubscribe(false);
    router.push(`/checkout?${params.toString()}`);
  };

  const getFrequencyLabel = (freq) => {
    if (!freq) return "";
    return `Every ${freq.duration} ${freq.interval}${freq.duration > 1 ? "s" : ""}`;
  };

  // Determine current stock status
  const isOutOfStock = product?.hasVariantOptions
    ? !selectedWeight?.variantInStock
    : product?.inStock === false;

  const stockQuantity = product?.hasVariantOptions
    ? selectedWeight?.variantStockQuantity
    : product?.stockQuantity;

  const currentCartQty =
    items?.find(
      (item) =>
        item.product === product.id &&
        (!product.hasVariantOptions || item.vId === selectedWeight?.id),
    )?.quantity || 0;

  const isLowStock = !isOutOfStock && stockQuantity > 0 && stockQuantity <= 10;

  // Determine current price based on product type and selection
  const simplePrice = product?.hasVariantOptions
    ? selectedWeight?.variantSalePrice ||
      selectedWeight?.variantRegularPrice ||
      0
    : product?.salePrice || product?.regularPrice || 0;

  const subscriptionOptions = {
    quantities: [1, 2, 3], // Default bag amounts
    weights: sortedVariants.map((v) => v.variantName),
    frequencies: product?.hasVariantOptions
      ? selectedWeight?.subFreq
      : product?.subFreq || [],
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.Left}>
            <h4>{`${product?.name} ${product?.tagline}`}</h4>
            <p>{product?.tastingNotes || ""}</p>
          </div>

          <div className={styles.Center}>
            {product?.hasVariantOptions && (
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
                        {product?.variants?.map((v) => {
                          const variantOutOfStock = !v.variantInStock;
                          const variantLowStock =
                            !variantOutOfStock &&
                            v.variantStockQuantity > 0 &&
                            v.variantStockQuantity <= 10;

                          return (
                            <button
                              key={v.id}
                              className={`${styles.WeightMenuItem} ${variantOutOfStock ? styles.OutOfStockMenuItem : ""} ${variantLowStock ? styles.LowStockMenuItem : ""}`}
                              onClick={() => {
                                setSelectedWeight(v);
                                setShowWeightMenu(false);
                                setQty(1);
                                setQtyError("");
                              }}
                            >
                              {v.variantName}g
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.SingleWeight}>
                    {selectedWeight?.variantName}g
                  </div>
                )}
              </div>
            )}

            <div className={styles.CounterWrapper}>
              <div
                className={`${styles.CountIncDec} ${isOutOfStock ? styles.Muted : ""}`}
              >
                <button
                  onClick={() => {
                    setQty((q) => Math.max(1, q - 1));
                    setQtyError("");
                  }}
                  disabled={isOutOfStock || qty <= 1}
                >
                  −
                </button>
                <span>{String(qty).padStart(2, "0")}</span>
                <button
                  onClick={() => {
                    const maxAllowed = Math.min(
                      5 - currentCartQty,
                      stockQuantity - currentCartQty,
                    );
                    if (qty < maxAllowed) {
                      setQty((q) => q + 1);
                      setQtyError("");
                    } else {
                      if (qty + currentCartQty >= 5) {
                        setQtyError("Limit of 5 items per order reached");
                      } else if (qty + currentCartQty >= stockQuantity) {
                        setQtyError("Stock limit reached");
                      }
                    }
                  }}
                  disabled={
                    qty + currentCartQty >= 5 ||
                    qty + currentCartQty >= stockQuantity ||
                    isOutOfStock
                  }
                >
                  +
                </button>
              </div>
              {qtyError && <p className={styles.QtyError}>{qtyError}</p>}
            </div>
          </div>

          <div className={styles.Right}>
            {!isOutOfStock && <p className={styles.type}>Purchase type :</p>}

            <div className={styles.Cta}>
              {!isOutOfStock &&
                (selectedWeight?.hasVariantSub || product?.hasSimpleSub) && (
                  <button
                    className={styles.SubscribeCta}
                    onClick={() => setShowSubscribe(true)}
                  >
                    <span>Subscribe and Save 10–20% </span>

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

              {isOutOfStock ? (
                <button
                  className={`${styles.AddtoCartPriceCta} ${styles.DisabledCta}`}
                  disabled
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  className={styles.AddtoCartPriceCta}
                  onClick={handleBuyNow}
                >
                  {`Buy for AED ${simplePrice.toFixed(2)}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSubscribe &&
        (selectedWeight?.hasVariantSub || product?.hasSimpleSub) && (
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
                    {sortedVariants.map((v) => {
                      const vOutOfStock = !v.variantInStock;
                      const vLowStock =
                        !vOutOfStock &&
                        v.variantStockQuantity > 0 &&
                        v.variantStockQuantity <= 10;

                      return (
                        <button
                          key={v.id}
                          className={`${
                            selectedSubWeight === v.variantName
                              ? styles.ActiveFrequency
                              : styles.FrequencyBtn
                          } ${vOutOfStock ? styles.OutOfStockMenuItem : ""} ${vLowStock ? styles.LowStockMenuItem : ""}`}
                          onClick={() => {
                            setSelectedWeight(v);
                            setSelectedSubWeight(v.variantName);
                          }}
                        >
                          {v.variantName}g
                        </button>
                      );
                    })}
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
                    ? Number(
                        selectedWeight?.variantSalePrice ||
                          selectedWeight?.variantRegularPrice,
                      )
                    : Number(product.salePrice || product.regularPrice);

                  const discount = product.hasVariantOptions
                    ? Number(selectedWeight?.subscriptionDiscount) || 0
                    : Number(product.subscriptionDiscount) || 0;

                  const finalPrice =
                    discount > 0
                      ? basePrice - (basePrice * discount) / 100
                      : basePrice;

                  return (
                    <button
                      onClick={handleSubscription}
                      className={`${styles.PopupConfirm} ${isOutOfStock ? styles.DisabledCta : ""}`}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? (
                        "Out of Stock"
                      ) : (
                        <>
                          Subscribe – AED{" "}
                          {Math.round(finalPrice * selectedQuantity)}
                          {discount > 0 && <> (Save {discount}%)</>}
                        </>
                      )}
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
