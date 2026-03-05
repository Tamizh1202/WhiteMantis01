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
import { addToCartToast } from "./_components/addToCartToast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, total: 0, discount: 0, totalItems: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session, status } = useSession();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    if (status === "loading") return;
    fetchCart();
  }, [session, status]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /** Apply a cart API response (items, subtotal, totalItems) to state */
  const applyCartResponse = (data) => {
    setItems(data.items || []);
    setCartTotals({
      subtotal: data.subtotal || 0,
      total: data.subtotal || 0,
      totalItems: data.totalItems || 0,
    });
  };

  /** Apply the local guest cart to state */
  const applyGuestCart = () => {
    const cart = getCart();
    setItems(cart.items || []);
    setCartTotals({
      subtotal: cart.subtotal || 0,
      total: cart.subtotal || 0,
      discount: 0,
      totalItems: cart.totalItems || 0,
    });
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
          (i) => String(i.product) === String(product) && (i.vId || "") === (vId || "")
        );
        if (added) {
          addToCartToast({ ...added, quantity }, openCart);
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
      }
    } else {
      try {
        await addItemToCart(product, quantity, vId);
        const cart = getCart();
        applyGuestCart();
        // Show toast with the item from the refreshed guest cart
        const added = (cart.items || []).find(
          (i) => String(i.product) === String(product) && (i.vId || null) === (vId || null)
        );
        if (added) {
          addToCartToast({ ...added, quantity }, openCart);
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
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
      } catch (e) {
        console.error("Error updating cart quantity:", e);
      }
    } else {
      // For guest: resolve new quantity from action or direct value
      const cart = getCart();
      const existing = cart.items?.find(
        (i) => String(i.product) === String(product) && (i.vId || null) === (vId || null)
      );
      if (existing) {
        let newQty = existing.quantity;
        if (action === "increment") newQty = Math.min(5, existing.quantity + 1);
        else if (action === "decrement") newQty = Math.max(1, existing.quantity - 1);
        else if (typeof quantity === "number") newQty = Math.min(5, Math.max(1, quantity));
        updateItemQuantity(product, vId, newQty);
      }
      applyGuestCart();
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
