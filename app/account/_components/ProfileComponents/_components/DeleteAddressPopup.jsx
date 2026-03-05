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
    return (
        <div className={styles.PopupOverlayDeleteAddress}>
            <div className={styles.PopupDeleteAddress}>
                <h3>DELETE CONFIRMATION</h3>
                <p>Are you sure you want to delete this address?</p>

                <div className={styles.PopupActionsDeleteAddress}>
                    <button className={styles.DeleteAddressCancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={styles.DeleteAddressSaveBtn} onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAddressPopup;
