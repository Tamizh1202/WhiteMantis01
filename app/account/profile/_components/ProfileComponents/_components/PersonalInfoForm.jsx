"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../ProfileComponents.module.css";

const PersonalInfoForm = ({
  profile,
  editMode,
  errors,
  isGuestUser,
  originalEmail,
  onFieldChange,
  onSave,
  onCancel,
  onVerifyEmail,
  showOtpPopup,
  otpNode,
}) => {
  // --- State for Custom Gender Dropdown ---
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderRef = useRef(null);

  // --- State for API Errors (e.g., "OTP limit reached") ---
  const [emailError, setEmailError] = useState("");

  // --- Click Outside logic for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Local handler for Email Verification ---
  const handleVerifyClick = async () => {
    setEmailError(""); // Clear previous error

    // This awaits the parent's handleVerifyEmail, which returns the API result
    const result = await onVerifyEmail(profile.email);

    // If API utility returns success: false, display the specific message
    if (result && result.success === false) {
      setEmailError(result.message);
    }
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <div className={styles.PersonalInfoSection}>
      {isGuestUser && (
        <p className={styles.GuestNote}>
          Please login to manage your profile details.
        </p>
      )}

      <div className={styles.AddressHeader}>
        <h4>PERSONAL INFORMATION</h4>
        {!editMode && (
          <button
            style={{ textDecoration: "underline" }}
            onClick={() => onFieldChange("__editMode__", true)}
          >
            Edit
          </button>
        )}
      </div>

      {/* First name + Last name row */}
      <div className={styles.Name1}>
        <div className={styles.Field}>
          <input
            value={profile.firstName || ""}
            placeholder={!isGuestUser ? "Enter your first name" : ""}
            disabled={!editMode || isGuestUser}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
          />
        </div>

        <div className={styles.Field}>
          <input
            value={profile.lastName || ""}
            placeholder={!isGuestUser ? "Enter your last name" : ""}
            disabled={!editMode || isGuestUser}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
          />
        </div>
      </div>

      {/* Email + OTP trigger */}
      <div
        className={styles.FieldContainer}
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        <div className={styles.Field}>
          <input
            value={profile.email || ""}
            placeholder={
              isGuestUser ? "Login to view email" : "Enter your email address"
            }
            disabled={!editMode || isGuestUser}
            onChange={(e) => {
              setEmailError(""); // Clear red error when typing
              onFieldChange("email", e.target.value);
            }}
          />
          {editMode && !isGuestUser && profile.email !== originalEmail && (
            <span className={styles.VerifyBtn} onClick={handleVerifyClick}>
              Verify
            </span>
          )}
        </div>

        {/* --- The Red Error Message --- */}

        {showOtpPopup && otpNode}
      </div>

      {/* Phone + Gender row */}
      <div className={styles.Row}>
        <div className={styles.Field}>
          <input
            value={profile.phone || ""}
            placeholder={
              editMode ? "Add your phone number" : "No phone number added"
            }
            disabled={!editMode || isGuestUser}
            onChange={(e) => onFieldChange("phone", e.target.value)}
          />
        </div>

        <div className={styles.Field} ref={genderRef}>
          {editMode ? (
            <div
              className={styles.SelectContainer}
              style={{ position: "relative" }}
            >
              <div
                className={styles.CustomSelectTrigger}
                onClick={() => setIsGenderOpen(!isGenderOpen)}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {profile.gender || "Select Gender"}
                </span>
                <span
                  className={`${styles.Arrow} ${isGenderOpen ? styles.Rotate : ""}`}
                >
                  ▼
                </span>
              </div>

              {isGenderOpen && (
                <div className={styles.CustomOptionsList}>
                  {genderOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={styles.OptionItem}
                      onClick={() => {
                        onFieldChange("gender", opt.value);
                        setIsGenderOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <input
              value={profile.gender || ""}
              style={{ textTransform: "capitalize" }}
              disabled
              placeholder="Not Specified"
            />
          )}
        </div>
      </div>

      {errors.general && (
        <p className={styles.ErrorText} style={{ marginTop: "8px" }}>
          {errors.general}
        </p>
      )}

      {errors.firstName && (
        <p className={styles.ErrorText}>{errors.firstName}</p>
      )}

      {errors.lastName && <p className={styles.ErrorText}>{errors.lastName}</p>}

      {emailError && <p className={styles.ErrorText}>{emailError}</p>}

      {errors.phone && <p className={styles.ErrorText}>{errors.phone}</p>}

      {editMode && !isGuestUser && (
        <div className={styles.ActionRow}>
          <button className={styles.SaveBtn} onClick={onSave}>
            Save Changes
          </button>
          <button className={styles.CancelBtn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;  
