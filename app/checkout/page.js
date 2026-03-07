"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../_context/CartContext";
import { toast } from "react-hot-toast";
import styles from "./page.module.css";
import placeholderImage from "./1.png";
import CheckoutForm from "./_components/CheckoutForm";
import axiosClient from "@/lib/axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartTotals: contextCartTotals, products: cartProducts } = useCart();

  // ── URL Params ──────────────────────────────────────────────────────────────
  const mode = searchParams.get("mode");
  const subscriptionId = searchParams.get("subscriptionId");
  const variationId = searchParams.get("variationId");

  // ── Page State ──────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutMode, setCheckoutMode] = useState(null); // "cart" | "subscription"
  const [product, setProducts] = useState([]);

  // ── Delivery & Address State ────────────────────────────────────────────────
  const [delivery, setDelivery] = useState("ship");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);

  // ── Form State ──────────────────────────────────────────────────────────────
  const [shippingForm, setShippingForm] = useState({
    firstName: "", lastName: "", address: "", apartment: "", city: "", phone: "", saveAddress: false,
  });
  const [billingForm, setBillingForm] = useState({
    firstName: "", lastName: "", address: "", apartment: "", city: "", phone: "",
  });

  // ── Totals ──────────────────────────────────────────────────────────────────
  const [shippingTax, setShippingTax] = useState({ shipping: 0, tax: 0, taxPercent: 0 });
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 });

  // ── Sync cart products & totals from context (cart mode) ───────────────────
  useEffect(() => {
    if (checkoutMode === "cart" && cartProducts) setProducts(cartProducts);
  }, [cartProducts, checkoutMode]);

  useEffect(() => {
    if (checkoutMode === "cart" && contextCartTotals) {
      setCartTotals({
        subtotal: contextCartTotals.subtotal || 0,
        shipping: contextCartTotals.shipping || 0,
        tax: contextCartTotals.tax || 0,
        discount: contextCartTotals.discount || 0,
        total: contextCartTotals.total || 0,
      });
    }
  }, [contextCartTotals, checkoutMode]);

  // ── Initial Data Fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      // 1. Validate mode
      if (mode === "subscription") {
        if (!subscriptionId || !variationId) { router.push("/"); return; }
        setCheckoutMode("subscription");

        try {
          const res = await fetch(`/api/website/products/${subscriptionId}`);
          const data = await res.json();

          if (!res.ok || data.product?.type !== "variable-subscription") {
            router.push("/"); return;
          }

          const variation = data.product.variation_options?.find(
            (v) => String(v.id) === String(variationId)
          );
          if (!variation) toast.error("Subscription option not found");

          // Extract product details
          const weight = variation?.attributes?.attribute_pa_weight ||
            data.product.attributes.find((a) => a.name === "Weight")?.option || "";

          const freqRaw = variation?.attributes?.["attribute_pa_simple-subscription-frequenc"] ||
            data.product.meta_data.find((m) => m.key === "_subscription_period")?.value || "";

          const quantityRaw = variation?.attributes?.["attribute_pa_simple-subscription-quantity"] || "1";

          // Format frequency label
          const freqMap = {
            "2-week": "Every 2 Weeks", "4-week": "Every 4 Weeks", "month": "Monthly",
            "7-day": "Every 7 Days", "15-day": "Every 15 Days", "30-day": "Every 30 Days",
          };
          const frequencyDisplay = freqMap[freqRaw] || freqRaw;

          const basePrice = parseFloat(variation?.price || data.product.price || 0);
          const discountPercent = variation?.subscription_details?.subscription_discount || 0;
          const discountedPrice = basePrice - (basePrice * discountPercent / 100);

          setProducts([{
            id: data.product.id,
            variation_id: variation?.id,
            image: variation?.image || data.product.images?.[0]?.src || placeholderImage,
            title: data.product.name,
            weight,
            frequency: frequencyDisplay,
            price: discountedPrice,
            quantity: parseInt(quantityRaw) || 1,
            attributes: variation?.attributes,
            subscription_details: variation?.subscription_details,
          }]);

          setCartTotals({
            subtotal: discountedPrice,
            shipping: 0,
            tax: 0,
            discount: basePrice - discountedPrice,
            total: discountedPrice,
          });
        } catch (err) {
          console.error("Error fetching subscription:", err);
          toast.error("Something went wrong loading the subscription");
        }
      } else if (mode === "cart") {
        setCheckoutMode("cart");
        // Products/totals come from CartContext via useEffect above
      } else {
        router.push("/"); return;
      }

      // 2. Fetch saved addresses (authenticated only)
      if (status === "authenticated") {
        try {
          const res = await axiosClient.get(`/api/users/${session.user.id}/addresses`);
          const data = await res.data;
          setSavedAddresses(data.addresses);

          const defaultAddr = data.docs.find((a) => a.original.setAsDefault);
          setSelectedAddressId(defaultAddr ? defaultAddr.id : data.docs[0]?.id || null);

        } catch (err) {
          console.error("Failed to fetch addresses", err);
        }
      }

      // 3. Fetch shipping + tax rates
      try {
        const res = await axiosClient.get(`api/globals/ship-and-tax`);
        const data = await res.data;
        if (data.success && data) {
          setShippingTax({
            shipping: data.shipping || 0,
            tax: 0,
            taxPercent: data.tax || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch shipping/tax", err);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [mode, subscriptionId, variationId, router, status]);

  // ── Recalculate totals on delivery/product/shippingTax changes ─────────────
  useEffect(() => {
    if (!checkoutMode) return;

    let sub = 0;
    let disc = 0;

    if (checkoutMode === "cart") {
      sub = product.reduce((acc, item) => acc + parseFloat(item.price?.final_price || item.price || 0) * (item.quantity || 1), 0);
      if (contextCartTotals?.discount) disc = contextCartTotals.discount;
    } else if (checkoutMode === "subscription") {
      sub = product.reduce((acc, item) => acc + parseFloat(item.price?.final_price || item.price || 0), 0);
    }

    const shipping = delivery === "ship" ? shippingTax.shipping : 0;
    const taxableAmount = Math.max(0, sub - disc + shipping);
    const tax = taxableAmount * (shippingTax.taxPercent / 100);

    setCartTotals({ subtotal: sub, discount: disc, shipping, tax, total: Math.max(0, sub - disc + shipping + tax) });
  }, [product, checkoutMode, contextCartTotals, shippingTax, delivery]);

  // ── Loading / Guard ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.Main}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }
  if (!checkoutMode) return null;

  // ── Stripe Elements options ─────────────────────────────────────────────────
  const stripeOptions = {
    appearance: { theme: "stripe" },
    paymentMethodCreation: "manual",
    mode: "payment",
    amount: Math.round(cartTotals.total * 100) || 100,
    currency: "aed",
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions} key={session?.user?.email || "no-email"}>
      <CheckoutForm
        session={session}
        status={status}
        delivery={delivery}
        setDelivery={setDelivery}
        savedAddresses={savedAddresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        showNewAddressForm={showNewAddressForm}
        setShowNewAddressForm={setShowNewAddressForm}
        useShippingAsBilling={useShippingAsBilling}
        setUseShippingAsBilling={setUseShippingAsBilling}
        product={product}
        cartTotals={cartTotals}
        shippingForm={shippingForm}
        setShippingForm={setShippingForm}
        billingForm={billingForm}
        setBillingForm={setBillingForm}
        checkoutMode={checkoutMode}
        subscriptionId={subscriptionId}
        variationId={variationId}
      />
    </Elements>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Entry Point
// ─────────────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
