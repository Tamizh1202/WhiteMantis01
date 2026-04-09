"use client";
// ─── DeleteAddressPopup ───────────────────────────────────────────────────────
// Small confirmation popup before deleting a saved address.
//
// Props:
//   onConfirm  () => void  — proceeds with deletion
//   onCancel   () => void  — closes popup without deleting

import React from "react";
import styles from "../ProfileComponents.module.css";

const DeleteAddressPopup = ({ onConfirm, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className={styles.PopupOverlayDeleteAddress} onClick={onCancel}>
      <form
        className={styles.PopupDeleteAddress}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>DELETE CONFIRMATION</h3>
        <p>Are you sure you want to delete this address?</p>

        <div className={styles.PopupActionsDeleteAddress}>
          <button
            type="button"
            className={styles.DeleteAddressCancelBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className={styles.DeleteAddressSaveBtn}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAddressPopup;
