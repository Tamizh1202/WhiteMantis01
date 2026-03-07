"use client";
import React, { useState } from "react";
import styles from "./CancelOrderPopup.module.css";

const CancelOrderPopup = ({ onClose, onConfirm, orderId }) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");
    const [error, setError] = useState("");

    const MIN_CHAR_LIMIT = 10;

    const reasons = [
        "Changed my mind",
        "Ordered by mistake",
        "Delivery time is too long",
        "Found a better alternative",
        "Other",
    ];

    const handleConfirm = () => {
        const finalReason = selectedReason === "Other" ? `Other: ${otherReasonText}` : selectedReason;
        if (selectedReason === "Other" && otherReasonText.length < MIN_CHAR_LIMIT) {
            setError(`Please provide at least ${MIN_CHAR_LIMIT} characters.`);
            return;
        }
        onConfirm(finalReason);
    };

    const isButtonDisabled = () => {
        if (!selectedReason) return true;
        if (selectedReason === "Other" && otherReasonText.trim().length < MIN_CHAR_LIMIT) return true;
        return false;
    };

    return (
        <div className={styles.PopupOverlay}>
            <div className={styles.Popup}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13 1L1 13M1 1L13 13"
                            stroke="#6E736A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <div className={styles.content}>
                    <h3>CANCEL ORDER</h3>
                    <p className={styles.description}>
                        Please let us know why you're cancelling this order. This helps us improve your experience.
                    </p>

                    <div className={styles.reasonsContainer}>
                        <p className={styles.reasonLabel}>Select cancellation reason:</p>
                        {reasons.map((reason, index) => (
                            <div key={index}>
                                <label className={styles.reasonItem}>
                                    <input
                                        type="radio"
                                        name="cancelReason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) => {
                                            setSelectedReason(e.target.value);
                                            setError("");
                                        }}
                                    />
                                    <span className={styles.radioCustom}></span>
                                    <span className={styles.reasonText}>{reason}</span>
                                </label>
                                {reason === "Other" && selectedReason === "Other" && (
                                    <div className={styles.otherTextAreaContainer}>
                                        <textarea
                                            className={styles.otherTextArea}
                                            placeholder="Please specify your reason"
                                            value={otherReasonText}
                                            onChange={(e) => {
                                                setOtherReasonText(e.target.value);
                                                if (e.target.value.length >= MIN_CHAR_LIMIT) {
                                                    setError("");
                                                }
                                            }}
                                        ></textarea>
                                        {error && <p className={styles.errorMessage}>{error}</p>}
                                        <p className={styles.charCount}>
                                            {otherReasonText.length}/{MIN_CHAR_LIMIT} min characters
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.PopupActions}>
                        <button className={styles.KeepBtn} onClick={onClose}>
                            Keep order
                        </button>
                        <button
                            className={styles.CancelBtn}
                            onClick={handleConfirm}
                            disabled={isButtonDisabled()}
                        >
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderPopup;
