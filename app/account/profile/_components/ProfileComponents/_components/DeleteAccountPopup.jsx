"use client";
// ─── DeleteAccountPopup ───────────────────────────────────────────────────────
// Full-screen confirmation popup shown before permanently deleting the account.
// Displays subscription / active order warnings if present.
//
// Props:
//   accountStatus  object | null  — { activeSubscriptions, activeOrders } from the API
//   onKeep         () => void     — user chooses to keep the account
//   onConfirm      () => void     — user confirms deletion

import React from "react";
import styles from "../ProfileComponents.module.css";

const DeleteAccountPopup = ({ accountStatus, onKeep, onConfirm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className={styles.DeletePopupOverlay} onClick={onKeep}>
      <form
        className={styles.DeletePopup}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>DELETE ACCOUNT</h3>

        {accountStatus ? (
          <>
            {accountStatus.activeSubscriptions?.count > 0 && (
              <p>
                You currently have an active subscription on this account, which
                will be cancelled.{" "}
                {accountStatus.activeOrders?.count > 0 &&
                  "If you have any pending orders, they will still be delivered."}
              </p>
            )}
            {accountStatus.activeSubscriptions?.count === 0 &&
              accountStatus.activeOrders?.count > 0 && (
                <p>Any pending orders will still be delivered.</p>
              )}
          </>
        ) : (
          <p>
            Are you sure you want to delete your account? Any upcoming orders
            will still be delivered.
          </p>
        )}

        <p style={{ color: "#d32f2f", fontWeight: "500", marginTop: "16px" }}>
          Deleting your account will permanently erase your data, history, and
          saved settings.
        </p>

        <div className={styles.DeletePopupActions}>
          <button
            type="button"
            style={{ backgroundColor: "white", border: "1px solid #6c7a5f" }}
            onClick={onKeep}
          >
            Keep Account
          </button>
          <button type="submit" className={styles.DeleteDanger}>
            Delete Anyway
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccountPopup;
