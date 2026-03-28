"use client";
import React, { useState } from "react";
import { useWishlist } from "../_context/WishlistContext";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Wishlist = ({ product }) => {
  const { items = [], toggle } = useWishlist();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  // Check if product is already in wishlist
  const isInWishlist = product
    ? items.some((it) => {
        const itemProductId =
          it.product?.value?.id || it.product?.id || it.product;
        return String(itemProductId) === String(product.id);
      })
    : false;

  const handleToggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (loading) return;

    // Check if product prop is provided
    if (!product) {
      console.error("Product prop is required for Wishlist component");
      return;
    }

    // Prevent guests from calling the wishlist API
    if (status !== "authenticated") {
      toast.error("Login to add to wishlist");
      return "Login to add to wishlist";
    }

    setLoading(true);
    try {
      await toggle(product.id);
    } catch (err) {
      console.error("Wishlist toggle error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        width: "clamp(25px, 5vw, 35px)",
        height: "clamp(25px, 5vw, 35px)",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1,
        position: "relative",
        zIndex: 10,
        background: "none",
        border: "none",
        padding: 0,
        display: "block",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular Background */}
        <rect
          x="2.25"
          y="2.25"
          width="30.625"
          height="30.625"
          rx="15.3125"
          fill="#E2E4DF"
        />
        {/* Heart Icon */}
        <path
          d="M16.3799 23.7139C14.2826 22.0849 10.125 18.3614 10.125 15.01C10.125 12.7958 11.6906 11 13.8438 11C14.9594 11 16.075 11.386 17.5625 12.9301C19.05 11.386 20.1656 11 21.2812 11C23.4344 11 25 12.7958 25 15.01C25 18.3606 20.8424 22.0849 18.7451 23.7139C18.0385 24.262 17.0865 24.262 16.3799 23.7139Z"
          fill={isInWishlist ? "#E54842" : "#FFFFFF"}
          style={{
            transition: "fill 0.2s ease",
          }}
        />
      </svg>
    </button>
  );
};

export default Wishlist;
