"use client";
import styles from "../page.module.css";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    PaymentElement
} from "@stripe/react-stripe-js";
import { stripeElementStyle } from "./stripeStyles.js";
import Link from "next/link";

export default function PaymentSection({ validationErrors, isProcessing, handlePayment }) {
    return (
        <div className={styles.Five}>
            <h3>PAYMENT</h3>
            <p>All transactions are secure and encrypted.</p>

            <div className={styles.PaymentContainer}>
                <div className={styles.PaymentHeader}>
                    <p>Credit Card</p>
                </div>
                <div className={styles.PaymentBody}>
                    <div className={styles.StripeInput}>
                        <CardNumberElement options={{ ...stripeElementStyle, disableLink: true }} />
                    </div>

                    <div className={styles.Row}>
                        <div className={styles.StripeInput}>
                            <CardExpiryElement options={stripeElementStyle} />
                        </div>
                        <div className={styles.StripeInput}>
                            <CardCvcElement options={stripeElementStyle} />
                        </div>
                    </div>

                    {validationErrors.card && (
                        <span className={styles.ErrorMessage}>{validationErrors.card}</span>
                    )}
                </div>
            </div>

            {/* Pay Now Button + Footer Links */}
            <div className={styles.Six}>
                <button
                    className={styles.Pay}
                    onClick={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Pay Now"}
                </button>

                <div className={styles.PageLinks}>
                    <p>Refund policy</p>
                    <p>Shipping</p>
                    <Link href="/privacy-policy"><p>Privacy policy</p></Link>
                    <p>Terms of service</p>
                    <p>Cancellations</p>
                    <Link href="/contact"><p>Contact</p></Link>
                </div>
            </div>
        </div>
    );
}
