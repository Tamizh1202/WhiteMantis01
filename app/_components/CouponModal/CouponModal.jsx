"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./CouponModal.module.css";
import { useCart } from "../../_context/CartContext";
import Image from "next/image";
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
            <p>Cart value : AED {cartTotals?.total?.toFixed(2) || "0.00"}</p>
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
          {errorCouponId === "manual" && couponError && (
            <p className={styles.errorText}>{couponError}</p>
          )}
          <div className={styles.offersSection}>
            <h4>Available Offers</h4>
            <div className={styles.couponList}>
              {loading ? (
                <p className={styles.loadingText}>Loading coupons...</p>
              ) : (
                (() => {
                  const filtered = (couponList || []).filter((c) =>
                    (c?.code || "")
                      .toLowerCase()
                      .includes((inputCode || "").toLowerCase()),
                  );
                  if (filtered.length === 0) {
                    return (
                      <p className={styles.noCoupons}>
                        No offers found matching "{inputCode}".
                      </p>
                    );
                  }
                  return filtered.map((coupon, index) => {
                    const active = isCouponActive(coupon);
                    const eligible = isCouponEligible(coupon);
                    return (
                      <div
                        className={`${styles.couponCard} ${!active ? styles.muted : !eligible ? styles.ineligible : ""}`}
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
                                  d="M8.38065 5.25656L9.64269 5.30094L9.39291 12.5082L8.13087 12.4638L8.38065 5.25656ZM0.473196 8.58647L9.18064 0.403264C9.78472 -0.164446 10.7207 -0.131528 11.284 0.477238L13.314 2.67099C13.0253 2.94228 12.8554 3.31802 12.8416 3.71556C12.8278 4.11309 12.9713 4.49986 13.2405 4.79077C13.5097 5.08167 13.8825 5.2529 14.277 5.26677C14.6715 5.28064 15.0552 5.13603 15.3439 4.86474L17.3738 7.05849C17.9371 7.66726 17.9044 8.61056 17.3004 9.17827L8.59292 17.3615C8.30426 17.6328 7.92047 17.7774 7.52601 17.7635C7.13155 17.7496 6.75871 17.5784 6.48953 17.2875L4.4596 15.0938C5.06367 14.526 5.09637 13.5827 4.53306 12.974C4.26387 12.6831 3.89104 12.5118 3.49658 12.498C3.10211 12.4841 2.71833 12.6287 2.42966 12.9L0.399732 10.7063C0.130546 10.4153 -0.0129412 10.0286 0.000836114 9.63104C0.0146134 9.23351 0.184526 8.85776 0.473196 8.58647ZM1.48816 9.68335L2.77717 11.0764C3.2857 10.9578 3.81626 10.9762 4.31546 11.1298C4.81467 11.2835 5.26491 11.5669 5.62089 11.9516C5.97687 12.3363 6.22604 12.8088 6.34331 13.3213C6.46059 13.8339 6.44184 14.3686 6.28895 14.8716L7.57796 16.2646L16.2854 8.08139L14.9964 6.68836C14.4879 6.80699 13.9573 6.78855 13.4581 6.6349C12.9589 6.48125 12.5087 6.19781 12.1527 5.8131C11.7967 5.42839 11.5475 4.95598 11.4303 4.4434C11.313 3.93081 11.3317 3.39614 11.4846 2.89317L10.1956 1.50014L1.48816 9.68335ZM5.49631 7.96725C5.94801 7.54274 6.65265 7.56752 7.07386 8.02273C7.49507 8.47793 7.47046 9.18806 7.01876 9.61256C6.56706 10.0371 5.86242 10.0123 5.44121 9.55708C5.02 9.10188 5.04461 8.39175 5.49631 7.96725ZM10.7548 8.15218C11.2065 7.72768 11.9111 7.75246 12.3324 8.20766C12.7536 8.66287 12.729 9.37299 12.2773 9.79749C11.8256 10.222 11.1209 10.1972 10.6997 9.74201C10.2785 9.28681 10.3031 8.57669 10.7548 8.15218Z"
                                  fill="#2F362A"
                                />
                              </svg>

                              <h4>{(coupon.code || "").toUpperCase()}</h4>
                            </div>
                            <div className={styles.saveRow}>
                              <h5>
                                {coupon.discountType === "percentage"
                                  ? `Get ${Number(coupon.discountAmount).toFixed(0)}% OFF`
                                  : `You save AED ${Number(coupon.discountAmount).toFixed(2)}`}
                              </h5>
                            </div>
                            <div className={styles.descRow}>
                              <p>
                                {coupon?.couponTagline && coupon?.couponTagline}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`${styles.cardRight} ${!eligible || !active ? styles.disabledBtn : ""}`}
                            onClick={() =>
                              active &&
                              eligible &&
                              handleApply(coupon.code, coupon)
                            }
                          >
                            <h5>
                              {coupon.couponStatus === "inactive"
                                ? "Apply now"
                                : !isCouponActive(coupon)
                                  ? "Expired"
                                  : eligible
                                    ? "Apply now"
                                    : "Not applicable"}
                            </h5>
                            {errorCouponId === coupon?.id && couponError && (
                              <p className={styles.cardError}>{couponError}</p>
                            )}
                          </div>
                        </div>
                        {!expandedCoupons[index] && (
                          <div
                            className={styles.cardBottom}
                            onClick={() => toggleExpand(index)}
                          >
                            <p>Know more</p>
                          </div>
                        )}

                        {expandedCoupons[index] && (
                          <div className={styles.expandedDetails}>
                            <div className={styles.dashedLine}></div>
                            <ul className={styles.detailsList}>
                              {(() => {
                                const {
                                  discountLine,
                                  minSpendLine,
                                  expiryLine,
                                } = getCouponOneLiner(coupon);
                                return (
                                  <>
                                    <li className={styles.detailItem}>
                                      {discountLine}
                                    </li>
                                    <li className={styles.detailItem}>
                                      {minSpendLine}
                                    </li>
                                    <li className={styles.detailItem}>
                                      {expiryLine}
                                    </li>
                                  </>
                                );
                              })()}
                            </ul>
                            <div
                              className={styles.cardBottom}
                              onClick={() => toggleExpand(index)}
                              style={{ borderTop: "none", paddingTop: "10px" }}
                            >
                              <p>Show less</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
