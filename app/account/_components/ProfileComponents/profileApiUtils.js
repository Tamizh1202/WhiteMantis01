// ─── Profile API Helpers ───────────────────────────────────────────────────────
// All network calls for the profile page live here.
// Components should call these functions — never call axiosClient directly.

import axiosClient from "@/lib/axios";

/**
 * PATCH the user's core profile fields (name, phone, gender …).
 * @param {string} userId  - session user id
 * @param {object} payload - fields to update
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export const updateProfileAPI = async (userId, payload) => {
    try {
        const res = await axiosClient.patch(`/api/users/${userId}`, payload);
        const data = res.data;
        if (data.message === "Updated successfully." || res.status === 200) {
            return { success: true, data };
        }
        return { success: false };
    } catch (error) {
        console.error("updateProfileAPI error:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

/**
 * PATCH the user's address list.
 * @param {string} userId          - session user id
 * @param {Array}  addressPayload  - array of address objects
 * @returns {{ success: boolean, updatedAddresses?: Array, error?: string }}
 */
export const saveAddressAPI = async (userId, addressPayload) => {
    try {
        const res = await axiosClient.patch(`/api/users/${userId}`, { addresses: addressPayload });
        const data = res.data;
        if (res.status === 200 || data.message?.toLowerCase().includes("updated")) {
            const updatedAddresses =
                data.doc?.saved_addresses || data.saved_addresses || addressPayload;
            return { success: true, updatedAddresses };
        }
        return { success: false };
    } catch (error) {
        console.error("saveAddressAPI error:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

/**
 * DELETE a single address by ID.
 * @param {string} userId    - session user id
 * @param {string} addressId - the id of the address to remove
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteAddressAPI = async (userId, addressId) => {
    try {
        const res = await axiosClient.delete(`/api/users/${userId}`, {
            data: { addressId },
        });
        console.log("deleteAddressAPI response:", res.data);
        return { success: true };
    } catch (error) {
        console.error("deleteAddressAPI error:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

/**
 * GET account status before showing the delete-account popup.
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export const checkDeleteAccountAPI = async () => {
    try {
        const res = await fetch("/api/website/profile/delete", { method: "GET" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to check account status");
        return { success: true, data };
    } catch (error) {
        console.error("checkDeleteAccountAPI error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * POST to permanently delete the account.
 * @returns {{ success: boolean, error?: string }}
 */
export const confirmDeleteAccountAPI = async () => {
    try {
        const res = await fetch("/api/website/profile/delete/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete account");
        return { success: true, data };
    } catch (error) {
        console.error("confirmDeleteAccountAPI error:", error);
        return { success: false, error: error.message };
    }
};
