"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import styles from "./ProfileComponents.module.css";
import { UAE_STATES } from "./profileConstants";
import {
  updateProfileAPI,
  saveAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  removeProfileImageAPI,
  confirmDeleteAccountAPI,
  changeEmailOtpAPI,
  verifyChangeEmailOtpAPI,
} from "./profileApiUtils";
import {
  validateEmail,
  validateRequired,
  validateUAEPhone,
} from "@/utils/validatorFunctions";
import ProfilePictureSection from "./_components/ProfilePictureSection";
import PersonalInfoForm from "./_components/PersonalInfoForm";
import OtpVerificationPopup from "./_components/OtpVerificationPopup";
import AddressSection from "./_components/AddressSection";
import AddressFormPopup from "./_components/AddressFormPopup";
import DeleteAddressPopup from "./_components/DeleteAddressPopup";
import DeleteAccountPopup from "./_components/DeleteAccountPopup";

const ProfileComponents = ({ initialData }) => {
  const { update, data: session, status } = useSession();
  const isGuestUser = status === "unauthenticated";

  // Determine the core user data from initialData (could be direct or nested in .user)
  const userData = initialData?.user || initialData || {};

  const [profile, setProfile] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    gender: userData.gender || "male",
    profileImage: userData.profileImage || null,
  });
  const [originalEmail, setOriginalEmail] = useState(userData.email || "");

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  // ── OTP state ───────────────────────────────────────────────────────────────
  const [showOTP, popOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const skipSyncRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ── Address state ───────────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState(
    Array.isArray(userData.addresses) ? userData.addresses : [],
  );
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showEditAddressPopup, setShowEditAddressPopup] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [addressGeneralError, setAddressGeneralError] = useState("");
  const [activeLabelBtn, setActiveLabelBtn] = useState(null);

  const [showDeleteAddressPopup, setShowDeleteAddressPopup] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // ── Delete account state ────────────────────────────────────────────────────
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);

  // Sync profile when initialData or session becomes available
  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    if ((initialData || session?.user) && !editMode) {
      // Prioritize session user data for real-time updates
      const sUser = session?.user;
      const iData = initialData?.user || initialData?.data || initialData || {};

      setProfile((prev) => ({
        ...prev,
        firstName:
          sUser?.firstName !== undefined
            ? sUser.firstName
            : iData.firstName !== undefined
              ? iData.firstName
              : prev.firstName,
        lastName:
          sUser?.lastName !== undefined
            ? sUser.lastName
            : iData.lastName !== undefined
              ? iData.lastName
              : prev.lastName,
        email:
          sUser?.email !== undefined
            ? sUser.email
            : iData.email !== undefined
              ? iData.email
              : prev.email,
        phone:
          sUser?.phone !== undefined
            ? sUser.phone
            : iData.phone !== undefined
              ? iData.phone
              : prev.phone,
        gender:
          sUser?.gender !== undefined
            ? sUser.gender
            : iData.gender !== undefined
              ? iData.gender
              : prev.gender,
        // profileImage is excluded from session sync to prevent stale overwrites
      }));
      setOriginalEmail(
        sUser?.email !== undefined
          ? sUser.email
          : iData.email !== undefined
            ? iData.email
            : originalEmail,
      );
      if (Array.isArray(iData.addresses)) {
        setAddresses(iData.addresses);
      }
    }
  }, [initialData, session, status, editMode]);

  // ── Profile handlers ────────────────────────────────────────────────────────
  /**
   * Generic field change handler.
   * The special field "__editMode__" is used by PersonalInfoForm's Edit button.
   */
  const handleFieldChange = (field, value) => {
    if (field === "__editMode__") {
      setEditMode(true);
      return;
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    const newErrors = {};
    const fnErr = validateRequired(
      (profile.firstName || "").trim(),
      "First name",
    );
    const lnErr = validateRequired(
      (profile.lastName || "").trim(),
      "Last name",
    );
    if (fnErr) newErrors.firstName = fnErr;
    if (lnErr) newErrors.lastName = lnErr;

    // Phone is optional but must be valid if provided
    if (profile.phone) {
      const phErr = validateUAEPhone(profile.phone);
      if (phErr) newErrors.phone = phErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: (profile.phone || "").trim(),
      gender: (profile.gender || "male").toLowerCase(),
    };

    const result = await updateProfileAPI(session?.user?.id, payload);
    if (result?.success) {
      // Update session name and other fields
      await update({
        user: {
          ...session.user,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          gender: payload.gender,
        },
      });
      skipSyncRef.current = true;
      setOriginalEmail(profile.email);
      setEditMode(false);
      toast.success(result.data?.message || "Profile updated successfully!");
    } else {
      const msg = result.message || "Failed to update profile";
      setErrors({ general: msg });
      toast.error(msg);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setErrors({});
  };

  // ── Email verify handler ─────────────────────────────────────────────────────
  // Reads the *currently edited* email from profile state and sends an OTP there.
  const handleVerifyEmail = async () => {
    const emailToVerify = profile.email?.trim();
    if (!emailToVerify) return;

    const emailErr = validateEmail(emailToVerify);
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
      return;
    }

    const result = await changeEmailOtpAPI(emailToVerify);
    if (result.success) {
      popOTP(true);
      setCountdown(60);
      toast.success(result.message || "OTP sent successfully to your email!");
    } else {
      const msg = result.message || "Failed to send OTP";
      setErrors((prev) => ({ ...prev, email: msg }));
      toast.error(msg);
    }
  };

  // ── OTP verification handler ─────────────────────────────────────────────────
  // Called when user clicks "Verify" in the OTP popup.
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) {
      toast.error("Please enter the complete 4-digit code.");
      return;
    }
    const newEmail = profile.email?.trim();
    const result = await verifyChangeEmailOtpAPI(newEmail, otpString);
    if (result.success) {
      // Update the Next-Auth session to reflect the new email immediately
      await update({
        user: {
          ...session.user,
          email: newEmail,
        },
      });
      skipSyncRef.current = true;
      popOTP(false);
      setOtp(["", "", "", ""]);
      setOriginalEmail(newEmail);
      toast.success(result.message || "Email updated successfully!");
    } else {
      toast.error(result.message || "Invalid OTP. Please try again.");
    }
  };

  // ── Profile picture handlers ────────────────────────────────────────────────
  // Called by ProfilePictureSection after a successful upload with the media doc
  const handleUploadProfilePic = async (mediaDoc) => {
    if (!mediaDoc) return;
    setProfile((prev) => ({ ...prev, profileImage: mediaDoc }));

    // Update the profile in the DB (though the upload itself might have done it,
    // we ensure the session knows about the specific new mediaDoc)
    const res = await updateProfileAPI(session?.user?.id, {
      profileImage: mediaDoc.id,
    });
    if (res?.success) {
      await update({
        user: {
          ...session.user,
          profileImage: mediaDoc,
        },
      });
      skipSyncRef.current = true;
      toast.success("Profile picture uploaded successfully!");
    }
  };

  const handleRemoveProfilePic = async () => {
    const res = await removeProfileImageAPI(session?.user?.id);
    if (res?.success) {
      // Clear the image in local state — avatar switches to default immediately
      setProfile((prev) => ({ ...prev, profileImage: null }));
      await update({
        user: {
          ...session.user,
          profileImage: null,
        },
      });
      skipSyncRef.current = true;
      toast.success("Profile picture removed successfully!");
    } else {
      toast.error("Failed to remove profile picture. Please try again.");
    }
  };

  // ── Address form change ─────────────────────────────────────────────────────
  const handleAddressFormChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ── Open Add Address popup ──────────────────────────────────────────────────
  const openAddAddress = () => {
    setEditingAddressId(null);
    setActiveLabelBtn("Home"); // Default to Home
    setAddressForm({
      isDefault: true,
      country: "United Arab Emirates",
      state: "dubai", // snake_case
      label: "Home",
    });
    setAddressErrors({});
    setAddressGeneralError("");
    setShowAddressPopup(true);
  };

  // ── Open Edit Address popup ─────────────────────────────────────────────────
  const openEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    const rawLabel = addr.label || "";
    // Normalise label to match constants: Title Case
    const normalizedLabel =
      rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).toLowerCase();
    const isStandard = ["Home", "Work"].includes(normalizedLabel);
    const finalLabel = isStandard ? normalizedLabel : "Others";

    const rawState = addr.emirates || addr.state || "dubai";
    const normalizedState = rawState.toLowerCase().replace(/\s+/g, "_");

    setActiveLabelBtn(finalLabel);
    setAddressForm({
      ...addr,
      address: addr.street || addr.address || "",
      phone: addr.phoneNumber || "",
      country: addr.country || "United Arab Emirates",
      state: normalizedState,
      label: finalLabel,
    });
    setAddressErrors({});
    setAddressGeneralError("");
    setShowEditAddressPopup(true);
  };

  // ── Save address (add) ─────────────────────────────────────────────────────
  const handleSaveAddress = async () => {
    if (isSubmittingAddress) return;
    const newErrors = {};

    const fnErr = validateRequired(
      (addressForm.addressFirstName || "").trim(),
      "First name",
    );
    const addrErr = validateRequired(
      (addressForm.address || "").trim(),
      "Address",
    );
    const phErr = validateUAEPhone(addressForm.phone);

    if (fnErr) newErrors.fullName = fnErr;
    if (addrErr) newErrors.address = addrErr;
    if (phErr) newErrors.phone = phErr;

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors);
      return;
    }

    setIsSubmittingAddress(true);
    try {
      const payload = {
        label: addressForm.label || "Others",
        addressFirstName: (addressForm.addressFirstName || "").trim(),
        addressLastName: (addressForm.addressLastName || "").trim(),
        street: (addressForm.address || addressForm.house || "").trim(),
        apartment: (addressForm.apartment || addressForm.area || "").trim(),
        country: "United Arab Emirates",
        city: (addressForm.city || "").trim(),
        emirates: addressForm.state || "",
        phoneNumber: (addressForm.phone || "").trim(),
        isDefaultAddress: addressForm.isDefault || false,
      };

      const result = await saveAddressAPI(session?.user?.id, payload);
      if (result?.success) {
        setAddresses(result.updatedAddresses);
        setShowAddressPopup(false);
        setEditingAddressId(null);
        toast.success(result.message || "Address saved successfully!");
      } else {
        const msg = result.error || "Failed to save address";
        setAddressGeneralError(msg);
        toast.error(msg);
      }
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // ── Update address (edit) ───────────────────────────────────────────────────
  const handleUpdateAddress = async () => {
    if (isSubmittingAddress) return;
    const newErrors = {};

    const fnErr = validateRequired(
      (addressForm.addressFirstName || "").trim(),
      "First name",
    );
    const addrErr = validateRequired(
      (addressForm.address || "").trim(),
      "Address",
    );
    const phErr = validateUAEPhone(addressForm.phone);

    if (fnErr) newErrors.fullName = fnErr;
    if (addrErr) newErrors.address = addrErr;
    if (phErr) newErrors.phone = phErr;

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors);
      return;
    }

    setIsSubmittingAddress(true);
    try {
      const payload = {
        addressId: editingAddressId,
        label: addressForm.label || "Others",
        addressFirstName: (addressForm.addressFirstName || "").trim(),
        addressLastName: (addressForm.addressLastName || "").trim(),
        street: (addressForm.address || addressForm.house || "").trim(),
        apartment: (addressForm.apartment || addressForm.area || "").trim(),
        country: "United Arab Emirates",
        city: (addressForm.city || "").trim(),
        emirates: addressForm.state || "",
        phoneNumber: (addressForm.phone || "").trim(),
        isDefaultAddress: addressForm.isDefault || false,
      };

      const result = await updateAddressAPI(session?.user?.id, payload);
      if (result?.success) {
        setAddresses(result.updatedAddresses);
        setShowEditAddressPopup(false);
        setEditingAddressId(null);
        toast.success(result.message || "Address updated successfully!");
      } else {
        const msg = result.error || "Failed to update address";
        setAddressGeneralError(msg);
        toast.error(msg);
      }
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // ── Delete address ──────────────────────────────────────────────────────────
  const handleDeleteRequest = (id) => {
    setDeleteAddressId(id);
    setShowDeleteAddressPopup(true);
  };

  const handleConfirmDeleteAddress = async () => {
    const newAddresses = addresses.filter((a) => a.id !== deleteAddressId);
    setAddresses(newAddresses);
    setShowDeleteAddressPopup(false);
    await deleteAddressAPI(session?.user?.id, deleteAddressId);
    setDeleteAddressId(null);
  };

  // ── Delete account ──────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!session?.user?.id) return;
    const result = await confirmDeleteAccountAPI(session?.user?.id);
    if (result.success) {
      setShowDeletePopup(false);
      localStorage.clear();
      sessionStorage.clear();
      await signOut({ callbackUrl: "/" });
    } else {
      toast.error(
        result.error || "Failed to delete account. Please try again.",
      );
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          {/* 1. Profile picture */}
          <ProfilePictureSection
            profileImageUrl={profile.profileImage?.url || null}
            isGuestUser={isGuestUser}
            onUpload={handleUploadProfilePic}
            onRemove={handleRemoveProfilePic}
          />

          <div className={styles.Bottom}>
            {/* 2. Personal info + OTP popup */}
            <PersonalInfoForm
              profile={profile}
              editMode={editMode}
              errors={errors}
              isGuestUser={isGuestUser}
              originalEmail={originalEmail}
              onFieldChange={handleFieldChange}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              onVerifyEmail={handleVerifyEmail}
              showOtpPopup={showOTP}
              otpNode={
                <OtpVerificationPopup
                  email={profile.email}
                  countdown={countdown}
                  otp={otp}
                  inputRefs={inputRefs}
                  onChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown}
                  onVerify={handleVerifyOtp}
                  onResend={handleVerifyEmail}
                  onClose={() => popOTP(false)}
                />
              }
            />

            {/* 3. Saved addresses */}
            {!isGuestUser && (
              <AddressSection
                addresses={addresses}
                onAddNew={openAddAddress}
                onEdit={openEditAddress}
                onDeleteRequest={handleDeleteRequest}
              />
            )}

            {/* 4. Delete account section */}
            {!isGuestUser && (
              <div className={styles.DeleteAccount}>
                <h4>DELETE ACCOUNT</h4>
                <button onClick={handleDeleteAccount}>Delete My Account</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Popups ── */}

      {/* Add address popup */}
      {showAddressPopup && (
        <AddressFormPopup
          mode="add"
          addressForm={addressForm}
          addressErrors={addressErrors}
          addressGeneralError={addressGeneralError}
          activeLabelBtn={activeLabelBtn}
          UAE_STATES={UAE_STATES}
          isSubmitting={isSubmittingAddress}
          onFormChange={handleAddressFormChange}
          onLabelSelect={(label) => {
            setActiveLabelBtn(label);
            handleAddressFormChange("label", label);
          }}
          onSave={handleSaveAddress}
          onCancel={() => {
            setShowAddressPopup(false);
            setAddressErrors({});
          }}
        />
      )}

      {/* Edit address popup */}
      {showEditAddressPopup && (
        <AddressFormPopup
          mode="edit"
          addressForm={addressForm}
          addressErrors={addressErrors}
          addressGeneralError={addressGeneralError}
          activeLabelBtn={activeLabelBtn}
          UAE_STATES={UAE_STATES}
          isSubmitting={isSubmittingAddress}
          onFormChange={handleAddressFormChange}
          onLabelSelect={(label) => {
            setActiveLabelBtn(label);
            handleAddressFormChange("label", label);
          }}
          onSave={handleUpdateAddress}
          onCancel={() => {
            setShowEditAddressPopup(false);
            setAddressErrors({});
          }}
        />
      )}

      {/* Delete address confirmation */}
      {showDeleteAddressPopup && (
        <DeleteAddressPopup
          onConfirm={handleConfirmDeleteAddress}
          onCancel={() => setShowDeleteAddressPopup(false)}
        />
      )}

      {/* Delete account confirmation */}
      {showDeletePopup && (
        <DeleteAccountPopup
          accountStatus={accountStatus}
          onKeep={() => {
            setShowDeletePopup(false);
            setAccountStatus(null);
          }}
          onConfirm={handleConfirmDeleteAccount}
        />
      )}
    </>
  );
};

export default ProfileComponents;
