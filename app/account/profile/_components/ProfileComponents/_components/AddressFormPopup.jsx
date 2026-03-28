"use client";

import React, { useState, useRef, useEffect } from "react";
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
  isSubmitting,
}) => {
  // --- State for Custom Emirate Dropdown ---
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const emirateRef = useRef(null);

  // --- Click Outside logic for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emirateRef.current && !emirateRef.current.contains(event.target)) {
        setIsEmirateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const title = mode === "edit" ? "EDIT ADDRESS" : "ADD ADDRESS";
  const saveLabel = isSubmitting
    ? "Saving..."
    : mode === "edit"
      ? "Update Address"
      : "Save Address";

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
        <input
          style={{ outline: "none" }}
          value="United Arab Emirates"
          readOnly
        />

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
          <div className={styles.Field} ref={emirateRef} style={{ padding: 0 }}>
            <div
              className={styles.SelectContainer}
              style={{ position: "relative", width: "100%" }}
            >
              <div
                className={styles.CustomSelectTrigger}
                onClick={() => setIsEmirateOpen(!isEmirateOpen)}
                style={{ padding: "19px 22px", }}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {UAE_STATES.find((s) => s.value === addressForm.state)
                    ?.label || "Select Emirate"}
                </span>
                <span
                  className={`${styles.Arrow} ${isEmirateOpen ? styles.Rotate : ""}`}
                >
                  ▼
                </span>
              </div>

              {isEmirateOpen && (
                <div
                  className={styles.CustomOptionsList}
                  style={{ left: 0, width: "100%", top: "100%" }}
                  data-lenis-prevent
                >
                  {UAE_STATES.map((opt) => (
                    <div
                      key={opt.value}
                      className={styles.OptionItem}
                      onClick={() => {
                        onFormChange("state", opt.value);
                        setIsEmirateOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                marginLeft: label === ADDRESS_LABELS[0] ? "0" : "-1px",
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
          <button
            style={{
              backgroundColor: "transparent",
              border: "1px solid #6C7A5F",
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={styles.SaveBtn}
            onClick={onSave}
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPopup;
