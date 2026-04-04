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
import { formatImageUrl } from "@/lib/imageUtils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// Helper to get frequency label (matching Listing.jsx)
const getFrequencyLabel = (freq) => {
  if (!freq) return "";
  const plural = freq.duration > 1 ? "s" : "";
  return `Delivery every ${freq.duration > 1 ? freq.duration : ""} ${freq.interval}${plural}`.replace(
    "  ",
    " ",
  );
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    cartTotals: contextCartTotals,
    items: cartProducts,
    isBeansApplied,
    beansBalance,
    coinConfig,
  } = useCart();

  // ── URL Params ──────────────────────────────────────────────────────────────
  const mode = searchParams.get("mode");
  const productId = searchParams.get("productId");
  const subscriptionId = searchParams.get("subscriptionId"); // Frequency ID
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
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);

  // ── Form State ──────────────────────────────────────────────────────────────
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    emirates: "dubai",
    saveAddress: false,
  });
  const [billingForm, setBillingForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    emirates: "dubai",
  });

  // ── Totals ──────────────────────────────────────────────────────────────────
  const [shippingTax, setShippingTax] = useState({
    shipping: 0,
    tax: 0,
    taxPercent: 0,
  });
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

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
        if (!productId || !subscriptionId) {
          router.push("/");
          return;
        }
        setCheckoutMode("subscription");

        try {
          const res = await axiosClient.get(`/api/web-products/${productId}`);
          const data = res.data;

          if (!data) {
            router.push("/");
            return;
          }

          const productData = data;
          let variation = null;
          let selectedFreqs = [];
          let discountPercent = 0;
          let basePrice = 0;
          let image =
            formatImageUrl(productData.productImage) || placeholderImage;
          let weight = "";
          let variantName = "";

          if (productData.hasVariantOptions && variationId) {
            variation = productData.variants?.find(
              (v) => String(v.id || v._id) === String(variationId),
            );

            if (variation) {
              selectedFreqs = variation.subFreq || [];
              discountPercent = variation.subscriptionDiscount || 0;
              basePrice = parseFloat(
                variation.variantSalePrice ||
                  variation.variantRegularPrice ||
                  0,
              );
              image = formatImageUrl(variation.variantImage) || image;
              weight = variation.variantWeight || "";
              variantName = variation.variantName || "";
            }
          } else {
            selectedFreqs = productData.subFreq || [];
            discountPercent = productData.subscriptionDiscount || 0;
            basePrice = parseFloat(
              productData.salePrice || productData.regularPrice || 0,
            );
            weight = productData.weight || "";
          }

          // Find Freq by subscriptionId
          const matchedFreq = selectedFreqs.find(
            (f) => String(f.id || f._id) === String(subscriptionId),
          );
          const frequencyDisplay = matchedFreq
            ? getFrequencyLabel(matchedFreq)
            : "Subscription";

          const discountedPrice =
            basePrice - basePrice * (discountPercent / 100);

          setProducts([
            {
              id: productData.id,
              vId: variation?.id || variation?._id || "",
              image: image,
              name: productData.name,
              variantName: variantName,
              weight: weight,
              frequency: frequencyDisplay,
              price: discountedPrice,
              quantity: parseInt(searchParams.get("quantity") || "1"),
            },
          ]);

          setCartTotals({
            subtotal:
              discountedPrice * parseInt(searchParams.get("quantity") || "1"),
            shipping: 0,
            tax: 0,
            discount:
              (basePrice - discountedPrice) *
              parseInt(searchParams.get("quantity") || "1"),
            total:
              discountedPrice * parseInt(searchParams.get("quantity") || "1"),
          });
        } catch (err) {
          console.error("Error fetching subscription:", err);
          toast.error("Something went wrong loading the subscription");
        }
      } else if (mode === "cart") {
        setCheckoutMode("cart");
        // Products/totals come from CartContext via useEffect above
      } else {
        router.push("/");
        return;
      }

      // 2. Fetch saved addresses (authenticated only)
      if (status === "authenticated") {
        try {
          const res = await axiosClient.get(
            `/api/users/${session.user.id}/addresses`,
          );
          const data = await res.data;
          const addresses = data.addresses || [];
          setSavedAddresses(addresses);

          if (addresses.length > 0) {
            const defaultAddr = addresses.find(
              (a) => a.isDefaultAddress || a.isDefault,
            );
            setSelectedAddressId(
              defaultAddr ? defaultAddr.id : addresses[0].id,
            );
          } else {
            setSelectedAddressId(null);
          }
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
    let coinsDisc = 0;

    if (checkoutMode === "cart") {
      sub = product.reduce(
        (acc, item) =>
          acc +
          parseFloat(item.price?.final_price || item.price || 0) *
            (item.quantity || 1),
        0,
      );
      if (contextCartTotals?.discount) disc = contextCartTotals.discount;
      if (contextCartTotals?.beansDiscount)
        coinsDisc = contextCartTotals.beansDiscount;
    } else if (checkoutMode === "subscription") {
      sub = product.reduce(
        (acc, item) =>
          acc +
          parseFloat(item.price?.final_price || item.price || 0) *
            (item.quantity || 1),
        0,
      );
      // Calculate Beans Discount for Subscription
      if (isBeansApplied && beansBalance > 0) {
        const maxPossibleDiscount = sub * 0.2;
        const balanceInAed = beansBalance / (coinConfig.pointsToAed || 10);
        coinsDisc = Math.min(maxPossibleDiscount, balanceInAed);
      }
    }

    // Determine Dynamic Shipping
    let currentShipping = 0;
    if (delivery === "ship") {
      let currentEmirate = "dubai"; // default

      if (status === "authenticated" && selectedAddressId) {
        const selectedAddr = savedAddresses.find(
          (a) => a.id === selectedAddressId,
        );
        if (selectedAddr) {
          currentEmirate = (
            selectedAddr.emirates ||
            selectedAddr.state ||
            "dubai"
          ).toLowerCase();
        }
      } else {
        currentEmirate = (shippingForm.emirates || "dubai").toLowerCase();
      }

      // Shipping Rates: Dubai 30, others 50
      const rates = {
        dubai: 30,
        abu_dhabi: 50,
        ajman: 50,
        fujairah: 50,
        ras_al_khaimah: 50,
        sharjah: 50,
        umm_al_quwain: 50,
      };

      currentShipping = rates[currentEmirate] || 50;
    }

    if (checkoutMode === "subscription") {
      currentShipping = 0;
    }

    // Tax calculation (Default to 5% if API returns 0 or null)
    const activeTaxPercent =
      shippingTax.taxPercent > 0 ? shippingTax.taxPercent : 5;
    const taxableAmount = Math.max(0, sub - disc - coinsDisc + currentShipping);
    const taxValue = taxableAmount * (activeTaxPercent / 100);

    setCartTotals({
      subtotal: sub,
      discount: disc,
      beansDiscount: coinsDisc,
      shipping: currentShipping,
      tax: taxValue,
      taxPercent: activeTaxPercent,
      total: Math.max(0, sub - disc - coinsDisc + currentShipping + taxValue),
    });
  }, [
    product,
    checkoutMode,
    contextCartTotals,
    shippingTax,
    delivery,
    selectedAddressId,
    savedAddresses,
    shippingForm.emirates,
    status,
    isBeansApplied,
    beansBalance,
    coinConfig,
  ]);

  if (isLoading || status === "loading") {
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
  const stripeAmount = Math.max(100, Math.round((cartTotals.total || 0) * 100));

  const stripeOptions = {
    appearance: { theme: "stripe" },
    paymentMethodCreation: "manual",
    mode: checkoutMode === "subscription" ? "subscription" : "payment",
    amount: stripeAmount, // Pass in fils
    currency: "aed",
    ...(status === "authenticated" && { setup_future_usage: "off_session" }),
  };

  console.log("stripeOptions", stripeOptions);

  return (
    <Elements
      stripe={stripePromise}
      options={stripeOptions}
      key={`${session?.user?.id || "guest"}-${checkoutMode}`}
    >
      <CheckoutForm
        session={session}
        status={status}
        delivery={delivery}
        setDelivery={setDelivery}
        savedAddresses={savedAddresses}
        setSavedAddresses={setSavedAddresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        useShippingAsBilling={useShippingAsBilling}
        setUseShippingAsBilling={setUseShippingAsBilling}
        product={product}
        cartTotals={cartTotals}
        shippingForm={shippingForm}
        setShippingForm={setShippingForm}
        setBillingForm={setBillingForm}
        checkoutMode={checkoutMode}
        billingForm={billingForm}
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
