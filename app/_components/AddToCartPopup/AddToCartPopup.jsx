import { useState, useEffect, useRef } from "react";
import styles from "./AddToCartPopup.module.css";
import { useCart } from "@/app/_context/CartContext";
import { getSortedVariants } from "@/app/_utils/productVariants";

export default function AddToCartPopup({
  onClose,
  showCartPopup,
  selectedProduct,
  initialVariant = null,
  initialQuantity = 1,
  initialHighlights = null,
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedHighlights, setSelectedHighlights] = useState({});
  const [qtyError, setQtyError] = useState("");
  const { addToCart, items } = useCart();

  const [weightOpen, setWeightOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which highlight dropdown is open

  const weightRef = useRef(null);
  const dropdownRefs = useRef({});

  const sortedVariants = selectedProduct
    ? getSortedVariants(selectedProduct)
    : [];

  useEffect(() => {
    if (showCartPopup) {
      setSelectedVariant(initialVariant || (sortedVariants.length > 0 ? sortedVariants[0] : null));
      setQuantity(initialQuantity || 1);

      if (initialHighlights) {
        setSelectedHighlights(initialHighlights);
      } else {
        const initial = {};
        selectedProduct?.productHighlights?.forEach((section) => {
          if (section.items?.length > 0) {
            initial[section.sectionTitle] = section.items[0].point;
          }
        });
        setSelectedHighlights(initial);
      }
      setActiveDropdown(null);
    }
  }, [showCartPopup, selectedProduct]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (weightRef.current && !weightRef.current.contains(e.target)) {
        setWeightOpen(false);
      }

      // Check highlight dropdowns
      if (activeDropdown && dropdownRefs.current[activeDropdown] && !dropdownRefs.current[activeDropdown].contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  if (!showCartPopup || !selectedProduct) return null;

  const name = selectedProduct.name || "Product Name";
  const tagline = selectedProduct.tagline || "";
  const displayPrice = selectedVariant
    ? selectedVariant.variantSalePrice || selectedVariant.variantRegularPrice
    : selectedProduct.salePrice || selectedProduct.regularPrice || "0";

  const stockQuantity = selectedVariant
    ? selectedVariant.variantStockQuantity
    : selectedProduct.stockQuantity || 0;

  const currentCartQty = items?.find(
    (item) =>
      String(item.product) === String(selectedProduct.id) &&
      (String(item.vId || "") === String(selectedVariant?.id || ""))
  )?.quantity || 0;

  const increment = () => {
    const maxAllowed = Math.min(5, stockQuantity - currentCartQty);
    if (quantity < maxAllowed) {
      setQuantity((q) => q + 1);
      setQtyError("");
    } else {
      if (quantity + currentCartQty >= stockQuantity) {
        setQtyError("Stock limit reached");
      }
    }
  };
  const decrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
    setQtyError("");
  };

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const productId = selectedProduct.id;
      const variationId = selectedVariant?.id || "";

      const highlightsPayload = Object.entries(selectedHighlights).map(([title, point]) => ({
        sectionTitle: title,
        items: [{ point }],
      }));

      await addToCart(productId, quantity, variationId, highlightsPayload);
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
                  setActiveDropdown(null);
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
              <button
                className={styles.qtyBtn}
                onClick={increment}
                disabled={quantity >= 5 || quantity + currentCartQty >= stockQuantity}
              >
                &#x2B;
              </button>
            </div>
            {qtyError && <p style={{ color: "#c0392b", fontSize: "12px", marginTop: "4px", fontFamily: "var(--lato)" }}>{qtyError}</p>}
          </div>
        </div>
        {/* Dynamic Product Highlights - Grouped in pairs */}
        {selectedProduct.productHighlights?.reduce((acc, section, idx, arr) => {
          if (idx % 2 === 0) {
            acc.push(arr.slice(idx, idx + 2));
          }
          return acc;
        }, []).map((pair, rowIdx) => (
          <div className={styles.row} key={rowIdx}>
            {pair.map((section) => (
              <div className={styles.fieldHalf} key={section.sectionTitle}>
                <label className={styles.label}>{section.sectionTitle}</label>
                <div
                  className={styles.dropdown}
                  ref={(el) => (dropdownRefs.current[section.sectionTitle] = el)}
                >
                  <button
                    className={`${styles.dropdownToggle} ${activeDropdown === section.sectionTitle ? styles.dropdownToggleOpen : ""}`}
                    onClick={() => {
                      setActiveDropdown(activeDropdown === section.sectionTitle ? null : section.sectionTitle);
                      setWeightOpen(false);
                    }}
                  >
                    <span className={selectedHighlights[section.sectionTitle] ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                      {selectedHighlights[section.sectionTitle] || `Select ${section.sectionTitle}`}
                    </span>
                    <span className={`${styles.chevron} ${activeDropdown === section.sectionTitle ? styles.chevronOpen : ""}`} />
                  </button>
                  {activeDropdown === section.sectionTitle && (
                    <ul className={styles.dropdownMenu}>
                      {section.items?.map((item) => (
                        <li
                          key={item.point}
                          className={`${styles.dropdownItem} ${selectedHighlights[section.sectionTitle] === item.point ? styles.dropdownItemActive : ""}`}
                          onClick={() => {
                            setSelectedHighlights(prev => ({
                              ...prev,
                              [section.sectionTitle]: item.point
                            }));
                            setActiveDropdown(null);
                          }}
                        >
                          {item.point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}


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