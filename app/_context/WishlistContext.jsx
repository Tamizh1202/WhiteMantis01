"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/api/wishlist");
      setItems(data.wishlist?.items || data.items || []);
    } catch (e) {
      console.error("Error refreshing wishlist:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") refresh();
    else if (status === "unauthenticated") {
      setItems([]);
      setLoading(false);
    }
  }, [status]);

  const add = async (productId) => {
    try {
      await axiosClient.post("/api/wishlist", { productId, origin: "store" });
      await refresh();
    } catch (e) {
      console.error("Error adding to wishlist:", e);
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      // Note: Not adding toast here as it's not present in original, but extracting message for potential future use or debugging
    }
  };

  const remove = async (productId) => {
    try {
      await axiosClient.delete("/api/wishlist", {
        data: { productId, origin: "store" },
      });
      await refresh();
    } catch (e) {
      console.error("Error removing from wishlist:", e);
    }
  };

  const toggle = (productId) => {
    const exists = items.find((it) => {
      const itemProductId =
        it.product?.value?.id || it.product?.id || it.product;
      return String(itemProductId) === String(productId);
    });
    return exists ? remove(productId) : add(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, loading, add, remove, toggle, refresh }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext) || {};
