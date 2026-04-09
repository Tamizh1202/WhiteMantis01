"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./_context/AuthContext";
import { CartProvider } from "./_context/CartContext";
import { WishlistProvider } from "./_context/WishlistContext";
import SmoothScrollProvider from "./_providers/SmoothScrollProvider";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}