"use client";
import { useState } from "react";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";
import styles from "../page.module.css";

export default function ExpressCheckoutSection() {
    const [isAvailable, setIsAvailable] = useState(false);

    return (
        <div className={styles.One} style={!isAvailable ? { display: "none" } : {}}>
            <p>Express Checkout</p>
            <ExpressCheckoutElement
                onConfirm={() => { }}
                onReady={({ availablePaymentMethods }) => {
                    // Only show the section if at least one express method is available
                    if (availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean)) {
                        setIsAvailable(true);
                    }
                }}
                onLoadError={() => {
                    // Silently suppress — no express methods available in this environment
                    setIsAvailable(false);
                }}
            />
        </div>
    );
}