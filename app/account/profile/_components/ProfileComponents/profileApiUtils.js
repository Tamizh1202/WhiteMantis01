import axiosClient from "@/lib/axios";

export const updateProfileAPI = async (userId, payload) => {
  console.log(payload);
  try {
    const res = await axiosClient.patch(`/api/users/${userId}`, payload);
    const data = res.data;
    if (data.message === "Updated successfully." || res.status === 200) {
      return { success: true, data };
    }
    return { success: false };
  } catch (error) {
    console.error(
      "updateProfileAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to update profile",
    };
  }
};

export const removeProfileImageAPI = async (userId) => {
  try {
    const res = await axiosClient.patch(`/api/users/${userId}`, {
      profileImage: null,
    });
    if (res.status === 200) {
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error(
      "removeProfileImageAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to remove profile picture",
    };
  }
};

export const saveAddressAPI = async (userId, addressPayload) => {
  console.log(addressPayload);
  try {
    const res = await axiosClient.post(
      `/api/users/${userId}/addresses`,
      addressPayload,
    );
    const data = res.data;
    if (
      res.status === 201 ||
      res.status === 200 ||
      data.message?.toLowerCase().includes("updated")
    ) {
      const updatedAddresses =
        data.doc?.addresses ||
        data.addresses ||
        data.doc?.saved_addresses ||
        data.saved_addresses ||
        (Array.isArray(addressPayload) ? addressPayload : []);
      return { success: true, updatedAddresses };
    }
    return { success: false };
  } catch (error) {
    console.error(
      "saveAddressAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to save address",
    };
  }
};

export const updateAddressAPI = async (userId, addressPayload) => {
  console.log(addressPayload);
  try {
    const res = await axiosClient.patch(
      `/api/users/${userId}/addresses`,
      addressPayload,
    );
    const data = res.data;
    if (
      res.status === 201 ||
      res.status === 200 ||
      data.message?.toLowerCase().includes("updated")
    ) {
      const updatedAddresses =
        data.doc?.addresses ||
        data.addresses ||
        data.doc?.saved_addresses ||
        data.saved_addresses ||
        (Array.isArray(addressPayload) ? addressPayload : []);
      return { success: true, updatedAddresses };
    }
    return { success: false };
  } catch (error) {
    console.error(
      "updateAddressAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to update address",
    };
  }
};

export const deleteAddressAPI = async (userId, addressId) => {
  console.log("addressId :", addressId);
  try {
    const res = await axiosClient.delete(`/api/users/${userId}/addresses`, {
      data: { addressId },
    });
    console.log("deleteAddressAPI response:", res.data);
    return { success: true };
  } catch (error) {
    console.error(
      "deleteAddressAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to delete address",
    };
  }
};

export const confirmDeleteAccountAPI = async (userId) => {
  try {
    const res = await axiosClient.delete(`/api/users/${userId}`);
    const data = res.data;
    if (res.status === 200 || data.success) {
      return { success: true, data };
    }
    return {
      success: false,
      error: data.message || "Failed to delete account",
    };
  } catch (error) {
    console.error(
      "confirmDeleteAccountAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to delete account",
    };
  }
};

// Accepts { base64, filename } object — backend also expects these exact keys
export const uploadProfileImageAPI = async ({ base64, filename }) => {
  try {
    const res = await axiosClient.post(`/api/users/upload-profile-image`, {
      base64,
      filename,
    });
    const data = res.data;
    if (res.status === 200) {
      return { success: true, data };
    }
    return { success: false };
  } catch (error) {
    console.error(
      "uploadProfileImageAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      error: backendMsg || error.message || "Failed to upload image",
    };
  }
};

// Sends OTP to the new email address the user wants to switch to
export const changeEmailOtpAPI = async (email) => {
  try {
    const res = await axiosClient.post(`/api/users/web-change-email`, {
      email,
    });
    const data = res.data;
    if (res.status === 200 && data.success) {
      return { success: true };
    }
    return { success: false, message: data.message || "Failed to send OTP" };
  } catch (error) {
    console.error(
      "changeEmailOtpAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      message: backendMsg || error.message || "Failed to send OTP",
    };
  }
};

export const verifyChangeEmailOtpAPI = async (email, otp) => {
  try {
    const res = await axiosClient.post(`/api/users/web-verify-change-email`, {
      email,
      otp,
    });
    const data = res.data;
    if (res.status === 200 && data.success) {
      return { success: true };
    }
    return { success: false, message: data.message || "Failed to verify OTP" };
  } catch (error) {
    console.error(
      "verifyChangeEmailOtpAPI error:",
      error.response?.data || error.message,
    );
    const resData = error?.response?.data;
    const backendMsg =
      resData?.message || resData?.error || resData?.errors?.[0]?.message;
    return {
      success: false,
      message: backendMsg || error.message || "Failed to verify OTP",
    };
  }
};
