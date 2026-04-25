import { useState, useEffect, useRef } from "react";
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
  const [roastProfile, setRoastProfile] = useState("");
  const [grindOption, setGrindOption] = useState("");

  const [weightOpen, setWeightOpen] = useState(false);
  const [roastOpen, setRoastOpen] = useState(false);
  const [grindOpen, setGrindOpen] = useState(false);

  const weightRef = useRef(null);
  const roastRef = useRef(null);
  const grindRef = useRef(null);

  const sortedVariants = selectedProduct
    ? getSortedVariants(selectedProduct)
    : [];

  useEffect(() => {
    if (showCartPopup && sortedVariants.length > 0) {
      setSelectedVariant(sortedVariants[0]);
      setQuantity(1);
      setRoastProfile("");
      setGrindOption("");
    }
  }, [showCartPopup, selectedProduct]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (weightRef.current && !weightRef.current.contains(e.target))
        setWeightOpen(false);
      if (roastRef.current && !roastRef.current.contains(e.target))
        setRoastOpen(false);
      if (grindRef.current && !grindRef.current.contains(e.target))
        setGrindOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const weightLabel = selectedVariant
    ? `${selectedVariant.variantName}${isNaN(selectedVariant.variantName) ? "" : "g"}`
    : "Select Weight";

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

        {/* Row 1: Weight + Quantity */}
        <div className={styles.row}>
          <div className={styles.fieldHalf}>
            <label className={styles.label}>Weight</label>
            <div className={styles.dropdown} ref={weightRef}>
              <button
                className={`${styles.dropdownToggle} ${weightOpen ? styles.dropdownToggleOpen : ""}`}
                onClick={() => {
                  setWeightOpen(!weightOpen);
                  setRoastOpen(false);
                  setGrindOpen(false);
                }}
              >
                <span className={selectedVariant ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {weightLabel}
                </span>
                <span className={`${styles.chevron} ${weightOpen ? styles.chevronOpen : ""}`} />
              </button>
              {weightOpen && (
                <ul className={styles.dropdownMenu}>
                  {sortedVariants.map((v) => (
                    <li
                      key={v.id}
                      className={`${styles.dropdownItem} ${selectedVariant?.id === v.id ? styles.dropdownItemActive : ""} ${!v.variantInStock ? styles.dropdownItemDisabled : ""}`}
                      onClick={() => {
                        if (v.variantInStock) {
                          setSelectedVariant(v);
                          setWeightOpen(false);
                        }
                      }}
                    >
                      {v.variantName}
                      {isNaN(v.variantName) ? "" : "g"}
                      {!v.variantInStock ? " — Out of Stock" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.fieldHalf}>
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
        </div>

        {/* Row 2: Roast Profile + Grind Option */}
        <div className={styles.row}>
          <div className={styles.fieldHalf}>
            <label className={styles.label}>Roast Profile</label>
            <div className={styles.dropdown} ref={roastRef}>
              <button
                className={`${styles.dropdownToggle} ${roastOpen ? styles.dropdownToggleOpen : ""}`}
                onClick={() => {
                  setRoastOpen(!roastOpen);
                  setWeightOpen(false);
                  setGrindOpen(false);
                }}
              >
                <span className={roastProfile ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {roastProfile || "Select Roast Profile"}
                </span>
                <span className={`${styles.chevron} ${roastOpen ? styles.chevronOpen : ""}`} />
              </button>
              {roastOpen && (
                <ul className={styles.dropdownMenu}>
                  {["Expresso Roast", "Filter Roast"].map((opt) => (
                    <li
                      key={opt}
                      className={`${styles.dropdownItem} ${roastProfile === opt ? styles.dropdownItemActive : ""}`}
                      onClick={() => {
                        setRoastProfile(opt);
                        setRoastOpen(false);
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.fieldHalf}>
            <label className={styles.label}>Grind Option</label>
            <div className={styles.dropdown} ref={grindRef}>
              <button
                className={`${styles.dropdownToggle} ${grindOpen ? styles.dropdownToggleOpen : ""}`}
                onClick={() => {
                  setGrindOpen(!grindOpen);
                  setWeightOpen(false);
                  setRoastOpen(false);
                }}
              >
                <span className={grindOption ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {grindOption || "Select Grind Option"}
                </span>
                <span className={`${styles.chevron} ${grindOpen ? styles.chevronOpen : ""}`} />
              </button>
              {grindOpen && (
                <ul className={styles.dropdownMenu}>
                  {["Whole Bean", "Filter Grind", "Expresso Grind"].map((opt) => (
                    <li
                      key={opt}
                      className={`${styles.dropdownItem} ${grindOption === opt ? styles.dropdownItemActive : ""}`}
                      onClick={() => {
                        setGrindOption(opt);
                        setGrindOpen(false);
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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