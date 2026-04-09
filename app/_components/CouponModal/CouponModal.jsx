"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./CouponModal.module.css";
import { useCart } from "../../_context/CartContext";
import Image from "next/image";
import coupanZero from "./coupanZero.png";
import axiosClient from "@/lib/axios";

const getCouponOneLiner = (coupon) => {
  const { discountType, discountAmount, minimumAmount, expiryDate } = coupon;

  const discountLine =
    discountType === "percentage"
      ? `Get ${discountAmount}% OFF on your entire purchase`
      : `Save AED ${discountAmount} on your total order today`;

  const minSpendLine =
    minimumAmount > 0
      ? `Unlock this offer with a minimum spend of AED ${minimumAmount}`
      : "Enjoy this discount on all orders with no minimum spend";

  const expiryLine = `This offer is valid until ${new Date(
    expiryDate,
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return { discountLine, minSpendLine, expiryLine };
};

const CouponModal = () => {
  const { isCouponModalOpen, closeCouponModal, applyCoupon, cartTotals } =
    useCart();
  const { status } = useSession();
  const [couponList, setCouponList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [errorCouponId, setErrorCouponId] = useState(null);
  const [expandedCoupons, setExpandedCoupons] = useState({});

  const cartTotal = Number(cartTotals?.total || 0);

  useEffect(() => {
    if (isCouponModalOpen) {
      fetchCoupons();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCouponModalOpen]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/api/coupon/coupons");
      const data = res.data;
      if (res.status === 200) {
        setCouponList(data.docs || []);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      const resData = error?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      setCouponError(backendMsg || error.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const isCouponEligible = (coupon) => {
    const min = Number(coupon.minimumAmount || coupon.minimum_amount || 0);
    const max = Number(coupon.maximumAmount || coupon.maximum_amount || 0);
    if (min > 0 && cartTotal < min) return false;
    if (max > 0 && cartTotal > max) return false;
    return true;
  };

  const isCouponActive = (coupon) => {
    const now = new Date();
    const expiry = new Date(coupon.expiryDate);
    if (expiry <= now) return false;
    if (coupon.couponStatus === "inactive") return false;
    return true;
  };

  const toggleExpand = (index) => {
    setExpandedCoupons((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleApply = async (code, coupon = null) => {
    if (status !== "authenticated") {
      setCouponError("Please login to use coupon");
      setErrorCouponId(coupon?.id || "manual");
      return;
    }
    if (!code) return;
    if (coupon && !isCouponEligible(coupon)) {
      setCouponError("Not eligible");
      setErrorCouponId(coupon.id);
      return;
    }

    setCouponError("");
    setErrorCouponId(null);
    const res = await applyCoupon(code);
    if (res?.ok) {
      closeCouponModal();
      setInputCode("");
    } else {
      setCouponError(
        res?.message || "Coupon code is invalid or not applicable",
      );
    }
  };

  if (!isCouponModalOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={closeCouponModal}
      data-lenis-prevent
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header} data-lenis-prevent>
          <div className={styles.headerText}>
            <h3>COUPONS AND OFFERS</h3>
            <p>Cart value : AED {Number(cartTotals?.total || 0).toFixed(2)}</p>
          </div>
          <button className={styles.closeBtn} onClick={closeCouponModal}>
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

        <div className={styles.content}>
          <div className={styles.inputWrap}>
            <input
              placeholder="Discount code or coupon"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button
              onClick={() => handleApply(inputCode)}
              disabled={!inputCode.trim()}
              className={styles.applyBtn}
            >
              Apply
            </button>
          </div>

          <div className={styles.offersSection}>
            <h4>Available Offers</h4>
            <div className={styles.couponList}>
              {loading ? (
                <p className={styles.loadingText}>Loading coupons...</p>
              ) : couponList.length > 0 ? (
                couponList.map((coupon, index) => {
                  const eligible = isCouponEligible(coupon);
                  return (
                    <div
                      className={`${styles.couponCard} ${!eligible ? styles.ineligible : ""}`}
                      key={index}
                    >
                      <div className={styles.cardTop}>
                        <div className={styles.cardLeft}>
                          <div className={styles.codeRow}>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.3787 5.25656L9.64074 5.30094L9.39096 12.5082L8.12892 12.4638L8.3787 5.25656ZM0.471243 8.58647L9.17869 0.403264C9.78277 -0.164446 10.7188 -0.131528 11.2821 0.477238L13.312 2.67099C13.0233 2.94228 12.8534 3.31802 12.8397 3.71556C12.8259 4.11309 12.9694 4.49986 13.2386 4.79077C13.5077 5.08167 13.8806 5.2529 14.275 5.26677C14.6695 5.28064 15.0533 5.13603 15.3419 4.86474L17.3719 7.05849C17.9352 7.66726 17.9025 8.61056 17.2984 9.17827L8.59097 17.3615C8.3023 17.6328 7.91852 17.7774 7.52406 17.7635C7.12959 17.7496 6.75676 17.5784 6.48758 17.2875L4.45764 15.0938C5.06172 14.526 5.09441 13.5827 4.53111 12.974C4.26192 12.6831 3.88909 12.5118 3.49462 12.498C3.10016 12.4841 2.71638 12.6287 2.42771 12.9L0.397779 10.7063C0.128593 10.4153 -0.0148943 10.0286 -0.00111701 9.63104C0.0126602 9.23351 0.182573 8.85776 0.471243 8.58647Z"
                                fill="#2F362A"
                              />
                            </svg>
                            <h4>{coupon.code.toUpperCase()}</h4>
                          </div>
                          <div className={styles.saveRow}>
                            <h5>
                              {coupon.discountType === "percentage"
                                ? `Get ${Number(coupon.discountAmount).toFixed(0)}% OFF`
                                : `Save AED ${Number(coupon.discountAmount).toFixed(2)}`}
                            </h5>
                          </div>
                          <div className={styles.descRow}>
                            <p>
                              {coupon.description ||
                                `Valid until ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`${styles.cardRight} ${!eligible ? styles.disabledBtn : ""}`}
                          onClick={() =>
                            eligible && handleApply(coupon.code, coupon)
                          }
                        >
                          <h5>{eligible ? "Apply now" : "Not applicable"}</h5>
                        </div>
                      </div>
                      <div className={styles.cardBottom}>
                        <p>Know more</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.zeroState}>
                  <Image
                    src={coupanZero}
                    alt="No products"
                    width={120}
                    height={75}
                  />
                  <p
                    style={{
                      color: "black",
                      marginTop: "10px",
                      marginBottom: "7px",
                    }}
                  >
                    No Offers available
                  </p>
                  <p>Enter a coupon code above to apply a discount.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {couponError && <p className={styles.errorText}>{couponError}</p>}
      </div>
    </div>
  );
};

export default CouponModal;
