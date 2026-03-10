"use client";
// ─── PersonalInfoForm ─────────────────────────────────────────────────────────
// Renders the "Personal Information" card with all profile fields.
//
// Props:
//   profile         object   — { firstName, lastName, email, phone, gender }
//   editMode        boolean
//   errors          object   — { firstName?, lastName?, phone?, general? }
//   isGuestUser     boolean
//   originalEmail   string
//   onFieldChange   (field: string, value: string) => void
//   onSave          () => void
//   onCancel        () => void
//   onVerifyEmail   () => void   — opens the OTP popup
//   showOtpPopup    boolean
//   otpNode         ReactNode    — the <OtpVerificationPopup /> to render inline

import React from "react";
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
    return (
        <div className={styles.PersonalInfoSection}>
            {isGuestUser && (
                <p className={styles.GuestNote}>Please login to manage your profile details.</p>
            )}

            {/* Section header */}
            <div className={styles.AddressHeader}>
                <h4>Personal Information</h4>
                {!editMode && (
                    <button onClick={() => onFieldChange("__editMode__", true)}>Edit</button>
                )}
            </div>

            {/* First name + Last name row */}
            <div className={styles.Name1}>
                <div className={styles.Field}>
                    <input
                        value={profile.firstName && profile.firstName}
                        placeholder={!isGuestUser ? "Enter your first name" : ""}
                        disabled={!editMode || isGuestUser}
                        onChange={(e) => onFieldChange("firstName", e.target.value)}
                    />
                    {errors.firstName && (
                        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.firstName}</p>
                    )}
                </div>

                <div className={styles.Field}>
                    <input
                        value={profile.lastName && profile.lastName}
                        placeholder={!isGuestUser ? "Enter your last name" : ""}
                        disabled={!editMode || isGuestUser}
                        onChange={(e) => onFieldChange("lastName", e.target.value)}
                    />
                    {errors.lastName && (
                        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.lastName}</p>
                    )}
                </div>
            </div>

            {/* Email + OTP trigger */}
            <div className={styles.Field}>
                <input
                    value={profile.email || ""}
                    placeholder={isGuestUser ? "Login to view email" : "Enter your email address"}
                    disabled={!editMode || isGuestUser}
                    onChange={(e) => onFieldChange("email", e.target.value)}
                />
                {editMode && !isGuestUser && profile.email !== originalEmail && (
                    <span onClick={onVerifyEmail}>Verify</span>
                )}
                {showOtpPopup && otpNode}
            </div>

            {/* Phone + Gender row */}
            <div className={styles.Row}>
                <div className={styles.Field}>
                    <input
                        value={profile.phone || ""}
                        placeholder={
                            editMode
                                ? "Add your phone number"
                                : profile.phone
                                    ? ""
                                    : isGuestUser
                                        ? "Login to add phone number"
                                        : "No phone number added"
                        }
                        disabled={!editMode || isGuestUser}
                        onChange={(e) => onFieldChange("phone", e.target.value)}
                    />
                    {errors.phone && (
                        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.phone}</p>
                    )}
                </div>

                <div className={styles.Field}>
                    {editMode ? (
                        <select
                            value={profile.gender || ""}
                            onChange={(e) => onFieldChange("gender", e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    ) : (
                        <input value={profile.gender || ""} style={{ textTransform: "capitalize" }} disabled />
                    )}
                </div>
            </div>

            {/* General error */}
            {errors.general && (
                <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>{errors.general}</p>
            )}

            {/* Save / Cancel */}
            {editMode && !isGuestUser && (
                <div className={styles.ActionRow}>
                    <button className={styles.SaveBtn} onClick={onSave}>Save Changes</button>
                    <button className={styles.CancelBtn} onClick={onCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoForm;
