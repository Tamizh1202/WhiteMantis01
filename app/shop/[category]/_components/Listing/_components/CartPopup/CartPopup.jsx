import { useState } from "react";
import styles from "./CartPopup.module.css";

export default function ProductPopup({ onClose, showCartPopup, selectedProduct }) {
  const [selectedWeight, setSelectedWeight] = useState("250g");
  const [quantity, setQuantity] = useState(1);

  // 1. Critical: If the parent says don't show, return null
  if (!showCartPopup) return null;

  const weights = [
    { label: "250 grams", value: "250g" },
    { label: "1 Kg", value: "1kg" },
  ];

  // 2. Use data from the product passed in, with fallbacks
  const name = selectedProduct?.name || "Product Name";
  const price = selectedProduct?.salePrice || selectedProduct?.regularPrice || "0";

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* 3. stopPropagation prevents the modal click from closing itself via the overlay */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button 
          className={styles.closeBtn} 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          aria-label="Close"
        >
          &#x2715;
        </button>

        <h2 className={styles.title}>{name}</h2>
        <p className={styles.price}>AED {price}</p>

        <div className={styles.section}>
          <label className={styles.label}>Weight</label>
          <div className={styles.weightOptions}>
            {weights.map((w) => (
              <button
                key={w.value}
                className={`${styles.weightBtn} ${selectedWeight === w.value ? styles.weightBtnActive : ""}`}
                onClick={() => setSelectedWeight(w.value)}
              >
                <span>{w.label}</span>
                <span className={`${styles.radio} ${selectedWeight === w.value ? styles.radioActive : ""}`} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Quantity</label>
          <div className={styles.quantityControl}>
            <button className={styles.qtyBtn} onClick={decrement}>&#x2212;</button>
            <span className={styles.qtyValue}>{String(quantity).padStart(2, "0")}</span>
            <button className={styles.qtyBtn} onClick={increment}>&#x2B;</button>
          </div>
        </div>

        <button className={styles.addToCart} onClick={() => console.log("Added to cart:", name)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}