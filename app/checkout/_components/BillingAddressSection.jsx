"use client";
import styles from "../page.module.css";
import { useState, useRef, useEffect } from "react";
import { validateRequired, validateUAEPhone } from "@/utils/validatorFunctions";
import { UAE_STATES } from "@/app/account/profile/_components/ProfileComponents/profileConstants";

/**
 * BillingAddressSection
 * ─────────────────────────────────────────
 * Renders:
 *  - "Use shipping address as billing address" checkbox (only when delivery === "ship")
 *  - Full billing address form (when toggle is off, or delivery === "pickup")
 *
 * Props:
 *   delivery, useShippingAsBilling, setUseShippingAsBilling,
 *   billingForm, setBillingForm,
 *   validationErrors, clearError, setValidationErrors
 */
export default function BillingAddressSection({
  delivery,
  useShippingAsBilling,
  setUseShippingAsBilling,
  billingForm,
  setBillingForm,
  validationErrors,
  clearError,
  setValidationErrors,
}) {
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const emirateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emirateRef.current && !emirateRef.current.contains(event.target)) {
        setIsEmirateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showForm = !useShippingAsBilling || delivery === "pickup";

  return (
    <div className={styles.Five} style={{ paddingTop: 0 }}>
      {/* ── "Same as shipping" toggle ── */}
      {delivery !== "pickup" && (
        <label className={styles.BillingToggle}>
          <input
            type="checkbox"
            checked={useShippingAsBilling}
            onChange={(e) => setUseShippingAsBilling(e.target.checked)}
          />
          <p>Use shipping address as billing address</p>
        </label>
      )}

      {/* ── Billing Form ── */}
      {showForm && (
        <>
          <h3>BILLING ADDRESS</h3>
          <input
            className={styles.Input}
            value="United Arab Emirates"
            readOnly
          />

          {/* First / Last Name */}
          <div className={styles.Row}>
            <div style={{ flex: 1 }}>
              <input
                className={`${styles.Input} ${validationErrors.billingFirstName ? styles.InputError : ""}`}
                placeholder="First Name"
                value={billingForm.firstName}
                onChange={(e) => {
                  setBillingForm({ ...billingForm, firstName: e.target.value });
                  clearError("billingFirstName");
                }}
                onBlur={() => {
                  const e = validateRequired(
                    billingForm.firstName,
                    "First name",
                  );
                  if (e)
                    setValidationErrors((p) => ({ ...p, billingFirstName: e }));
                }}
              />
              {validationErrors.billingFirstName && (
                <span className={styles.ErrorMessage}>
                  {validationErrors.billingFirstName}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input
                className={`${styles.Input} ${validationErrors.billingLastName ? styles.InputError : ""}`}
                placeholder="Last Name"
                value={billingForm.lastName}
                onChange={(e) => {
                  setBillingForm({ ...billingForm, lastName: e.target.value });
                  clearError("billingLastName");
                }}
                onBlur={() => {
                  const e = validateRequired(billingForm.lastName, "Last name");
                  if (e)
                    setValidationErrors((p) => ({ ...p, billingLastName: e }));
                }}
              />
              {validationErrors.billingLastName && (
                <span className={styles.ErrorMessage}>
                  {validationErrors.billingLastName}
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <input
              className={`${styles.Input} ${validationErrors.billingAddress ? styles.InputError : ""}`}
              placeholder="House number, Street name"
              value={billingForm.address}
              onChange={(e) => {
                setBillingForm({ ...billingForm, address: e.target.value });
                clearError("billingAddress");
              }}
              onBlur={() => {
                const e = validateRequired(billingForm.address, "Address");
                if (e)
                  setValidationErrors((p) => ({ ...p, billingAddress: e }));
              }}
            />
            {validationErrors.billingAddress && (
              <span className={styles.ErrorMessage}>
                {validationErrors.billingAddress}
              </span>
            )}
          </div>

          {/* Apartment */}
          <input
            className={styles.Input}
            placeholder="Apartment, suite, etc. (optional)"
            value={billingForm.apartment}
            onChange={(e) =>
              setBillingForm({ ...billingForm, apartment: e.target.value })
            }
          />

          {/* City / Emirates */}
          <div className={styles.Row} data-lenis-prevent>
            <div style={{ flex: 1 }}>
              <input
                className={`${styles.Input} ${validationErrors.billingCity ? styles.InputError : ""}`}
                placeholder="City"
                value={billingForm.city}
                onChange={(e) => {
                  setBillingForm({ ...billingForm, city: e.target.value });
                  clearError("billingCity");
                }}
                onBlur={() => {
                  const e = validateRequired(billingForm.city, "City");
                  if (e) setValidationErrors((p) => ({ ...p, billingCity: e }));
                }}
              />
              {validationErrors.billingCity && (
                <span className={styles.ErrorMessage}>
                  {validationErrors.billingCity}
                </span>
              )}
            </div>
            <div
              className={styles.SelectContainer}
              ref={emirateRef}
              style={{ flex: 1 }}
            >
              <div
                className={styles.CustomSelectTrigger}
                onClick={() => setIsEmirateOpen(!isEmirateOpen)}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {UAE_STATES.find(
                    (s) => s.value === (billingForm.emirates || "dubai"),
                  )?.label || "Select Emirate"}
                </span>
                <span
                  className={`${styles.Arrow} ${isEmirateOpen ? styles.Rotate : ""}`}
                >
                  ▼
                </span>
              </div>

              {isEmirateOpen && (
                <div className={styles.CustomOptionsList}>
                  {UAE_STATES.map((opt) => (
                    <div
                      key={opt.value}
                      className={styles.OptionItem}
                      onClick={() => {
                        setBillingForm({
                          ...billingForm,
                          emirates: opt.value,
                        });
                        setIsEmirateOpen(false);
                        clearError("billingEmirates");
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <div
              className={`${styles.PhoneWrapper} ${validationErrors.billingPhone ? styles.InputError : ""}`}
            >
              <span className={styles.PhonePrefix}>+971</span>
              <input
                className={styles.PhoneInput}
                placeholder="Phone"
                value={billingForm.phone}
                inputMode="numeric"
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, "");
                  setBillingForm({ ...billingForm, phone: numeric });
                  clearError("billingPhone");
                }}
                onBlur={() => {
                  const e = validateUAEPhone(billingForm.phone);
                  if (e)
                    setValidationErrors((p) => ({ ...p, billingPhone: e }));
                }}
              />
            </div>
            {validationErrors.billingPhone && (
              <span className={styles.ErrorMessage}>
                {validationErrors.billingPhone}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
