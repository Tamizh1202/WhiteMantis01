import React, { useState, useEffect, useRef } from "react";
import styles from "../Lisiting.module.css";

const SubscriptionPopup = ({
  showSubscribePopup,
  setShowSubscribePopup,
  selectedProduct,
  setSelectedProduct,
  selectedFrequency,
  setSelectedFrequency,
  selectedQuantity,
  setSelectedQuantity,
  selectedHighlights,
  setSelectedHighlights,
  handleSubscriptionCheckout,
  getFrequencyLabel,
  items,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [weightOpen, setWeightOpen] = useState(false);
  const [freqOpen, setFreqOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);

  const weightRef = useRef(null);
  const bagRef = useRef(null);
  const freqRef = useRef(null);
  const modalRef = useRef(null);
  const dropdownRefs = useRef({});

  const closeAll = () => {
    setWeightOpen(false);
    setActiveDropdown(null);
    setBagOpen(false);
    setFreqOpen(false);
  };

  useEffect(() => {
    if (showSubscribePopup) {
      closeAll();
    }
  }, [showSubscribePopup, selectedProduct]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (weightRef.current && !weightRef.current.contains(e.target))
        setWeightOpen(false);
      if (activeDropdown && dropdownRefs.current[activeDropdown] && !dropdownRefs.current[activeDropdown].contains(e.target))
        setActiveDropdown(null);
      if (bagRef.current && !bagRef.current.contains(e.target))
        setBagOpen(false);
      if (freqRef.current && !freqRef.current.contains(e.target))
        setFreqOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!showSubscribePopup || !selectedProduct) return null;

  const variants = selectedProduct.parent?.hasVariantOptions
    ? selectedProduct.parent.variants
    : [];

  const currentVariant = selectedProduct.variant;
  const weightLabel = currentVariant
    ? `${currentVariant.variantName}g`
    : "Select Weight";

  const bagAmounts = [2, 3, 4];
  const bagLabel =
    selectedQuantity ? `${selectedQuantity} Bags` : "Select Bag Amount";

  const freqs = selectedProduct.subFreqs || [];
  const freqLabel = selectedFrequency
    ? getFrequencyLabel(selectedFrequency)
    : "Select Frequency";

  const discount = selectedProduct.discount || 0;
  const price = currentVariant
    ? currentVariant.variantSalePrice || currentVariant.variantRegularPrice
    : "";

  const displayPrice = price && selectedQuantity
    ? (parseFloat(price) * selectedQuantity * (1 - discount / 100)).toFixed(0)
    : "";

  const stockQuantity = currentVariant
    ? currentVariant.variantStockQuantity
    : selectedProduct.parent?.stockQuantity || 0;

  const currentCartQty = items?.find(
    (item) =>
      String(item.product) === String(selectedProduct.parent?.id) &&
      String(item.vId || "") === String(currentVariant?.id || "")
  )?.quantity || 0;


  return (
    <div
      className={styles.overlay}
      onClick={() => setShowSubscribePopup(false)}
    >
      <div
        className={styles.modal}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          onClick={() => setShowSubscribePopup(false)}
          aria-label="Close"
        >
          &#x2715;
        </button>

        <h2 className={styles.title}>
          {selectedProduct.parent?.name?.toUpperCase()} SUBSCRIPTION
        </h2>

        <div className={styles.row}>
          <div className={styles.fieldFull}>
            <label className={styles.label}>Weight</label>
            <div className={styles.dropdown} ref={weightRef}>
              <button
                className={`${styles.dropdownToggle} ${weightOpen ? styles.dropdownToggleOpen : ""}`}
                onClick={() => {
                  closeAll();
                  setWeightOpen(!weightOpen);
                }}
              >
                <span
                  className={
                    currentVariant
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {weightLabel}
                </span>
                <span
                  className={`${styles.chevron} ${weightOpen ? styles.chevronOpen : ""}`}
                />
              </button>
              {weightOpen && variants.length > 0 && (
                <ul className={styles.dropdownMenu}>
                  {variants.map((v) => (
                    <li
                      key={v.id}
                      className={`${styles.dropdownItem} ${currentVariant?.id === v.id ? styles.dropdownItemActive : ""}`}
                      onClick={() => {
                        setSelectedProduct({
                          ...selectedProduct,
                          variant: v,
                          discount: v.subscriptionDiscount || 0,
                          subFreqs: v.subFreq || [],
                        });
                        setWeightOpen(false);
                      }}
                    >
                      {v.variantName}g
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Product Highlights - Grouped in pairs */}
        {selectedProduct.parent?.productHighlights?.reduce((acc, section, idx, arr) => {
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
                      const isOpen = activeDropdown === section.sectionTitle;
                      closeAll();
                      if (!isOpen) setActiveDropdown(section.sectionTitle);
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

        {/* Row 3: Bag Amount + Frequency */}
        <div className={styles.row}>
          <div className={styles.fieldHalf}>
            <label className={styles.label}>Bag Amount</label>
            <div className={styles.dropdown} ref={bagRef}>
              <button
                className={`${styles.dropdownToggle} ${bagOpen ? styles.dropdownToggleOpen : ""}`}
                onClick={() => {
                  closeAll();
                  setBagOpen(!bagOpen);
                }}
              >
                <span
                  className={
                    selectedQuantity
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {bagLabel}
                </span>
                <span
                  className={`${styles.chevron} ${bagOpen ? styles.chevronOpen : ""}`}
                />
              </button>
              {bagOpen && (
                <ul className={styles.dropdownMenu}>
                  {bagAmounts.map((qty) => (
                    <li
                      key={qty}
                      className={`${styles.dropdownItem} ${selectedQuantity === qty ? styles.dropdownItemActive : ""}`}
                      onClick={() => {
                        setSelectedQuantity(qty);
                        setBagOpen(false);
                      }}
                    >
                      {qty} Bags
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.fieldHalf}>
            <label className={styles.label}>Frequency</label>
            <div className={styles.dropdown} ref={freqRef}>
              <button
                className={`${styles.dropdownToggle} ${freqOpen ? styles.dropdownToggleOpen : ""}`}
                onClick={() => {
                  closeAll();
                  setFreqOpen(!freqOpen);
                }}
              >
                <span
                  className={
                    selectedFrequency
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {freqLabel}
                </span>
                <span
                  className={`${styles.chevron} ${freqOpen ? styles.chevronOpen : ""}`}
                />
              </button>
              {freqOpen && freqs.length > 0 && (
                <ul className={styles.dropdownMenu}>
                  {freqs.map((freq, idx) => (
                    <li
                      key={idx}
                      className={`${styles.dropdownItem} ${selectedFrequency === freq ? styles.dropdownItemActive : ""}`}
                      onClick={() => {
                        setSelectedFrequency(freq);
                        setFreqOpen(false);
                      }}
                    >
                      {getFrequencyLabel(freq)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <button
          className={styles.subscribeBtn}
          onClick={handleSubscriptionCheckout}
        >
          Subscribe - AED {displayPrice} (Save Approx. {discount}%)
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPopup;