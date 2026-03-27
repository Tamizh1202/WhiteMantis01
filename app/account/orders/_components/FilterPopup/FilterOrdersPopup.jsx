"use client";

import React, { useState } from "react";
import styles from "./FilterOrdersPopup.module.css";

export default function FilterOrdersPopup({ onClose, onApply }) {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const handleApply = () => {
        onApply({ status: selectedStatus, time: selectedTime });
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <h2 className={styles.title}>FILTER ORDERS</h2>
                <div className={styles.body}>
                    {/* Status Column */}
                    <div className={styles.column}>
                        <p className={styles.columnTitle}>Status</p>
                        {["All", "In progress", "Delivered", "Cancelled"].map((s) => (
                            <label key={s} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="status"
                                    className={styles.radioInput}
                                // ... other props
                                />
                                {/* ONLY ONE OF THESE */}
                                <span className={styles.customRadio} />
                                {s}
                            </label>
                        ))}
                    </div>
                    {/* Time Column */}
                    <div className={styles.column}>
                        <p className={styles.columnTitle}>Time</p>
                        {["Last 30 days", "Last 6 months", "Last year"].map((t) => (
                            <label key={t} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="time"
                                    value={t}
                                    checked={selectedTime === t}
                                    onChange={() => setSelectedTime(t)}
                                    className={styles.radioInput}
                                />
                                <span className={styles.customRadio} />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.applyBtn} onClick={handleApply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}