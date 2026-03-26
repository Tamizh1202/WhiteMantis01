"use client";
import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/_context/CartContext";
import { toast } from "react-hot-toast";
import styles from "../page.module.css";
import axiosClient from "@/lib/axios";

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
  buildOneTimePayload,
  buildSubscriptionPayload,
  formatCheckoutAddress,
  buildSuccessUrl,
  scrollToFirstError,
} from "@/utils/checkoutUtils";
import { saveAddressAPI } from "@/app/account/profile/_components/ProfileComponents/profileApiUtils";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";

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
  email,
  setEmail,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { openCart, isBeansApplied, appliedCoupon } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // ── Helper: clear a single error field ─────────────────────────────────────
  const clearError = (key) =>
    setValidationErrors((prev) => ({ ...prev, [key]: "" }));

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

      // 3. (Optional) Any additional validation or pre-processing

      // 4. Build and send checkout payload to backend
      const deliveryOption = delivery === "ship" ? "delivery" : "pickup";

      const shipAddr =
        deliveryOption === "delivery"
          ? formatCheckoutAddress(
              status === "authenticated" && selectedAddressId
                ? savedAddresses.find((a) => a.id === selectedAddressId)
                : shippingForm,
            )
          : {
              addressFirstName: "",
              addressLastName: "",
              addressLine1: "Pickup",
              addressLine2: "",
              city: "",
              emirates: "dubai",
              phoneNumber: "",
              addressCountry: "United Arab Emirates",
            };

      const billAddr =
        useShippingAsBilling && deliveryOption === "delivery"
          ? { ...shipAddr }
          : formatCheckoutAddress(billingForm);

      let payload = {
        delivery: deliveryOption,
        shippingAddress: shipAddr,
        billingAddress: billAddr,
        shippingAddressAsBillingAddress: useShippingAsBilling,
        email: email || session?.user?.email,
        product: {
          productId: product[0].id,
          variantId: variationId || "",
          subscriptionId: subscriptionId,
          quantity: product[0].quantity,
        },
        useWTCoins: !!isBeansApplied,
      };
      let url = "";

      if (checkoutMode === "subscription") {
        url = "/api/checkout/subscription";
        payload = buildSubscriptionPayload({
          delivery: deliveryOption,
          shippingAddress: shipAddr,
          billingAddress: billAddr,
          shippingAddressAsBillingAddress: useShippingAsBilling,
          email: email || session?.user?.email,
          product: {
            productId: product[0].id,
            variantId: variationId || "",
            subscriptionId: subscriptionId,
            quantity: product[0].quantity,
          },
          useWTCoins: !!isBeansApplied,
        });
      } else {
        url = "/api/checkout/one-time";
        payload = buildOneTimePayload({
          delivery: deliveryOption,
          shippingAddress: shipAddr,
          billingAddress: billAddr,
          shippingAddressAsBillingAddress: useShippingAsBilling,
          email: email || session?.user?.email,
          products: product.map((p) => ({
            productId: p.product || p.id,
            variantId: p.vId || "",
            quantity: p.quantity,
          })),
          useWTCoins: !!isBeansApplied,
          appliedCouponCode: appliedCoupon?.code || "",
        });
      }

      console.log(payload, "payload");

      const response = await axiosClient.post(url, payload);
      const data = response.data;

      if (checkoutMode === "subscription") {
        console.log(
          "🧾 [SUB] FULL backend response:",
          JSON.stringify(data, null, 2),
        );
      }

      console.log(response, "response");

      if (!data.success)
        throw new Error(data.message || data.error || "Checkout failed");

      // Mark that we're navigating to success from a real checkout
      sessionStorage.setItem("checkout_success", "1");

      // 5. Confirm the payment with Stripe
      const secret = data.clientSecret || data.client_secret;

      if (secret) {
        // Save address if user opted in
        if (
          shippingForm.saveAddress &&
          status === "authenticated" &&
          session?.user?.id
        ) {
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

        console.log(secret, "secret");

        if (checkoutMode === "subscription") {
          // Subscription Flow: Use redirect: 'if_required' and manual PATCH synchronization
          const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret: secret, // Use the secret from your backend
            confirmParams: {
              return_url: `${window.location.origin}${buildSuccessUrl(checkoutMode, data)}`,
            },
            redirect: "if_required", // This allows us to handle the success manually
          });

          if (error) {
            setIsProcessing(false);
            setValidationErrors((prev) => ({
              ...prev,
              card: error.message || "Payment confirmation failed",
            }));
            toast.error(error.message || "Payment confirmation failed");
            return;
          }

          if (paymentIntent && paymentIntent.status === "succeeded") {
            const orderId =
              data.dbSubscriptionId || data.wpSubscriptionId || data.id;
            console.log(
              "✅ Subscription payment confirmed:",
              paymentIntent.id,
              paymentIntent.status,
            );

            if (orderId) {
              try {
                await axiosClient.patch(`/api/web-subscription/${orderId}`, {
                  paymentStatus: "completed",
                });
                console.log(
                  "✅ Subscription paymentStatus → completed, orderId:",
                  orderId,
                );
              } catch (patchErr) {
                console.warn(
                  "⚠️ Subscription paymentStatus PATCH error (non-fatal):",
                  patchErr,
                );
              }
            }
            // Manual redirect after synchronization
            router.push(buildSuccessUrl(checkoutMode, data));
          }
        } else {
          // One-Time Flow: Standard redirect behavior
          const { error: confirmError } = await stripe.confirmPayment({
            elements,
            clientSecret: secret,
            confirmParams: {
              return_url: `${window.location.origin}${buildSuccessUrl(checkoutMode, data)}`,
            },
          });

          if (confirmError) {
            setIsProcessing(false);
            setValidationErrors((prev) => ({
              ...prev,
              card: confirmError.message || "Payment confirmation failed",
            }));
            toast.error(confirmError.message || "Payment confirmation failed");
          }
        }
      }
    } catch (e) {
      console.error(e);
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      toast.error(backendMsg || e.message || "An error occurred");
      console.log(e.response?.data);
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

          <div className={styles.One}>
            <p style={{ fontWeight: "400" }}>EXPRESS CHECKOUT</p>

            <div className={styles.ExpressContainer}>
              <ExpressCheckoutElement />
            </div>
          </div>

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

          <PaymentCardSection validationErrors={validationErrors} />

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
        <OrderSummary
          product={product}
          cartTotals={cartTotals}
          delivery={delivery}
          checkoutMode={checkoutMode}
        />
      </div>
    </div>
  );
}
