import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./OrderCard.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import {
  getStatusConfig,
  formatDate,
} from "@/app/account/orders/_components/GetStatus";
import { useRouter } from 'next/navigation';
import axiosClient from "@/lib/axios";
import toast from "react-hot-toast";

const OrderCard = ({ order, handleCancelButton }) => {
  if (!order) return null;
  const router = useRouter();
  const handleNavigation = () => {
    router.push(`/account/orders/${order.id}`);
  };
  const config = getStatusConfig(order.deliveryStatus || order.status, order);
  const items = order.docs || order.items || order.line_items || [];
  const visibleItems = items.slice(0, 2);
  const remainingCount = Math.max(0, items.length - 2);

  const [rating, setRating] = useState(order.orderRating || 0); // Initialize from order data
  const [hover, setHover] = useState(0); // The "visual" feedback

  // Function to handle the click, toggle, and save the rating
  const handleRating = async (score) => {
    const newRating = rating === score ? 0 : score; // Toggle if same star clicked

    // Optimistic update
    setRating(newRating);

    try {
      await axiosClient.patch(`/api/web-orders/${order.id}`, {
        orderRating: newRating,
      });
      console.log(`Order ${order.id} rating updated to: ${newRating}/5`);
      if (newRating > 0) {
        toast.success(`Order rated ${newRating} stars!`);
      } else {
        toast.success("Rating cleared.");
      }
    } catch (error) {
      console.error("Error updating order rating:", error);
      // Revert on error
      setRating(order.orderRating || 0);
      toast.error("Failed to update rating. Please try again.");
    }
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderTop}>
        <div className={styles.orderTopLeft}>
          <span>{config.icon}</span>
          <div>
            <p
              className={styles.orderStatusTitle}
              style={{ color: config.color }}
            >
              {config.label}
            </p>
            <p className={styles.orderDateSub}>{config.date}</p>
            {config.refundedAmount && (
              <p className={styles.orderDateSub}>
                <span className={styles.orderDateSub}>
                  {config.refundedAmount}
                </span>
              </p>
            )}
            {config.reason && (
              <p className={styles.orderDateSub}>
                <span className={styles.orderReasonHeading}>Reason: </span>
                <span>{config.reason}</span>
              </p>
            )}
          </div>
        </div>
        <div className={styles.orderTopRight}>
          <p>
            Order Date:{" "}
            <span>{formatDate(order.date_created || order.createdAt)}</span>
          </p>
          <p>
            Order ID: <span>#{order.id}</span>
          </p>
        </div>
      </div>
      <div
        className={`${styles.orderMiddle} ${config.noBottom ? styles.orderMiddleNoBottom : ""}`}
      >
        <div className={styles.orderItems}>
          <p className={styles.itemCount}>{items.length} Items</p>
          {visibleItems.map((item, idx) => (
            <div className={styles.orderItem} key={idx}>
              <Image
                src={
                  formatImageUrl(item.productImage?.url) ||
                  formatImageUrl(item.product?.productImage?.url) ||
                  "https://placehold.co/100x100"
                }
                alt={item.name || item.product?.name || "Product"}
                width={80}
                height={80}
                className={styles.orderItemImg}
              />
              <div className={styles.orderItemInfo}>
                <p>
                  {item.product?.name || item.name || "Product name"}{" "}
                  {item.product?.tagline}
                </p>
                <p>
                  {item.product?.variants?.find(
                    (v) => v.id === item.variantID,
                  ) && (
                      <>
                        {
                          item.product.variants.find(
                            (v) => v.id === item.variantID,
                          ).variantName
                        }
                        g &nbsp; &nbsp;<span className={styles.Separator}>|</span>
                        &nbsp;&nbsp;
                      </>
                    )}
                  Qty: {item.quantity || "0"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.orderActions}>
          <p
            className={styles.orderDetailsLink}
            onClick={handleNavigation}
            role="button" // Accessibility: tells screen readers this acts like a button
            style={{ cursor: 'pointer' }} // Ensures the pointer shows up
          >
            Order Details
          </p>
        </div>
      </div>
      <div
        className={styles.cancelContainer}
        style={
          remainingCount > 0
            ? { justifyContent: "space-between" }
            : { justifyContent: "flex-end" }
        }
      >
        {remainingCount > 0 && (
          <p style={{ color: "#2F362A" }}>+ {remainingCount} more</p>
        )}
        {config.showCancel && (
          <button
            className={styles.cancelBtn}
            onClick={() => handleCancelButton(order.id)}
          >
            Cancel Order
          </button>
        )}
      </div>

      {config.bottomText && (
        <div className={styles.orderBottom}>
          <p>{config.bottomText}</p>
        </div>
      )}

      {/* Logic for Rating Display */}
      {config.rating && (
        <div className={styles.fiveStar}>
          <p>Rate this order</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((starNumber) => {
              const isActive = starNumber <= (hover || rating);

              return (
                <button
                  key={starNumber}
                  className={styles.starButton}
                  onClick={() => handleRating(starNumber)}
                  onMouseEnter={() => setHover(starNumber)}
                  onMouseLeave={() => setHover(0)}
                  type="button"
                >
                  <svg
                    width="20" /* Increased slightly for visual padding */
                    height="20"
                    viewBox="-1 -1 20 20" /* Moves the "window" to capture the stroke */
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon
                      points="9,0.5 11.5,6.5 18,7.2 13.2,11.5 14.7,17.5 9,14.2 3.3,17.5 4.8,11.5 0,7.2 6.5,6.5"
                      fill={isActive ? "white" : "transparent"}
                      stroke="white"
                      strokeWidth="1.2" /* A slightly thicker stroke looks better on small stars */
                      strokeLinejoin="round"
                      style={{ transition: "fill 0.2s ease" }}
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={`${styles.orderMobileMeta} ${config.noBottom ? styles.orderMobileMetaNoBorder : ""}`}
      >
        <p>
          Order Date:{" "}
          <span>{formatDate(order.date_created || order.createdAt)}</span>
        </p>
        <p>
          Order ID: <span>#{order.id}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
