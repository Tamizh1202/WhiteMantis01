// ─── Simple Field Validators ──────────────────────────────────────────────────
// Each returns an error string, or "" if valid.

export const validateEmail = (email) => {
    if (!email || email.trim() === "") return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Please enter a valid email address";
    return "";
};

export const validateUAEPhone = (phone) => {
    if (!phone || phone.trim() === "") return "Phone number is required";
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const regex = /^(?:\+971|00971|0)?(5[024568]|2|3|4|6|7|9)\d{7}$/;
    if (!regex.test(cleanPhone)) return "Invalid UAE phone number";
    return "";
};

export const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    return "";
};

// ─── Full Checkout Form Validator ─────────────────────────────────────────────
// Returns { isValid: bool, errors: object }

export const validateCheckoutForm = ({
    email,
    delivery,
    status,
    showNewAddressForm,
    selectedAddressId,
    shippingForm,
    billingForm,
    useShippingAsBilling,
}) => {
    const errors = {};
    let isValid = true;

    const fail = (key, msg) => {
        errors[key] = msg;
        isValid = false;
    };

    // Email
    const emailErr = validateEmail(email);
    if (emailErr) fail("email", emailErr);

    // Shipping (only if shipping mode + no saved address selected)
    if (delivery === "ship") {
        const needsForm =
            status !== "authenticated" || showNewAddressForm || !selectedAddressId;
        if (needsForm) {
            const fn = validateRequired(shippingForm.firstName, "First name");
            const ln = validateRequired(shippingForm.lastName, "Last name");
            const addr = validateRequired(shippingForm.address, "Address");
            const city = validateRequired(shippingForm.city, "City");
            const phone = validateUAEPhone(shippingForm.phone);
            if (fn) fail("shippingFirstName", fn);
            if (ln) fail("shippingLastName", ln);
            if (addr) fail("shippingAddress", addr);
            if (city) fail("shippingCity", city);
            if (phone) fail("shippingPhone", phone);
        }
    }

    // Billing (only if not using shipping as billing, or pickup mode)
    if (!useShippingAsBilling || delivery === "pickup") {
        const fn = validateRequired(billingForm.firstName, "First name");
        const ln = validateRequired(billingForm.lastName, "Last name");
        const addr = validateRequired(billingForm.address, "Address");
        const city = validateRequired(billingForm.city, "City");
        const phone = validateUAEPhone(billingForm.phone);
        if (fn) fail("billingFirstName", fn);
        if (ln) fail("billingLastName", ln);
        if (addr) fail("billingAddress", addr);
        if (city) fail("billingCity", city);
        if (phone) fail("billingPhone", phone);
    }

    return { isValid, errors };
};