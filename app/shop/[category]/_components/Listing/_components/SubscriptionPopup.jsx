import React from "react";

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
    popupRef,
    styles,
}) => {
    if (!showSubscribePopup || !selectedProduct) return null;

    return (
        <div className={styles.PopupOverlay}>
            <div className={styles.Popup} ref={popupRef}>
                <button
                    className={styles.PopupClose}
                    onClick={() => setShowSubscribePopup(false)}
                    aria-label="Close"
                >
                    ✕
                </button>

                <h3>SUBSCRIPTION OPTIONS</h3>

                {/* Bag Amount (Quantity) Selection */}
                <div className={styles.SubscriptionSection}>
                    <h4>Bag Amount</h4>
                    <div className={styles.FrequencyOptions}>
                        {[2, 3, 4].map((qty) => (
                            <button
                                key={qty}
                                className={
                                    selectedQuantity === qty
                                        ? styles.ActiveFrequency
                                        : styles.FrequencyBtn
                                }
                                onClick={() => setSelectedQuantity(qty)}
                            >
                                {qty}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Variant Selection (e.g. Size/Bag Amount if they are variants) */}
                {selectedProduct.parent.hasVariantOptions && (
                    <div className={styles.SubscriptionSection}>
                        <h4>Selection</h4>
                        <div className={styles.FrequencyOptions}>
                            {selectedProduct.parent.variants.map((v) => (
                                <button
                                    key={v.id}
                                    className={
                                        selectedProduct.variant?.id === v.id
                                            ? styles.ActiveFrequency
                                            : styles.FrequencyBtn
                                    }
                                    onClick={() =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            variant: v,
                                            discount: v.subscriptionDiscount || 0,
                                            subFreqs: v.subFreq || [],
                                        })
                                    }
                                >
                                    {v.variantName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.SubscriptionSection}>
                    <h4>Frequency</h4>
                    <div className={styles.FrequencyOptions}>
                        {selectedProduct.subFreqs?.map((freq, idx) => (
                            <button
                                key={idx}
                                className={
                                    selectedFrequency === freq
                                        ? styles.ActiveFrequency
                                        : styles.FrequencyBtn
                                }
                                onClick={() => setSelectedFrequency(freq)}
                            >
                                {getFrequencyLabel(freq)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.PopupActions}>
                    <button
                        onClick={handleSubscriptionCheckout}
                        className={styles.PopupConfirm}
                    >
                        Subscribe – Save {selectedProduct.discount}%
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPopup;
