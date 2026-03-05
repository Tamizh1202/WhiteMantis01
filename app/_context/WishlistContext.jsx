"use client";
import { createContext, useContext, useEffect, useState } from 'react';
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
      const { data } = await axiosClient.get('/api/wishlist');
      setItems(data.wishlist?.items || data.items || []);
    } catch (e) {
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
    await axiosClient.post('/api/wishlist', { productId, origin: 'store' });
    await refresh();
  };

  const remove = async (productId) => {
    await axiosClient.delete('/api/wishlist', { data: { productId, origin: 'store' } });
    await refresh();
  };

  const toggle = (productId) => {
    const exists = items.find(it => {
      const itemProductId = it.product?.value?.id || it.product?.id || it.product;
      return String(itemProductId) === String(productId);
    });
    return exists ? remove(productId) : add(productId);
  };

  return (
    <WishlistContext.Provider value={{ items, loading, add, remove, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext) || {};
