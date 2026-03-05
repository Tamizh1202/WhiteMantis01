"use client";
// ─── ProfilePictureSection ────────────────────────────────────────────────────
// Displays the avatar image plus upload / remove controls.
//
// Props:
//   profileImageUrl  string | null  — URL of the current profile image
//   onUpload         (base64: string) => void
//   onRemove         () => void
//   isGuestUser      boolean

import React from "react";
import styles from "../ProfileComponents.module.css";
import defaultAvatar from "../1.png";

const ProfilePictureSection = ({ profileImageUrl, onUpload, onRemove, isGuestUser }) => {
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpload(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={styles.Top}>
            {/* Left: avatar */}
            <div className={styles.TopLeft}>
                <img src={profileImageUrl || defaultAvatar.src} alt="Profile avatar" />
            </div>

            {/* Right: upload / remove — hidden for guests */}
            {!isGuestUser && (
                <div className={styles.TopRight}>
                    <label
                        className={styles.pfbtn}
                        style={{ cursor: "pointer", display: "inline-block", textAlign: "center", paddingTop: "10px" }}
                    >
                        Upload New Profile Picture
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </label>

                    <button className={styles.pfrembtn} onClick={onRemove}>
                        Remove Profile Picture
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePictureSection;
