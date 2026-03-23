"use client";
import React, { useState } from "react";
import { useCart } from "@/app/_context/CartContext";

const AddToCart = ({ product, onSuccess }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (loading) return;

    // Check if product prop is provided
    if (!product) {
      console.error("Product prop is required for AddToCart component");
      return;
    }

    setLoading(true);
    try {
      await addToCart(
        product.productId,
        product.quantity || 1,
        product.variationId,
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Add to cart error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      style={{
        width: "100%",
        boxSizing: "border-box", // <--- ADD THIS LINE
        backgroundColor: "#6C7A5F",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 500,
        border: "none",
        padding: "12px 22px",
        whiteSpace: "nowrap",
        cursor: loading ? "wait" : "pointer",
        transition: "background-color 0.2s ease",
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) e.target.style.backgroundColor = "#5f6f57";
      }}
      onMouseLeave={(e) => {
        if (!loading) e.target.style.backgroundColor = "#6C7A5F";
      }}
    >
      {loading ? "Adding..." : "Add to Bag"}
    </button>
  );
};

export default AddToCart;
