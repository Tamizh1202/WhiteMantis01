"use client";

import React, { useState } from "react";
import styles from "../ProfileComponents.module.css";
import { ADDRESS_LABELS, UAE_STATES } from "../profileConstants";

const AddressFormPopup = ({
  mode,
  addressForm,
  addressErrors,
  addressGeneralError,
  activeLabelBtn,
  onFormChange,
  onLabelSelect,
  onSave,
  onCancel,
}) => {
  const title = mode === "edit" ? "EDIT ADDRESS" : "ADD ADDRESS";
  const saveLabel = mode === "edit" ? "Update Address" : "Save Address";

  return (
    <div className={styles.PopupOverlay} onClick={onCancel}>
      <div className={styles.Popup} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>

        {/* First 11 + Last name */}
        <div className={styles.divide}>
          <input
            placeholder="First name"
            value={addressForm.addressFirstName || ""}
            onChange={(e) => onFormChange("addressFirstName", e.target.value)}
          />
          <input
            placeholder="Last Name"
            value={addressForm.addressLastName || ""}
            onChange={(e) => onFormChange("addressLastName", e.target.value)}
          />
        </div>
        {addressErrors.fullName && (
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "-10px",
              marginBottom: "10px",
            }}
          >
            {addressErrors.fullName}
          </p>
        )}

        {/* Country — always UAE, read-only */}
        <input value="United Arab Emirates" readOnly />

        {/* Street */}
        <input
          placeholder="House number, Street name"
          value={addressForm.address || ""}
          onChange={(e) => onFormChange("address", e.target.value)}
        />
        {addressErrors.address && (
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "-10px",
              marginBottom: "10px",
            }}
          >
            {addressErrors.address}
          </p>
        )}

        {/* Apartment */}
        <input
          placeholder="Apartment, suite, etc. (Optional)"
          value={addressForm.apartment || ""}
          onChange={(e) => onFormChange("apartment", e.target.value)}
        />

        {/* City + Emirate row */}
        <div className={styles.Row2}>
          <input
            placeholder="City"
            value={addressForm.city || ""}
            onChange={(e) => onFormChange("city", e.target.value)}
          />
          <select
            className={styles.StateSelect}
            value={addressForm.state || ""}
            onChange={(e) => onFormChange("state", e.target.value)}
          >
            <option value="" disabled>
              Select Emirate
            </option>
            {UAE_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Phone input with +971 prefix */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #2f362a4d",
            padding: "19px 22px",
            fontFamily: "var(--lato)",
            fontSize: "15px",
            color: "#6a6c73",
            background: "#fff",
          }}
        >
          <span style={{ marginRight: "8px", userSelect: "none" }}>+971</span>
          <input
            placeholder="50 123 4567"
            value={
              addressForm.phone
                ? addressForm.phone.replace(/^\+971\s?/, "")
                : ""
            }
            onChange={(e) =>
              onFormChange(
                "phone",
                "+971" + e.target.value.replace(/^(\+971\s?)/, ""),
              )
            }
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              padding: 0,
              fontSize: "15px",
              color: "#6e736a",
              background: "transparent",
            }}
          />
        </div>
        {addressErrors.phone && (
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            {addressErrors.phone}
          </p>
        )}

        {/* Home / Work / Others toggle buttons */}
        <div
          className={styles.Popup}
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "0",
            width: "100%",
            gap: "0",
          }}
        >
          {ADDRESS_LABELS.map((label) => (
            <button
              key={label}
              onClick={() => onLabelSelect(label)}
              style={{
                padding:
                  "17px clamp(20px, 5vw, 64px) 20px clamp(20px, 5vw, 64px)",
                border: "1px solid #2F362A4D",
                backgroundColor:
                  activeLabelBtn === label ? "#6C7A5F" : "#f8f9f8",
                color: activeLabelBtn === label ? "#ffffff" : "#6C7A5F",
                fontSize: "14px",
                fontWeight: "400",
                width: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Default address checkbox */}
        <label className={styles.CheckRow}>
          <input
            type="checkbox"
            checked={addressForm.isDefault || false}
            onChange={(e) => onFormChange("isDefault", e.target.checked)}
          />
          Use this as my default Shipping Address
        </label>

        {/* Actions */}
        <div className={styles.PopupActions}>
          {addressGeneralError && (
            <p
              style={{
                color: "red",
                fontSize: "14px",
                marginBottom: "10px",
                width: "100%",
                textAlign: "right",
              }}
            >
              {addressGeneralError}
            </p>
          )}
          <button onClick={onCancel}>Cancel</button>
          <button className={styles.SaveBtn} onClick={onSave}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPopup;
