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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className={styles.PopupOverlay} onClick={onCancel}>
      <form
        className={styles.Popup}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>{title}</h3>

        {/* First 11 + Last name */}
        <div className={styles.divide}>
          <div className={styles.floatField}>
            <input
              id="firstName"
              value={addressForm.addressFirstName || ""}
              onChange={(e) => onFormChange("addressFirstName", e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="firstName">First name <span>*</span></label>
          </div>
          <div className={styles.floatField}
            style={{ borderLeft: "none"}}
          >
            <input
              id="lastName"
              value={addressForm.addressLastName || ""}
              onChange={(e) => onFormChange("addressLastName", e.target.value)}
              placeholder=" "
              required

            />
            <label htmlFor="lastName">Last name <span>*</span></label>
          </div>
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
          style={{
            outline: "none",
            borderTop: "none",
            borderBottom: "none",
            borderLeft: "1px solid #6e736a",  /* Keeping sides if needed */
            borderRight: "1px solid #6e736a",
            backgroundColor: "transparent"    /* Makes it blend in better */
          }}
          value="United Arab Emirates"
          readOnly
        />

        {/* Street */}
        {/* Street */}
        <div className={styles.floatField}>
          <input
            id="address"
            value={addressForm.address || ""}
            onChange={(e) => onFormChange("address", e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="address">House number, Street name <span>*</span></label>
        </div>
        {addressErrors.address && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "-10px", marginBottom: "10px" }}>
            {addressErrors.address}
          </p>
        )}

        {/* Apartment */}
        <div
          className={styles.floatField}
          style={{ borderTop: "none", borderBottom: "none" }}
        >
          <input
            id="apartment"
            style={{
              outline: "none",
              borderTop: "none",
              borderBottom: "none",
              borderLeft: "1px solid #6e736a",
              borderRight: "1px solid #6e736a",
              backgroundColor: "transparent"
            }}
            value={addressForm.apartment || ""}
            onChange={(e) => onFormChange("apartment", e.target.value)}
            placeholder=" "
          />
          <label htmlFor="apartment" style={{ color: "#6e736a" }}>
            Apartment, suite, etc. (Optional)
          </label>
        </div>

        {/* City + Emirate row */}
        <div className={styles.Row2}>
          <div
            className={styles.floatField}
            style={{
              // borderTop: "none",
              // borderBottom: "none",
              // borderRight: "none"
            }}
          >
            <input
              id="city"
              value={addressForm.city || ""}
              onChange={(e) => onFormChange("city", e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="city">City <span>*</span></label>
          </div>
          <div className={styles.Field} ref={emirateRef} style={{ padding: 0 , borderLeft: "none"}}>
            <div className={styles.SelectContainer} style={{ position: "relative", width: "100%" }}>
              <div
                className={styles.CustomSelectTrigger}
                onClick={() => setIsEmirateOpen(!isEmirateOpen)}
                style={{ padding: "19px 22px", border: "0px" }}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {UAE_STATES.find((s) => s.value === addressForm.state)?.label || "Select Emirate"}
                </span>
                <span className={`${styles.Arrow} ${isEmirateOpen ? styles.Rotate : ""}`}>▼</span>
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
          className={styles.floatField}
          style={{
            display: "flex",
            alignItems: "center",
            /* Updated border logic */
            borderLeft: "1px solid #6e736a",
            borderRight: "1px solid #6e736a",
            borderTop: "none",    // Specifically removed
            borderBottom: "none", // Keeps it seamless for the next field
            padding: "19px 22px",
            fontFamily: "var(--lato)",
            fontSize: "15px",
            color: "#6a6c73",
            background: "#fff",
          }}
        >
          <span style={{ marginRight: "8px", userSelect: "none" }}>+971</span>
          <input
            id="phone"
            placeholder=" "
            type="tel"
            inputMode="numeric"
            value={addressForm.phone ? addressForm.phone.replace(/^\+971\s?/, "") : ""}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
              const formatted = digits.length > 2 ? digits.slice(0, 2) + " " + digits.slice(2) : digits;
              onFormChange("phone", "+971" + formatted);
            }}
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
          <label htmlFor="phone" style={{ left: "65px" }}> 50 123 4567 <span>*</span></label>
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
              type="button"
              key={label}
              onClick={() => onLabelSelect(label)}
              style={{
                padding:
                  "17px clamp(20px, 5vw, 64px) 20px clamp(20px, 5vw, 64px)",
                border: "1px solid #6e736a",
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
            type="button"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #6e736a",
              color: "var(--primary-color)"
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.SaveBtn}
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {saveLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressFormPopup;
