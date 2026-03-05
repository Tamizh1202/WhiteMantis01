// ─── Country Code Lookup ──────────────────────────────────────────────────────

export const getCountryCode = (name) => {
    if (!name) return "AE";
    const map = {
        "united arab emirates": "AE",
        uae: "AE",
        india: "IN",
        "united states": "US",
        usa: "US",
        "united kingdom": "GB",
        uk: "GB",
        "saudi arabia": "SA",
        oman: "OM",
        bahrain: "BH",
        kuwait: "KW",
        qatar: "QA",
    };
    return map[name.toLowerCase()] || (name.length === 2 ? name.toUpperCase() : "AE");
};

// ─── Address Object Formatter ─────────────────────────────────────────────────
// Produces the standard address shape expected by the backend.

export const formatAddress = (firstName, lastName, address, apartment, city, country, phone) => ({
    label: "Home Address",
    firstName,
    lastName,
    address,
    apartment,
    city,
    state: "",
    country: country || "",
    phone,
    postalCode: "",
});

// ─── Stripe Billing Details Builder ──────────────────────────────────────────

export const buildBillingDetails = ({
    email,
    session,
    delivery,
    useShippingAsBilling,
    status,
    showNewAddressForm,
    selectedAddressId,
    savedAddresses,
    shippingForm,
    billingForm,
}) => {
    const details = {
        email: email || session?.user?.email,
        name: "",
        phone: "",
        address: { country: "AE" },
    };

    if (useShippingAsBilling && delivery === "ship") {
        if (status === "authenticated" && !showNewAddressForm && selectedAddressId) {
            const addr = savedAddresses.find((a) => a.id === selectedAddressId);
            if (addr) {
                details.name = addr.name;
                details.address = {
                    line1: addr.original.address,
                    line2: addr.original.apartment,
                    city: addr.original.city,
                    country: getCountryCode(addr.original.country),
                };
            }
        } else {
            details.name = `${shippingForm.firstName} ${shippingForm.lastName}`;
            details.phone = shippingForm.phone;
            details.address = {
                line1: shippingForm.address,
                line2: shippingForm.apartment,
                city: shippingForm.city,
                country: "AE",
            };
        }
    } else {
        details.name = `${billingForm.firstName} ${billingForm.lastName}`;
        details.phone = billingForm.phone;
        details.address = {
            line1: billingForm.address,
            line2: billingForm.apartment,
            city: billingForm.city,
            country: "AE",
        };
    }

    return details;
};

// ─── Backend Checkout Payload Builder ────────────────────────────────────────

export const buildCheckoutPayload = ({
    email,
    session,
    delivery,
    status,
    showNewAddressForm,
    selectedAddressId,
    savedAddresses,
    shippingForm,
    billingForm,
    useShippingAsBilling,
    paymentMethodId,
    checkoutMode,
    subscriptionId,
    variationId,
}) => {
    // Resolve shipping address
    let shippingMeta = {};
    if (delivery === "ship") {
        if (status === "authenticated" && !showNewAddressForm && selectedAddressId) {
            const s = savedAddresses.find((a) => a.id === selectedAddressId)?.original;
            if (s) shippingMeta = formatAddress(s.firstName, s.lastName, s.address, s.apartment, s.city, s.country, s.phone);
        } else {
            shippingMeta = formatAddress(
                shippingForm.firstName, shippingForm.lastName,
                shippingForm.address, shippingForm.apartment,
                shippingForm.city, "United Arab Emirates", shippingForm.phone
            );
        }
    } else {
        shippingMeta = formatAddress("", "", "Pickup", "", "", "United Arab Emirates", "");
    }

    // Resolve billing address
    const effectiveSameAsBilling = useShippingAsBilling && delivery !== "pickup";
    const billingMeta = effectiveSameAsBilling
        ? { ...shippingMeta }
        : formatAddress(
            billingForm.firstName, billingForm.lastName,
            billingForm.address, billingForm.apartment,
            billingForm.city, "United Arab Emirates", billingForm.phone
        );

    return {
        checkout: {
            type: checkoutMode,
            ...(checkoutMode === "subscription"
                ? { subscriptionProductId: subscriptionId, subscriptionProductVariationId: variationId }
                : {}),
        },
        deliveryOption: delivery,
        address: {
            billing: billingMeta,
            shipping: shippingMeta,
            addressId: status === "authenticated" && !showNewAddressForm ? selectedAddressId : null,
            shippingAsbillingAddress: useShippingAsBilling,
            saveAddress: shippingForm.saveAddress,
        },
        paymentMethodId,
        email: email || session?.user?.email,
    };
};

// ─── Success URL Builder ──────────────────────────────────────────────────────

export const buildSuccessUrl = (checkoutMode, data) => {
    let url = "";
    if (checkoutMode === "subscription") {
        url = `/checkout/success?type=subscription&id=${data.wpSubscriptionId}`;
    } else {
        url = `/checkout/success?type=order&id=${data.orderId}&order_id=${data.orderId}`;
    }
    if (data.guestAccessToken) {
        url += `&token=${encodeURIComponent(data.guestAccessToken)}`;
    }
    return url;
};

// ─── Scroll To First Error ────────────────────────────────────────────────────

const ERROR_FIELD_ORDER = [
    "email", "shippingFirstName", "shippingLastName", "shippingAddress",
    "shippingCity", "shippingPhone", "billingFirstName", "billingLastName",
    "billingAddress", "billingCity", "billingPhone", "card",
];

export const scrollToFirstError = (errors, inputErrorClass) => {
    for (const field of ERROR_FIELD_ORDER) {
        if (errors[field]) {
            requestAnimationFrame(() => {
                const el = document.querySelector(`.${inputErrorClass}`);
                if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top, behavior: "smooth" });
                    setTimeout(() => el.focus({ preventScroll: true }), 500);
                }
            });
            break;
        }
    }
};
