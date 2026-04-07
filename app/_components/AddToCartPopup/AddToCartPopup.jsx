import { useState, useEffect } from "react";
import styles from "./AddToCartPopup.module.css";
import { useCart } from "@/app/_context/CartContext";
import { getSortedVariants } from "@/app/_utils/productVariants";

export default function AddToCartPopup({
  onClose,
  showCartPopup,
  selectedProduct,
}) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const sortedVariants = selectedProduct
    ? getSortedVariants(selectedProduct)
    : [];

  useEffect(() => {
    if (showCartPopup && sortedVariants.length > 0) {
      setSelectedVariant(sortedVariants[0]);
      setQuantity(1);
    }
  }, [showCartPopup, selectedProduct]);

  if (!showCartPopup || !selectedProduct) return null;

  const name = selectedProduct.name || "Product Name";
  const tagline = selectedProduct.tagline || "";
  const displayPrice = selectedVariant
    ? selectedVariant.variantSalePrice || selectedVariant.variantRegularPrice
    : selectedProduct.salePrice || selectedProduct.regularPrice || "0";

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const productId = selectedProduct.id;
      const variationId = selectedVariant?.id || "";
      await addToCart(productId, quantity, variationId);
      onClose();
    } catch (err) {
      console.error("Popup Add to cart error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          &#x2715;
        </button>
        <h2 className={styles.title}>
          {name} {tagline}
        </h2>
        <p className={styles.price}>AED {displayPrice}</p>

        <div className={styles.section}>
          <label className={styles.label}>Weight</label>
          <div className={styles.weightOptions}>
            {sortedVariants.map((v) => (
              <button
                key={v.id}
                className={`${styles.weightBtn} ${selectedVariant?.id === v.id ? styles.weightBtnActive : ""} ${!v.variantInStock ? styles.outOfStock : ""}`}
                onClick={() => setSelectedVariant(v)}
              >
                <div className={styles.weightInfo}>
                  <span>
                    {v.variantName}
                    {isNaN(v.variantName) ? "" : "g"}
                  </span>
                  {!v.variantInStock && (
                    <span className={styles.stockLabel}>Out of Stock</span>
                  )}
                </div>
                <span
                  className={`${styles.radio} ${selectedVariant?.id === v.id ? styles.radioActive : ""}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Quantity</label>
          <div className={styles.quantityControl}>
            <button className={styles.qtyBtn} onClick={decrement}>
              &#x2212;
            </button>
            <span className={styles.qtyValue}>
              {String(quantity).padStart(2, "0")}
            </span>
            <button className={styles.qtyBtn} onClick={increment}>
              &#x2B;
            </button>
          </div>
        </div>

        <button
          className={styles.addToCart}
          onClick={handleAddToCart}
          disabled={
            loading || (selectedVariant && !selectedVariant.variantInStock)
          }
        >
          {loading
            ? "Adding..."
            : selectedVariant && !selectedVariant.variantInStock
              ? "Out of Stock"
              : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
