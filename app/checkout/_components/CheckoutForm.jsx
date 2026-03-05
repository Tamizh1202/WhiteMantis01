"use client";
import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardNumberElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/_context/CartContext";
import { toast } from "react-hot-toast";
import styles from "../page.module.css";

// ── Section Components ──────────────────────────────────────────────────────
import ExpressCheckoutSection from "./ExpressCheckoutSection";
import ContactSection from "./ContactSection";
import DeliverySelector from "./DeliverySelector";
import ShippingAddressSection from "./ShippingAddressSection";
import BillingAddressSection from "./BillingAddressSection";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";

// ── Utilities ───────────────────────────────────────────────────────────────
import { validateCheckoutForm } from "@/utils/validatorFunctions";
import {
    buildBillingDetails,
    buildCheckoutPayload,
    buildSuccessUrl,
    scrollToFirstError,
} from "@/utils/checkoutUtils";

/**
 * CheckoutForm
 * ─────────────────────────────────────────────────────────
 * Main form orchestrator. Receives all state from CheckoutContent (page.js).
 * Manages local UI state: email, isProcessing, validationErrors.
 * Handles the full payment flow via handlePayment.
 */
export default function CheckoutForm({
    session,
    status,
    delivery,
    setDelivery,
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    openMenuId,
    setOpenMenuId,
    showNewAddressForm,
    setShowNewAddressForm,
    useShippingAsBilling,
    setUseShippingAsBilling,
    product,
    cartTotals,
    shippingForm,
    setShippingForm,
    billingForm,
    setBillingForm,
    checkoutMode,
    subscriptionId,
    variationId,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const { openCart } = useCart();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Pre-fill email from session
    useEffect(() => {
        if (session?.user?.email) setEmail(session.user.email);
    }, [session?.user?.email]);

    // ── Helper: clear a single error field ─────────────────────────────────────
    const clearError = (key) => setValidationErrors((prev) => ({ ...prev, [key]: "" }));

    // ── Payment Handler ─────────────────────────────────────────────────────────
    const handlePayment = async () => {
        if (!stripe || !elements) return;

        // 1. Validate all fields
        const { isValid, errors } = validateCheckoutForm({
            email,
            delivery,
            status,
            showNewAddressForm,
            selectedAddressId,
            shippingForm,
            billingForm,
            useShippingAsBilling,
        });

        if (!isValid) {
            setValidationErrors(errors);
            setTimeout(() => scrollToFirstError(errors, styles.InputError), 100);
            return;
        }

        setIsProcessing(true);

        try {
            // 2. Get Stripe card element
            const cardElement = elements.getElement(CardNumberElement);
            if (!cardElement) {
                setValidationErrors((prev) => ({ ...prev, card: "Card information is required" }));
                setIsProcessing(false);
                return;
            }

            // 3. Build Stripe billing details
            const billingDetails = buildBillingDetails({
                email, session, delivery, useShippingAsBilling,
                status, showNewAddressForm, selectedAddressId,
                savedAddresses, shippingForm, billingForm,
            });

            // 4. Create Stripe payment method
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: billingDetails,
            });

            if (pmError) {
                setIsProcessing(false);
                setValidationErrors((prev) => ({ ...prev, card: pmError.message || "Invalid card information" }));
                return;
            }

            // 5. Build and send checkout payload to backend
            const payload = buildCheckoutPayload({
                email, session, delivery, status, showNewAddressForm,
                selectedAddressId, savedAddresses, shippingForm, billingForm,
                useShippingAsBilling, paymentMethodId: paymentMethod.id,
                checkoutMode, subscriptionId, variationId,
            });

            const response = await fetch("/api/website/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.message || data.error || "Checkout failed");

            // 6. Confirm the payment
            if (data.clientSecret) {
                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret);

                if (confirmError) {
                    setIsProcessing(false);
                    setValidationErrors((prev) => ({ ...prev, card: confirmError.message || "Payment confirmation failed" }));
                    toast.error(confirmError.message || "Payment confirmation failed");
                    return;
                }

                if (paymentIntent?.status === "succeeded") {
                    // Clear cart on successful order
                    if (checkoutMode === "cart") {
                        try {
                            await fetch("/api/website/cart/clear", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ action: "clear" }),
                            });
                        } catch (clearError) {
                            console.error("Failed to clear cart:", clearError);
                        }
                    }
                    router.push(buildSuccessUrl(checkoutMode, data));
                }
            }
        } catch (e) {
            console.error(e);
            openCart();
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className={styles.Main} onClick={() => setOpenMenuId(null)}>
            <div className={styles.MainConatiner}>
                {/* ── Left Column ── */}
                <div className={styles.Left}>
                    <ExpressCheckoutSection />

                    <ContactSection
                        email={email}
                        setEmail={setEmail}
                        status={status}
                        session={session}
                        validationErrors={validationErrors}
                        clearError={clearError}
                        setValidationErrors={setValidationErrors}
                    />

                    <DeliverySelector delivery={delivery} setDelivery={setDelivery} />

                    <ShippingAddressSection
                        delivery={delivery}
                        status={status}
                        savedAddresses={savedAddresses}
                        selectedAddressId={selectedAddressId}
                        setSelectedAddressId={setSelectedAddressId}
                        showNewAddressForm={showNewAddressForm}
                        setShowNewAddressForm={setShowNewAddressForm}
                        shippingForm={shippingForm}
                        setShippingForm={setShippingForm}
                        validationErrors={validationErrors}
                        clearError={clearError}
                        setValidationErrors={setValidationErrors}
                    />

                    <BillingAddressSection
                        delivery={delivery}
                        useShippingAsBilling={useShippingAsBilling}
                        setUseShippingAsBilling={setUseShippingAsBilling}
                        billingForm={billingForm}
                        setBillingForm={setBillingForm}
                        validationErrors={validationErrors}
                        clearError={clearError}
                        setValidationErrors={setValidationErrors}
                    />

                    <PaymentSection
                        validationErrors={validationErrors}
                        isProcessing={isProcessing}
                        handlePayment={handlePayment}
                    />
                </div>

                <div className={styles.Line}></div>

                {/* ── Right Column ── */}
                <OrderSummary product={product} cartTotals={cartTotals} delivery={delivery} />
            </div>
        </div>
    );
}
