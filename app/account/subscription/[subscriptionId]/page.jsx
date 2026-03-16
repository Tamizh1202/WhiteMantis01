"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { downloadInvoice } from "@/lib/pdf/utils/downloadInvoiceClient";
import SubPopup from "../_components/SubscriptionPopup/SubscriptionPopup";
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";

export default function SubscriptionDetailPage({ params }) {
  // Handle params wrapping/unwrapping
  const { subscriptionId } = React.use(params);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  const fetchSubscription = async () => {
    try {
      const response = await axiosClient.get(
        `/api/web-subscription/${subscriptionId}?depth=3`,
      );
      const resData = response.data;
      console.log("inner data", resData);

      if (resData && resData.id) {
        setData(resData);
      } else {
        console.error("Subscription not found");
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsPopupOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-AE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Dubai",
    });
  };

  if (loading)
    return (
      <div className={styles.Container}>
        <p style={{ textAlign: "center" }}>Loading...</p>
      </div>
    );
  if (!data || !data.id)
    return <div className={styles.Container}>Subscription not found</div>;

  const sub = data;

  console.log("sub", sub);

  return (
    <div className={styles.Container}>
      <h2 className={styles.PageTitle}>SUBSCRIPTION DETAILS</h2>

      <div className={styles.StatusBar}>
        {sub.subsStatus === "active" ? (
          <p>Subscription active since {formatDate(data.createdAt)}</p>
        ) : (
          <p>
            Subscription{" "}
            {data.subsStatus === "inactive" ? "Cancelled" : data.subsStatus} on{" "}
            {formatDate(data.updatedAt)}
          </p>
        )}
      </div>
      <div className={styles.Card}>
        <h3 className={styles.CardTitle}>
          {sub.items?.[0]?.product?.categories?.title || "Product Name"}
        </h3>

        <div className={styles.ProductRow}>
          <Image
            src={
              formatImageUrl(sub.items?.[0]?.product?.productImage?.url) ||
              "https://placehold.co/100x100"
            }
            alt="product image"
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
          />

          <div className={styles.ProductInfo}>
            <p className={styles.ProductName}>
              {sub.items?.[0]?.product?.name || "Product Name"}
            </p>
            <p className={styles.ProductMeta}>
              {(() => {
                const item = sub?.items?.[0];
                const selectedVariant = item?.product?.variants?.find(
                  (v) => v.id === item.variantID,
                );

                return (
                  <>
                    {/* 1. Show Variant Weight if it exists */}
                    {selectedVariant && (
                      <>
                        <span>{`${selectedVariant.variantName}g`}</span>
                        <span className={styles.smallLine}>&nbsp;|&nbsp;</span>
                      </>
                    )}

                    {/* 2. Quantity (Always shows) */}
                    <span>Qty: {item?.quantity || 0}x Bag amount</span>
                  </>
                );
              })()}
            </p>

            <div className={styles.DetailsGrid}>
              <p>
                <span>Delivery Frequency:</span>{" "}
                {(() => {
                  const item = sub?.items?.[0];
                  const variantID = item?.variantID;
                  // 1. Find the active variant (if one is selected)
                  const selectedVariant = item?.product?.variants?.find(
                    (v) => v.id === variantID,
                  );
                  // 2. Get the list of frequencies (check variant first, then product)
                  const availableFreqs =
                    selectedVariant?.subFreq || item?.product?.subFreq || [];

                  // 3. Match the specific frequency choice by ID
                  const matchedFreq = availableFreqs.find(
                    (f) => f.id === item?.subFreqID,
                  );

                  return matchedFreq
                    ? `Every ${matchedFreq.duration} ${matchedFreq.interval}${matchedFreq.duration > 1 ? "s" : ""}`
                    : "Standard Interval";
                })()}
              </p>
              <p>
                <span>Price per delivery:</span> AED{" "}
                {(data.financials?.subtotal / 100).toFixed(2)}{" "}
              </p>
              <p>
                <span>
                  {sub.subsStatus === "active"
                    ? "Next Payment:"
                    : "Last Payment:"}
                </span>{" "}
                {data.subsStatus === "active"
                  ? formatDate(data.nextPaymentDate)
                  : formatDate(data.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.Section}>
        {sub.deliveryOption === "pickup" ? (
          <h4>PICKUP DETAILS</h4>
        ) : (
          <h4>DELIVERY DETAILS</h4>
        )}

        <div className={styles.InfoBox}>
          <div className={styles.InfoHeader}>
            <div className={styles.InfoHeaderLeft}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3953 14.8605C13.3953 14.5137 13.6765 14.2326 14.0233 14.2326C14.37 14.2326 14.6512 14.5137 14.6512 14.8605V16.7442H16.5349C16.5904 16.7442 16.6436 16.7221 16.6829 16.6829C16.7221 16.6436 16.7442 16.5904 16.7442 16.5349V13.186C16.7442 13.1516 16.7359 13.1175 16.7197 13.0871C16.7116 13.072 16.7016 13.058 16.6902 13.0454L16.651 13.0119L14.1394 11.3375C14.105 11.3145 14.0646 11.3023 14.0233 11.3023C14.0026 11.3023 13.9823 11.3054 13.9628 11.3113L13.9072 11.3375L11.3955 13.0119C11.3669 13.031 11.3431 13.0567 11.3269 13.0871C11.3106 13.1175 11.3023 13.1516 11.3023 13.186V16.5349C11.3023 16.5904 11.3244 16.6436 11.3636 16.6829C11.4029 16.7221 11.4561 16.7442 11.5116 16.7442H13.3953V14.8605ZM9.2093 7.32558C9.2093 6.28523 8.36593 5.44186 7.32558 5.44186C6.28523 5.44186 5.44186 6.28523 5.44186 7.32558C5.44186 8.36593 6.28523 9.2093 7.32558 9.2093C8.36593 9.2093 9.2093 8.36593 9.2093 7.32558ZM13.3953 7.32558C13.3953 5.71578 12.7562 4.17155 11.6179 3.03325C10.4796 1.89495 8.93538 1.25581 7.32558 1.25581C5.71578 1.25581 4.17155 1.89495 3.03325 3.03325C1.89495 4.17155 1.25581 5.71578 1.25581 7.32558C1.25581 9.20395 2.30946 11.199 3.64072 12.9481C4.94183 14.6576 6.43427 16.037 7.2054 16.7049C7.2405 16.7295 7.28184 16.7434 7.32476 16.7434C7.67149 16.743 7.95305 17.0238 7.95349 17.3705C7.95383 17.7172 7.67309 17.9987 7.3264 17.9992C7.00901 17.9995 6.69981 17.8969 6.44586 17.7065C6.43435 17.6979 6.42323 17.6881 6.41234 17.6787C5.61793 16.9928 4.03283 15.5363 2.64162 13.7085C1.26493 11.8997 0 9.62739 0 7.32558C0 5.38272 0.771536 3.51916 2.14535 2.14535C3.51916 0.771536 5.38272 0 7.32558 0C9.26845 0 11.132 0.771536 12.5058 2.14535C13.8796 3.51916 14.6512 5.38272 14.6512 7.32558C14.6512 7.67236 14.37 7.95349 14.0233 7.95349C13.6765 7.95349 13.3953 7.67236 13.3953 7.32558ZM18 16.5349C18 16.9235 17.8455 17.296 17.5708 17.5708C17.296 17.8455 16.9235 18 16.5349 18H11.5116C11.1231 18 10.7505 17.8455 10.4757 17.5708C10.201 17.296 10.0465 16.9235 10.0465 16.5349V13.186C10.0465 12.945 10.1062 12.7078 10.2198 12.4952C10.3335 12.2826 10.4976 12.1008 10.6981 11.967H10.6989L13.2098 10.2926C13.4505 10.132 13.7338 10.0465 14.0233 10.0465C14.3127 10.0465 14.596 10.132 14.8368 10.2926H14.8359L17.3476 11.967H17.3484C17.5489 12.1009 17.713 12.2826 17.8267 12.4952C17.9403 12.7078 18 12.945 18 13.186V16.5349ZM10.4651 7.32558C10.4651 9.0595 9.0595 10.4651 7.32558 10.4651C5.59166 10.4651 4.18605 9.0595 4.18605 7.32558C4.18605 5.59166 5.59166 4.18605 7.32558 4.18605C9.0595 4.18605 10.4651 5.59166 10.4651 7.32558Z"
                  fill="#4B3827"
                />
              </svg>
            </div>
            {sub.deliveryOption === "delivery" ? (
              <div className={styles.InfoHeaderRight}>
                <p>
                  {data.shippingAddress?.addressFirstName}{" "}
                  {data.shippingAddress?.addressLastName}
                </p>
                <p>
                  {data.shippingAddress?.addressLine1}{" "}
                  {data.shippingAddress?.addressLine2 &&
                    `, ${data.shippingAddress.addressLine2}`}
                  ,{data.shippingAddress?.city} {data.shippingAddress?.emirates}
                </p>
              </div>
            ) : (
              <div className={styles.InfoHeaderRight}>
                <p>White Mantis Roastery - Al Quoz</p>
                <p>Warehouse #2 – Al Quoz Industrial Area 4, Dubai</p>
              </div>
            )}
          </div>
          {sub.deliveryOption === "pickup" ? null : (
            <div className={styles.InfoFooter}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_3225_18666"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_3225_18666)">
                  <path
                    d="M20.3846 21.5959C18.2479 21.5959 16.1368 21.1294 14.0513 20.1965C11.9658 19.2637 10.0684 17.9414 8.35897 16.2296C6.64957 14.5179 5.32906 12.6179 4.39744 10.5296C3.46581 8.44136 3 6.32739 3 4.18775C3 3.87965 3.10256 3.62289 3.30769 3.41748C3.51282 3.21208 3.76923 3.10938 4.07692 3.10938H8.23077C8.47009 3.10938 8.68376 3.19068 8.87179 3.35329C9.05983 3.51591 9.17094 3.70847 9.20513 3.931L9.87179 7.52559C9.90598 7.79947 9.89744 8.03055 9.84615 8.21883C9.79487 8.40712 9.70085 8.56974 9.5641 8.70667L7.07692 11.2229C7.4188 11.8562 7.82479 12.4682 8.29487 13.0587C8.76496 13.6492 9.28205 14.2184 9.84615 14.7661C10.3761 15.2968 10.9316 15.7889 11.5128 16.2425C12.094 16.6961 12.7094 17.1112 13.359 17.4878L15.7692 15.0742C15.9231 14.9202 16.1239 14.8046 16.3718 14.7276C16.6197 14.6506 16.8632 14.6292 17.1026 14.6634L20.641 15.3823C20.8803 15.4508 21.0769 15.5749 21.2308 15.7546C21.3846 15.9344 21.4615 16.1355 21.4615 16.358V20.5175C21.4615 20.8256 21.359 21.0823 21.1538 21.2878C20.9487 21.4932 20.6923 21.5959 20.3846 21.5959ZM6.10256 9.27154L7.79487 7.57694L7.35897 5.16343H5.07692C5.16239 5.86523 5.28205 6.55847 5.4359 7.24316C5.58974 7.92784 5.81197 8.60397 6.10256 9.27154ZM15.2821 18.4634C15.9487 18.7544 16.6282 18.9855 17.3205 19.1567C18.0128 19.3278 18.7094 19.4391 19.4103 19.4905V17.231L17 16.7432L15.2821 18.4634Z"
                    fill="#6E736A"
                  />
                </g>
              </svg>

              <p>{data.user?.phone || "No phone provided"}</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.Section}>
        <h4>PAYMENT INFORMATION</h4>

        <div className={styles.InfoBoxbt}>
          <p>
            <strong>
              {data.subsStatus === "active" ? "Next Payment" : "Last Payment"}
            </strong>
          </p>
          <p>
            {data.subsStatus === "active"
              ? formatDate(data.nextPaymentDate)
              : formatDate(data.updatedAt)}
          </p>

          {/* We use stripeData or default to "Credit Card" */}
          {/* <p>{data.stripeData?.brand || "Credit Card"}</p> */}
        </div>

        <div className={styles.Table}>
          <div className={styles.TableHeader}>
            <span>Date</span>
            <span>Payment Method</span>
            <span>Invoice</span>
            <span>Total</span>
          </div>

          {data.paymentStatus === "completed" ? (
            [data].map((transaction) => (
              <div key={transaction.id} className={styles.TableRow}>
                {/* Transaction Date */}
                <span>{formatDate(transaction.createdAt)}</span>

                {/* Brand: Uses stripeData or fallback */}
                <span style={{ textAlign: "center" }}>
                  {transaction.stripeData?.brand || "-"}
                </span>

                {/* Invoice Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {transaction.stripeData?.receipt_url && (
                    <a
                      href={transaction.stripeData.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.ViewLink}
                    >
                      View Receipt
                    </a>
                  )}
                  <button
                    style={{
                      color: "#6C7A5F",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                    onClick={async (e) => {
                      const btn = e.target;
                      const originalText = btn.innerText;
                      btn.innerText = "Downloading...";
                      btn.disabled = true;
                      await downloadInvoice("subscription", transaction.id);
                      btn.innerText = originalText;
                      btn.disabled = false;
                    }}
                    className={styles.ViewLink}
                  >
                    Download PDF
                  </button>
                </div>

                {/* Amount: Fixed to 2 decimals */}
                <span>
                  AED {(transaction.financials?.subtotal / 100).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <div
              className={styles.TableRow}
              style={{ justifyContent: "center", padding: "10px" }}
            >
              <span>No payment history found.</span>
            </div>
          )}
        </div>
      </div>

      {data.subsStatus === "active" && (
        <>
          <button
            className={styles.CancelBtn}
            onClick={handleCancel}
            disabled={cancelling}
            style={{
              opacity: cancelling ? 0.7 : 1,
              cursor: cancelling ? "not-allowed" : "pointer",
            }}
          >
            {cancelling ? "Processing..." : "Cancel Subscription"}
          </button>
          {isPopupOpen && (
            <SubPopup
              onClose={() => setIsPopupOpen(false)}
              onConfirm={async (reason) => {
                setCancelling(true);
                try {
                  const response = await axiosClient.get(
                    `/api/web-subscription/${subscriptionId}/cancel`,
                    {
                      params: { reason },
                    },
                  );

                  if (response.status === 200) {
                    setData((prev) => ({ ...prev, subsStatus: "inactive" }));
                    setIsPopupOpen(false);
                    alert("Subscription cancelled successfully.");
                  } else {
                    console.error("Failed to cancel");
                  }
                } catch (err) {
                  console.error("Network error:", err);
                  if (err.response) {
                    console.error("Server responded with:", err.response.data);
                    alert(
                      `Failed to cancel: ${err.response.data.message || "Unknown error"}`,
                    );
                  }
                } finally {
                  setCancelling(false);
                }
              }}
            />
          )}
          <p className={styles.Note}>
            Your subscription remains active until cancelled. You may cancel at
            any time.
          </p>
        </>
      )}
    </div>
  );
}
