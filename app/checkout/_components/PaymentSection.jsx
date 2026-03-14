"use client";
import styles from "../page.module.css";
import { PaymentElement } from "@stripe/react-stripe-js";
import Link from "next/link";

export function PaymentCardSection({ validationErrors }) {
    return (
        <div className={styles.Five}>
            <h3>PAYMENT</h3>
            <p>All transactions are secure and encrypted.</p>

            <div className={styles.PaymentContainer}>
                <div className={styles.PaymentHeader}>
                    <p>Payment Method</p>
                </div>
                <div className={styles.PaymentBody}>
                    <div className={styles.StripeInput}>
                        {/* 
                            PaymentElement automatically includes Card, Google Pay, Apple Pay, etc. 
                            based on your Stripe dashboard settings.
                        */}
                        <PaymentElement />
                    </div>

                    {validationErrors.card && (
                        <span className={styles.ErrorMessage}>{validationErrors.card}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function PaymentButtonSection({ isProcessing, handlePayment }) {
    return (
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
    );
}

export default function PaymentSection({ validationErrors, isProcessing, handlePayment }) {
    return (
        <>
            <PaymentCardSection validationErrors={validationErrors} />
            <PaymentButtonSection isProcessing={isProcessing} handlePayment={handlePayment} />
        </>
    );
}