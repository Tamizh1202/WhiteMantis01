"use client";
// ─── OtpVerificationPopup ─────────────────────────────────────────────────────
// Full-screen overlay shown when the user changes their email and clicks Verify.
//
// Props:
//   email       string   — the new email the OTP was sent to
//   countdown   number   — seconds remaining on the resend cooldown
//   otp         string[] — array of 4 digit strings
//   inputRefs   ref      — React ref array for the 4 inputs (for focus management)
//   onChange    (e, index) => void
//   onKeyDown   (e, index) => void
//   onVerify    () => void   — called when user clicks the Verify button
//   onClose     () => void   — closes the popup

import React from "react";
import styles from "../ProfileComponents.module.css";

const OtpVerificationPopup = ({ email, countdown, otp, inputRefs, onChange, onKeyDown, onVerify, onClose }) => {
    return (
        <div className={styles.styleOTP}>
            <div className={styles.main1}>
                <div className={styles.main11}>
                    {/* Header */}
                    <div className={styles.div1}>
                        <h2>EMAIL VERIFICATION</h2>
                        <p>We've sent a verification code to {email}</p>
                    </div>

                    {/* 4-digit OTP inputs */}
                    <div className={styles.div2}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                className={styles.input}
                                type="text"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={digit}
                                onChange={(e) => onChange(e, index)}
                                onKeyDown={(e) => onKeyDown(e, index)}
                                style={{
                                    borderColor: digit ? "#6C7A5F" : "#2F362A4D",
                                    color: digit ? "#6C7A5F" : "#FFFFFF",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.div3}>
                    <div className={styles.verify}>
                        <button
                            className={styles.buttons}
                            style={{ cursor: "pointer", border: "none" }}
                            onClick={onVerify}
                        >
                            Verify
                        </button>
                    </div>
                    <div className={styles.txt}>
                        <p>
                            Didn't receive it? Check spam or <a href="#">Resend OTP</a> ({countdown}s)
                        </p>
                    </div>
                </div>

                {/* Close × button */}
                <button onClick={onClose} className={styles.closeButton}>
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_otp_close" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                            <rect width="16" height="16" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_otp_close)">
                            <path d="M3.28449 11.7702L7.05573 7.99895L3.28449 4.22772L4.2273 3.28491L7.99854 7.05614L11.7698 3.28491L12.7126 4.22772L8.94134 7.99895L12.7126 11.7702L11.7698 12.713L7.99854 8.94176L4.2273 12.713L3.28449 11.7702Z" fill="#6E736A" />
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default OtpVerificationPopup;
