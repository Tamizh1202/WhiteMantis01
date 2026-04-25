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
  handleSubscriptionCheckout,
  getFrequencyLabel,
}) => {
  const [weightOpen, setWeightOpen] = useState(false);
  const [roastOpen, setRoastOpen] = useState(false);
  const [grindOpen, setGrindOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [freqOpen, setFreqOpen] = useState(false);

  const [roastProfile, setRoastProfile] = useState("");
  const [grindOption, setGrindOption] = useState("");
  const [quantity, setQuantity] = useState(1);

  const weightRef = useRef(null);
  const roastRef = useRef(null);
  const grindRef = useRef(null);
  const bagRef = useRef(null);
  const freqRef = useRef(null);
  const modalRef = useRef(null);

  const closeAll = () => {
    setWeightOpen(false);
    setRoastOpen(false);
    setGrindOpen(false);
    setBagOpen(false);
    setFreqOpen(false);
  };

  useEffect(() => {
    if (showSubscribePopup) {
      setQuantity(1);
      setRoastProfile("");
      setGrindOption("");
      closeAll();
    }
  }, [showSubscribePopup, selectedProduct]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (weightRef.current && !weightRef.current.contains(e.target))
        setWeightOpen(false);
      if (roastRef.current && !roastRef.current.contains(e.target))
        setRoastOpen(false);
      if (grindRef.current && !grindRef.current.contains(e.target))
        setGrindOpen(false);
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

  const displayPrice = price && quantity
    ? (parseFloat(price) * quantity * (1 - discount / 100)).toFixed(0)
    : "";

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

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

        <h2 className={styles.title}>COFFEE BEANS SUBSCRIPTION</h2>

        {/* Row 1: Weight + Quantity */}
        <div className={styles.row}>
          <div className={styles.fieldHalf}>
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
                  closeAll();
                  setRoastOpen(!roastOpen);
                }}
              >
                <span
                  className={
                    roastProfile
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {roastProfile || "Select Roast Profile"}
                </span>
                <span
                  className={`${styles.chevron} ${roastOpen ? styles.chevronOpen : ""}`}
                />
              </button>
              {roastOpen && (
                <ul className={styles.dropdownMenu}>
                  {["Light", "Medium", "Dark"].map((opt) => (
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
                  closeAll();
                  setGrindOpen(!grindOpen);
                }}
              >
                <span
                  className={
                    grindOption
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {grindOption || "Select Grind Option"}
                </span>
                <span
                  className={`${styles.chevron} ${grindOpen ? styles.chevronOpen : ""}`}
                />
              </button>
              {grindOpen && (
                <ul className={styles.dropdownMenu}>
                  {["Whole Bean", "Fine", "Medium", "Coarse"].map((opt) => (
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