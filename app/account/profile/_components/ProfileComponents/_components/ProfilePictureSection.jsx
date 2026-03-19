"use client";
import React from "react";
import styles from "../ProfileComponents.module.css";
import defaultAvatar from "../profileImage.png";
import { formatImageUrl, toBase64 } from "@/lib/imageUtils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axiosClient from "@/lib/axios";
import { uploadProfileImageAPI } from "../profileApiUtils";

const ProfilePictureSection = ({
  profileImageUrl,
  onUpload,
  onRemove,
  isGuestUser,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      toast.error("File is too big! Max 100KB.");
      return;
    }

    try {
      const base64String = await toBase64(file);
      const response = await uploadProfileImageAPI({
        base64: base64String,
        filename: file.name,
      });

      if (response.success) {
        // Pass the new media doc up so the parent can update the avatar in state
        onUpload?.(response.data?.media);
      } else {
        toast.error("Upload failed!");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("Something went wrong during upload.");
    }
  };

  return (
    <div className={styles.Top}>
      {/* Left: avatar */}
      <div className={styles.TopLeft}>
        <img
          src={formatImageUrl(profileImageUrl) || defaultAvatar.src}
          alt="Profile avatar"
        />
      </div>

      {/* Right: upload / remove — hidden for guests */}
      {!isGuestUser && (
        <div className={styles.TopRight}>
          <label
            className={styles.pfbtn}
            style={{
              cursor: "pointer",
              display: "inline-block",
              textAlign: "center",
              paddingTop: "10px",
            }}
          >
            Upload New Profile Picture
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>

          {profileImageUrl && (
            <button className={styles.pfrembtn} onClick={onRemove}>
              Remove Profile Picture
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureSection;
