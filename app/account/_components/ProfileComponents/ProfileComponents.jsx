"use client";
// ─── ProfileComponents (Orchestrator) ────────────────────────────────────────
// This is the top-level component for the profile page.
// It owns ALL state and passes only the needed props down to each sub-component.
//
// Sub-components live in: ./_components/
// API helpers live in:    ./profileApiUtils.js
// Constants live in:      ./profileConstants.js
// Validation uses:        @/utils/validatorFunctions

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import styles from "./ProfileComponents.module.css";

// ── Utils & Constants ─────────────────────────────────────────────────────────
import { UAE_STATES } from "./profileConstants";
import {
  updateProfileAPI,
  saveAddressAPI,
  deleteAddressAPI,
  checkDeleteAccountAPI,
  confirmDeleteAccountAPI,
} from "./profileApiUtils";
import { validateRequired, validateUAEPhone } from "@/utils/validatorFunctions";

// ── Sub-components ────────────────────────────────────────────────────────────
import ProfilePictureSection from "./_components/ProfilePictureSection";
import PersonalInfoForm from "./_components/PersonalInfoForm";
import OtpVerificationPopup from "./_components/OtpVerificationPopup";
import AddressSection from "./_components/AddressSection";
import AddressFormPopup from "./_components/AddressFormPopup";
import DeleteAddressPopup from "./_components/DeleteAddressPopup";
import DeleteAccountPopup from "./_components/DeleteAccountPopup";

// ─────────────────────────────────────────────────────────────────────────────

const ProfileComponents = ({ initialData }) => {
  console.log(initialData);

  const { update, data: session } = useSession();
  const isGuestUser = false;

  // ── Profile state ───────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    firstName: initialData?.user?.firstName || "",
    lastName: initialData?.user?.lastName || "",
    email: initialData?.user?.email || "",
    phone: initialData?.user?.phone || "",
    gender: initialData?.user?.gender || "",
    profileImage: initialData?.user?.profileImage || null,
  });
  const [originalEmail, setOriginalEmail] = useState(initialData?.user?.email || "");
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  // ── OTP state ───────────────────────────────────────────────────────────────
  const [showOTP, popOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

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
  const [addresses, setAddresses] = useState(initialData?.user?.addresses || []);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showEditAddressPopup, setShowEditAddressPopup] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [addressGeneralError, setAddressGeneralError] = useState("");
  const [activeLabelBtn, setActiveLabelBtn] = useState(null);

  const [showDeleteAddressPopup, setShowDeleteAddressPopup] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  // ── Delete account state ────────────────────────────────────────────────────
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);

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
    const fnErr = validateRequired((profile.firstName || "").trim(), "First name");
    const lnErr = validateRequired((profile.lastName || "").trim(), "Last name");
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
      setOriginalEmail(profile.email);
      setEditMode(false);
      alert("Profile updated successfully!");
    } else {
      setErrors({ general: result.message || "Failed to update profile" });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setErrors({});
  };

  // ── Profile picture handlers ────────────────────────────────────────────────
  const handleUploadProfilePic = async (base64Image) => {
    const res = await updateProfileAPI(session?.user?.id, { base64Image });
    if (res?.success) {
      const newImage = res.data?.customer?.meta_data?.find((m) => m.key === "profile_image")?.value;
      await update({ profile_image: newImage });
      window.location.reload();
    }
  };

  const handleRemoveProfilePic = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return;
    const res = await updateProfileAPI(session?.user?.id, { profile_image: "" });
    if (res?.success) {
      await update({ profile_image: null });
      window.location.reload();
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
    setActiveLabelBtn(null);
    setAddressForm({ isDefault: true, country: "United Arab Emirates", state: "Dubai" });
    setAddressErrors({});
    setAddressGeneralError("");
    setShowAddressPopup(true);
  };

  // ── Open Edit Address popup ─────────────────────────────────────────────────
  const openEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    const currentLabel = addr.label || "";
    const isStandard = ["Home", "Work"].includes(currentLabel);
    setActiveLabelBtn(isStandard ? currentLabel : "Others");
    setAddressForm({
      ...addr,
      address: addr.street || addr.address || "",
      phone: addr.phoneNumber || "",
      country: addr.country || addr.emirates || "United Arab Emirates",
      state: addr.emirates || addr.state || "",
    });
    setAddressErrors({});
    setAddressGeneralError("");
    setShowEditAddressPopup(true);
  };

  // ── Save address (add or edit) ──────────────────────────────────────────────
  const handleSaveAddress = async () => {
    const newErrors = {};

    const fnErr = validateRequired((addressForm.addressFirstName || "").trim(), "First name");
    const addrErr = validateRequired((addressForm.address || "").trim(), "Address");
    const phErr = validateUAEPhone(addressForm.phone);

    if (fnErr) newErrors.fullName = fnErr;
    if (addrErr) newErrors.address = addrErr;
    if (phErr) newErrors.phone = phErr;

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors);
      return;
    }

    const payload = [{
      label: addressForm.label || "others",
      addressFirstName: addressForm.addressFirstName || "",
      addressLastName: addressForm.addressLastName || "",
      street: addressForm.address || addressForm.house || "",
      apartment: addressForm.apartment || addressForm.area || "",
      country: "United Arab Emirates",
      city: addressForm.city || "",
      emirates: addressForm.state || "",
      phone: addressForm.phone || "",
      isDefaultAddress: addressForm.isDefault || false,
      ...(editingAddressId ? { address_id: editingAddressId } : {}),
    }];

    const result = await saveAddressAPI(session?.user?.id, payload);
    if (result?.success) {
      setAddresses(result.updatedAddresses);
      setShowAddressPopup(false);
      setShowEditAddressPopup(false);
      setEditingAddressId(null);
    } else {
      setAddressGeneralError(result.error || "Failed to save address");
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
    const result = await checkDeleteAccountAPI();
    if (result.success) {
      setAccountStatus(result.data);
      setShowDeletePopup(true);
    } else {
      alert(result.error || "Failed to check account status. Please try again.");
    }
  };

  const handleConfirmDeleteAccount = async () => {
    const result = await confirmDeleteAccountAPI();
    if (result.success) {
      window.location.href = "/";
    } else {
      alert(result.error || "Failed to delete account. Please try again.");
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
              onVerifyEmail={() => { popOTP(true); setCountdown(60); }}
              showOtpPopup={showOTP}
              otpNode={
                <OtpVerificationPopup
                  email={profile.email}
                  countdown={countdown}
                  otp={otp}
                  inputRefs={inputRefs}
                  onChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown}
                  onVerify={() => { /* TODO: wire OTP validation API */ }}
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
          onFormChange={handleAddressFormChange}
          onLabelSelect={(label) => { setActiveLabelBtn(label); handleAddressFormChange("label", label); }}
          onSave={handleSaveAddress}
          onCancel={() => { setShowAddressPopup(false); setAddressErrors({}); }}
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
          onFormChange={handleAddressFormChange}
          onLabelSelect={(label) => { setActiveLabelBtn(label); handleAddressFormChange("label", label); }}
          onSave={handleSaveAddress}
          onCancel={() => { setShowEditAddressPopup(false); setAddressErrors({}); }}
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
          onKeep={() => { setShowDeletePopup(false); setAccountStatus(null); }}
          onConfirm={handleConfirmDeleteAccount}
        />
      )}
    </>
  );
};

export default ProfileComponents;