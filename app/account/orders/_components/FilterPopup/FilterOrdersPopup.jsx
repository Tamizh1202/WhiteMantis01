"use client";

import React, { useState } from "react";
import styles from "./FilterOrdersPopup.module.css";

export default function FilterOrdersPopup({
  onClose,
  onApply,
  currentFilters,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    currentFilters?.status || "",
  );
  const [selectedTime, setSelectedTime] = useState(currentFilters?.time || "");

  const handleApply = () => {
    onApply({ status: selectedStatus, time: selectedTime });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
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
                  value={s}
                  checked={selectedStatus === s}
                  onChange={() => setSelectedStatus(s)}
                  className={styles.radioInput}
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
