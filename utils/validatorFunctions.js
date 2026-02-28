export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

export const validateUAEPhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const regex = /^(?:\+971|0)?(?:5[024568]|2|3|4|6|7|9)\d{7}$/;
    return regex.test(cleanPhone);
};