"use client";
import Image from "next/image";
import styles from "../page.module.css";
import placeholderImage from "../1.png";
import { formatImageUrl } from "@/lib/imageUtils";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import { useCart } from "../../_context/CartContext";

export default function OrderSummary({
  product,
  cartTotals,
  delivery,
  checkoutMode,
}) {
  const {
    openCouponModal,
    isBeansApplied,
    toggleBeans,
    beansBalance,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    coinConfig,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");

  return (
    <div className={styles.Right}>
      {/* ... abbreviated ... */}
      <div className={styles.RightOne}>
        <h3>ORDER SUMMARY</h3>
        <p>({product.length} items)</p>
      </div>

      {/* Item List */}
      <div className={styles.RightTwo}>
        {product.map((item, idx) => {
          const isSubscription = checkoutMode === "subscription";
          return (
            <div
              className={`${styles.SummaryItem} ${isSubscription ? styles.SubSummaryItem : ""}`}
              key={item.id || idx}
            >
              <div className={styles.ItemImage}>
                <Image
                  src={formatImageUrl(item.image) || placeholderImage}
                  alt={item.title || item.name}
                  width={80}
                  height={80}
                />
              </div>
              <div className={styles.ItemInfo}>
                <div className={styles.ItemMainRow}>
                  <div className={styles.ItemName}>
                    {item.name} {item.tagline}
                  </div>
                  {isSubscription && (
                    <div className={styles.ItemPrice}>
                      AED{" "}
                      {(
                        parseFloat(item.price?.final_price || item.price) || 0
                      ).toFixed(0)}
                    </div>
                  )}
                </div>
                {isSubscription ? (
                  <>
                    <div className={styles.ItemSubRow}>
                      {item?.vId && <span>{item?.variantName}g</span>}
                      {item?.vId && <span>&nbsp;|&nbsp;</span>}
                      <span>{item.quantity}x Bag amount</span>
                    </div>
                    {item?.frequency && (
                      <div className={styles.ItemFrequencyRow}>
                        {item.frequency}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item?.vId && <span>{item?.variantName}g</span>}
                    {item?.frequency && (
                      <div
                        className={styles.ItemFrequency}
                        style={{ fontSize: "12px", color: "#6e736a" }}
                      >
                        {item.frequency}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!isSubscription && (
                <>
                  <div className={styles.ItemQty}>×{item.quantity}</div>
                  <div className={styles.ItemPrice}>
                    AED{" "}
                    {(
                      parseFloat(item.price?.final_price || item.price) || 0
                    ).toFixed(0)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Coupons and Rewards Section */}
      <div className={styles.CouponSection}>
        <div className={styles.CouponHeader}>
          <h3>COUPONS AND REWARDS</h3>
          {checkoutMode !== "subscription" && !appliedCoupon && (
            <div className={styles.ViewAll} onClick={openCouponModal}>
              <span>View all coupons</span>
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9L5 5L1 1"
                  stroke="#6E736A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        {checkoutMode !== "subscription" &&
          (!appliedCoupon ? (
            <div className={styles.CouponInputGroup}>
              <input
                type="text"
                placeholder="Discount code or coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button onClick={() => applyCoupon(couponInput)}>Apply</button>
            </div>
          ) : (
            <div className={styles.AppliedCouponGroup}>
              <p className={styles.AppliedText}>
                {appliedCoupon.code} applied!
              </p>
              <div className={styles.AppliedRight}>
                <div className={styles.SavingsBadge}>
                  You saved AED {appliedCoupon.discount?.toFixed(0)}
                </div>
                <button
                  className={styles.RemoveCouponBtn}
                  onClick={removeCoupon}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                      fill="#2F362A"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

        <div
          className={`${styles.RewardsSection} ${checkoutMode === "subscription" ? styles.SubRewardsSection : ""}`}
        >
          <label
            className={`${styles.CheckboxContainer} ${beansBalance <= 0 ? styles.Disabled : ""}`}
            title={
              beansBalance <= 0
                ? "You don't have enough WM beans to use for this order."
                : ""
            }
          >
            <input
              type="checkbox"
              checked={isBeansApplied}
              onChange={toggleBeans}
              disabled={beansBalance <= 0}
            />
            <span className={styles.Checkmark}></span>
            <div className={styles.RewardsInfo}>
              <p className={styles.RewardsLabel}>Use White Mantis Beans</p>
              <p className={styles.RewardsBalance}>
                Total WM Beans: {beansBalance}
              </p>
            </div>
          </label>
          {beansBalance > 0 && (() => {
            const pointsToAed = coinConfig?.pointsToAed || 10;
            const beansToUse = Math.min(
              Math.floor(cartTotals.subtotal * 0.2 * pointsToAed),
              beansBalance
            );
            const savingAed = (beansToUse / pointsToAed).toFixed(2);
            return (
              <p className={styles.PotentialSavings}>
                <span>{beansToUse} Beans will be used · Save AED {savingAed}</span>
              </p>
            );
          })()}
        </div>
      </div>

      <div className={styles.RightThree}>
        <div className={styles.Subtotal}>
          <p>Subtotal</p>
          <h5>AED {cartTotals.subtotal.toFixed(2)}</h5>
        </div>

        {cartTotals.discount > 0 && (
          <div className={styles.Subtotal}>
            <p>Discount</p>
            <h5 style={{ color: "green" }}>
              - AED {cartTotals.discount.toFixed(2)}
            </h5>
          </div>
        )}

        {cartTotals.beansDiscount > 0 && (
          <div className={styles.Subtotal}>
            <p>Beans Discount</p>
            <h5 style={{ color: "green" }}>
              - AED {cartTotals.beansDiscount.toFixed(2)}
            </h5>
          </div>
        )}

        <div className={styles.Shipping}>
          <p>Shipping</p>
          <h5>
            {cartTotals.shipping === 0
              ? delivery === "pickup"
                ? "Free (Pickup)"
                : "Calculated at next step"
              : `AED ${cartTotals.shipping.toFixed(2)}`}
          </h5>
        </div>

        <div className={styles.EstimatedTax}>
          <p>Estimated Taxes ({cartTotals.taxPercent || 0}%)</p>
          <h5>AED {cartTotals.tax.toFixed(2)}</h5>
        </div>

        <div className={styles.Total}>
          <p>Total</p>
          <h5>AED {cartTotals.total.toFixed(2)}</h5>
        </div>

        <div className={styles.EarningBadge}>
          <p>
            You're earning{" "}
            {Math.floor(cartTotals.total * (coinConfig.pointsEarn / 100))} WM
            Beans on this order
          </p>
        </div>
      </div>
    </div>
  );
}
