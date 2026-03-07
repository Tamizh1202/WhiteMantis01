"use client";
import React, { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/_context/CartContext";
import { toast } from "react-hot-toast";
import styles from "../page.module.css";

// ── Section Components ──────────────────────────────────────────────────────
// ExpressCheckoutSection removed (temporarily disabled)
import ContactSection from "./ContactSection";
import DeliverySelector from "./DeliverySelector";
import ShippingAddressSection from "./ShippingAddressSection";
import BillingAddressSection from "./BillingAddressSection";
import { PaymentCardSection, PaymentButtonSection } from "./PaymentSection";
import OrderSummary from "./OrderSummary";

// ── Utilities ───────────────────────────────────────────────────────────────
import { validateCheckoutForm } from "@/utils/validatorFunctions";
import {
    buildBillingDetails,
    buildCheckoutPayload,
    buildSuccessUrl,
    scrollToFirstError,
} from "@/utils/checkoutUtils";
import { saveAddressAPI } from "@/app/account/_components/ProfileComponents/profileApiUtils";

export default function CheckoutForm({
    session,
    status,
    delivery,
    setDelivery,
    savedAddresses,
    setSavedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    openMenuId,
    setOpenMenuId,
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
    }, [session]);

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
            // 2. Trigger form validation via Stripe Elements
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setValidationErrors((prev) => ({ ...prev, card: submitError.message }));
                setIsProcessing(false);
                return;
            }

            // 3. Build Stripe billing details
            const billingDetails = buildBillingDetails({
                email, session, delivery, useShippingAsBilling,
                status, selectedAddressId,
                savedAddresses, shippingForm, billingForm,
            });

            // 4. Build and send checkout payload to backend
            // Note: We don't have a paymentMethodId yet, backend needs to return clientSecret
            const payload = buildCheckoutPayload({
                email, session, delivery, status,
                selectedAddressId, savedAddresses, shippingForm, billingForm,
                useShippingAsBilling, paymentMethodId: null, // Intent-based flow
                checkoutMode, subscriptionId, variationId,
            });

            const response = await fetch("/api/website/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.message || data.error || "Checkout failed");

            // 5. Confirm the payment with Stripe
            // This will handle 3DS, saved cards, and redirect to return_url
            if (data.clientSecret) {
                // Save address if user opted in (before redirect as redirect will unload page)
                if (shippingForm.saveAddress && status === "authenticated" && session?.user?.id) {
                    try {
                        await saveAddressAPI(session.user.id, {
                            label: "Home",
                            addressFirstName: shippingForm.firstName.trim(),
                            addressLastName: shippingForm.lastName.trim(),
                            street: shippingForm.address.trim(),
                            apartment: (shippingForm.apartment || "").trim(),
                            country: "United Arab Emirates",
                            city: shippingForm.city.trim(),
                            emirates: shippingForm.emirates || "dubai",
                            phoneNumber: shippingForm.phone.trim(),
                            isDefaultAddress: false,
                        });
                    } catch (saveErr) {
                        console.error("Failed to save address:", saveErr);
                    }
                }

                // Confirm payment
                const { error: confirmError } = await stripe.confirmPayment({
                    elements,
                    clientSecret: data.clientSecret,
                    confirmParams: {
                        return_url: `${window.location.origin}${buildSuccessUrl(checkoutMode, data)}`,
                        payment_method_data: {
                            billing_details: billingDetails,
                        }
                    },
                });

                if (confirmError) {
                    setIsProcessing(false);
                    setValidationErrors((prev) => ({ ...prev, card: confirmError.message || "Payment confirmation failed" }));
                    toast.error(confirmError.message || "Payment confirmation failed");
                }
                // Redirect happens automatically on success if return_url is provided
            }
        } catch (e) {
            console.error(e);
            toast.error(e.message || "An error occurred");
            setIsProcessing(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className={styles.Main} onClick={() => setOpenMenuId(null)}>
            <div className={styles.MainConatiner}>
                {/* ── Left Column ── */}
                <div className={styles.Left}>
                    {/* ExpressCheckoutSection temporarily removed */}

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
                        setSavedAddresses={setSavedAddresses}
                        selectedAddressId={selectedAddressId}
                        setSelectedAddressId={setSelectedAddressId}
                        shippingForm={shippingForm}
                        setShippingForm={setShippingForm}
                        validationErrors={validationErrors}
                        clearError={clearError}
                        setValidationErrors={setValidationErrors}
                        session={session}
                    />

                    <PaymentCardSection
                        validationErrors={validationErrors}
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

                    <PaymentButtonSection
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
