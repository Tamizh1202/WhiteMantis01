"use client";

import React, { createContext, useContext, useState } from "react";

const ProductImageContext = createContext();

export const ProductImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  return (
    <ProductImageContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        selectedVariant,
        setSelectedVariant,
      }}
    >
      {children}
    </ProductImageContext.Provider>
  );
};

export const useProductImage = () => useContext(ProductImageContext);
