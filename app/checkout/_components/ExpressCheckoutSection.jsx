"use client";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";
import styles from "../page.module.css";

export default function ExpressCheckoutSection() {
    return (
        <div className={styles.One}>
            <p>Express Checkout</p>
            <ExpressCheckoutElement />
        </div>
    );
}
