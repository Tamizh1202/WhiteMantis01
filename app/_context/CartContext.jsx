"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from "@/utils/guestCartUtils";
import axiosClient from "@/lib/axios";
import toast from "react-hot-toast";
import { addToCartToast } from "./_components/addToCartToast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    total: 0,
    discount: 0,
    totalItems: 0,
    beansDiscount: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBeansApplied, setIsBeansApplied] = useState(false);
  const [beansBalance, setBeansBalance] = useState(0);
  const [coinConfig, setCoinConfig] = useState({
    pointsEarn: 5,
    pointsToAed: 10,
    maxPointsPerOrder: 0,
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { data: session, status } = useSession();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCouponModal = () => setIsCouponModalOpen(true);
  const closeCouponModal = () => setIsCouponModalOpen(false);

  const toggleBeans = () => setIsBeansApplied(!isBeansApplied);

  const applyCoupon = async (code) => {
    try {
      const res = await axiosClient.get(`/api/coupon/coupons/${code}`);
      const data = res.data;

      console.log("Coupon Data:", data);

      const coupon = data.coupon || data.docs?.[0];

      if (coupon && (data.success || !data.message)) {
        // Validation: Minimum Amount
        const minAmount = Number(coupon.minimumAmount || 0);
        if (minAmount > 0 && cartTotals.subtotal < minAmount) {
          return {
            ok: false,
            message: `Minimum amount of AED ${minAmount} required`,
          };
        }

        let discountVal = 0;
        if (coupon.discountType === "percentage") {
          discountVal =
            cartTotals.subtotal * (Number(coupon.discountAmount) / 100);
        } else {
          discountVal = Number(coupon.discountAmount);
        }

        setAppliedCoupon({
          code: coupon.code,
          discount: discountVal,
          type: coupon.discountType,
          amount: coupon.discountAmount,
        });

        setCartTotals((prev) => ({
          ...prev,
          discount: discountVal,
          total: prev.subtotal - discountVal,
        }));
        return { ok: true, message: "Coupon applied!" };
      }
      return { ok: false, message: data.message || "Invalid coupon code" };
    } catch (e) {
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      return {
        ok: false,
        message: backendMsg || e.message || "Failed to apply coupon",
      };
    }
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      setCartTotals((prev) => ({
        ...prev,
        discount: 0,
        total: prev.subtotal,
      }));
      setAppliedCoupon(null);
    }
  };

  // Fetch Loyalty Config & Balance
  const fetchLoyaltyData = async () => {
    if (status !== "authenticated") return;
    try {
      const [balanceRes, configRes] = await Promise.all([
        axiosClient.get("/api/user-wt-coins"),
        axiosClient.get("/api/globals/wt-coins"),
      ]);

      console.log(balanceRes);

      if (balanceRes.data.docs?.[0]) {
        setBeansBalance(balanceRes?.data?.docs?.[0]?.totalBalance || 0);
      }

      if (configRes.data) {
        setCoinConfig({
          pointsEarn: configRes.data.pointsEarn || 5,
          pointsToAed: configRes.data.pointsToAed || 10,
          maxPointsPerOrder: configRes.data.maxPointsPerOrder || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, [session, status]);

  useEffect(() => {
    let coinsDiscount = 0;
    if (isBeansApplied && beansBalance > 0) {
      // Redemption Logic: discountAED = pointsUsed / pointsToAed
      // For now, assuming user uses all available or max allowed
      const maxPossibleDiscount = cartTotals.subtotal * 0.2; // Example 20% cap
      const balanceInAed = beansBalance / coinConfig.pointsToAed;
      coinsDiscount = Math.min(maxPossibleDiscount, balanceInAed);
    }

    setCartTotals((prev) => ({
      ...prev,
      beansDiscount: coinsDiscount,
      total: Math.max(
        0,
        prev.subtotal -
          (prev.discount || 0) +
          (prev.shipping || 0) +
          (prev.tax || 0) -
          coinsDiscount,
      ),
    }));
  }, [
    isBeansApplied,
    cartTotals.subtotal,
    cartTotals.discount,
    cartTotals.shipping,
    cartTotals.tax,
    beansBalance,
    coinConfig,
  ]);

  useEffect(() => {
    if (status === "loading") return;
    fetchCart();
  }, [session, status]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /** Apply a cart API response (items, subtotal, totalItems) to state */
  const applyCartResponse = (data) => {
    setItems(data.items || []);
    setCartTotals((prev) => ({
      ...prev,
      subtotal: data.subtotal || 0,
      totalItems: data.totalItems || 0,
    }));
  };

  /** Apply the local guest cart to state */
  const applyGuestCart = () => {
    const cart = getCart();
    setItems(cart.items || []);
    setCartTotals((prev) => ({
      ...prev,
      subtotal: cart.subtotal || 0,
      discount: 0,
      totalItems: cart.totalItems || 0,
    }));
  };

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (session?.user) {
        const res = await axiosClient.get("/api/website/cart");
        applyCartResponse(res.data);
      } else {
        applyGuestCart();
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Add ─────────────────────────────────────────────────────────────────────

  const addToCart = async (product, quantity = 1, vId) => {
    if (session?.user) {
      try {
        const res = await axiosClient.post("/api/website/cart", {
          product,
          quantity,
          vId: vId || "",
        });
        const data = res.data;
        applyCartResponse(data);
        // Show toast with the item that was just added/updated
        const added = (data.items || []).find(
          (i) =>
            String(i.product) === String(product) &&
            (i.vId || "") === (vId || ""),
        );
        if (added) {
          addToCartToast({ ...added, quantity }, openCart);
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
        const resData = e?.response?.data;
        const backendMsg =
          resData?.message || resData?.error || resData?.errors?.[0]?.message;
        toast.error(backendMsg || e?.message || "Failed to add item to cart");
      }
    } else {
      try {
        await addItemToCart(product, quantity, vId);
        const cart = getCart();
        applyGuestCart();
        // Show toast with the item from the refreshed guest cart
        const added = (cart.items || []).find(
          (i) =>
            String(i.product) === String(product) &&
            (i.vId || null) === (vId || null),
        );
        if (added) {
          addToCartToast({ ...added, quantity }, openCart);
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
        toast.error(e.message || "Failed to add item to cart");
      }
    }
  };

  // ─── Remove ──────────────────────────────────────────────────────────────────

  const removeItem = async (product, vId) => {
    if (session?.user) {
      try {
        const res = await axiosClient.delete("/api/website/cart", {
          data: { product, vId: vId || "" },
        });
        applyCartResponse(res.data);
      } catch (e) {
        console.error("Error removing from cart:", e);
      }
    } else {
      removeItemFromCart(product, vId);
      applyGuestCart();
    }
  };

  // ─── Update Quantity ─────────────────────────────────────────────────────────
  // action: 'increment' | 'decrement' | null (pass quantity directly)

  const updateQuantity = async (product, vId, quantity, action) => {
    if (session?.user) {
      try {
        const res = await axiosClient.patch("/api/website/cart", {
          product,
          vId: vId || "",
          quantity,
          action,
        });
        applyCartResponse(res.data);
        return { ok: true };
      } catch (e) {
        console.error("Error updating cart quantity:", e);
        const resData = e?.response?.data;
        const backendMsg =
          resData?.message || resData?.error || resData?.errors?.[0]?.message;
        const message = backendMsg || e?.message || "Failed to update quantity";
        return { ok: false, message };
      }
    } else {
      // For guest: resolve new quantity from action or direct value
      try {
        const cart = getCart();
        const existing = cart.items?.find(
          (i) =>
            String(i.product) === String(product) &&
            (i.vId || null) === (vId || null),
        );
        if (existing) {
          let newQty = existing.quantity;
          if (action === "increment") newQty = existing.quantity + 1;
          else if (action === "decrement")
            newQty = Math.max(1, existing.quantity - 1);
          else if (typeof quantity === "number") newQty = Math.max(1, quantity);

          updateItemQuantity(product, vId, newQty);
        }
        applyGuestCart();
        return { ok: true };
      } catch (e) {
        console.error("Error updating cart quantity:", e);
        return { ok: false, message: e.message || "Failed to update quantity" };
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        openCart,
        closeCart,
        isCartOpen,
        items,
        loading,
        setLoading,
        fetchCart,
        addToCart,
        removeItem,
        updateQuantity,
        cartTotals,
        isCouponModalOpen,
        openCouponModal,
        closeCouponModal,
        isBeansApplied,
        toggleBeans,
        beansBalance,
        coinConfig,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        refreshCart: () => fetchCart(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
