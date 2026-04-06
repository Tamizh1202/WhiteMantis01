// Fetch product and variant info from Payload CMS

import axiosClient from "@/lib/axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

async function fetchCartProduct(productId, vid = null) {
  const res = await axiosClient.get(`/api/web-products/${productId}?depth=1`);
  const productDoc = await res.data;

  console.log(productDoc);

  if (!productDoc || productDoc.errors) return null;

  // If vid is provided, pick the matching variant
  if (vid) {
    const variant = productDoc.variants?.find((v) => v.id === vid);
    if (variant) {
      return {
        product: productDoc.id,
        name: `${productDoc.name}`,
        price: variant.variantSalePrice || variant.variantRegularPrice,
        image: variant.variantImage?.url || productDoc.productImage?.url || "",
        vId: vid,
        tagline: productDoc.tagline,
        variantName: variant.variantName,
        inStock: variant.variantInStock,
        stockQuantity: variant.variantStockQuantity,
      };
    }
  }

  // No vid — simple product
  return {
    product: productDoc.id,
    name: productDoc.name,
    price: productDoc.salePrice || productDoc.regularPrice,
    image: productDoc.productImage?.url || "",
    vId: null,
    tagline: productDoc.tagline,
    inStock: productDoc.inStock,
    stockQuantity: productDoc.stockQuantity,
  };
}

// Read the full cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem("guestCart");
    console.log(cart);
    if (cart) {
      return JSON.parse(cart);
    }
  } catch (e) {
    console.error("Error reading guestCart:", e);
  }
  return { items: [], subtotal: 0, totalItems: 0 };
};

// Persist the cart to localStorage
const saveCart = (cart) => {
  localStorage.setItem("guestCart", JSON.stringify(cart));
};

// Recalculate subtotal and totalItems from items array
const recalculate = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
};

// Add an item to the guest cart (fetches product details from Payload)
export const addItemToCart = async (productId, quantity = 1, vid = null) => {
  const cart = getCart();
  const items = cart.items || [];

  // Fetch latest product/variant data from Payload
  const productData = await fetchCartProduct(productId, vid || null);
  if (!productData) {
    console.error("Could not fetch product data for guest cart");
    return;
  }

  // Check if same product + variant already in cart
  const existingIndex = items.findIndex(
    (item) =>
      item.product === productData.product && item.vId === productData.vId,
  );

  if (existingIndex >= 0) {
    const newQty = items[existingIndex].quantity + quantity;

    // Validate stock
    if (productData.inStock === false) {
      throw new Error("This product is out of stock");
    }
    if (
      productData.stockQuantity !== null &&
      productData.stockQuantity !== undefined &&
      newQty > productData.stockQuantity
    ) {
      throw new Error(`Only ${productData.stockQuantity} units available`);
    }

    items[existingIndex].quantity = newQty;
  } else {
    // Validate stock for new item
    if (productData.inStock === false) {
      throw new Error("This product is out of stock");
    }
    if (
      productData.stockQuantity !== null &&
      productData.stockQuantity !== undefined &&
      quantity > productData.stockQuantity
    ) {
      throw new Error(`Only ${productData.stockQuantity} units available`);
    }

    items.push({ ...productData, quantity });
  }

  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Remove an item from the guest cart by product ID and variant ID
export const removeItemFromCart = (productId, vid = null) => {
  const cart = getCart();
  const items = (cart.items || []).filter(
    (item) => !(item.product === productId && item.vId === vid),
  );
  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Update quantity of a specific item
export const updateItemQuantity = (productId, vid = null, quantity) => {
  const cart = getCart();
  const items = (cart.items || []).map((item) => {
    if (item.product === productId && item.vId === vid) {
      const newQty = Math.max(1, quantity);

      // Validate stock
      if (item.inStock === false) {
        throw new Error("This product is out of stock");
      }
      if (
        item.stockQuantity !== null &&
        item.stockQuantity !== undefined &&
        newQty > item.stockQuantity
      ) {
        throw new Error(`Only ${item.stockQuantity} units available`);
      }

      return { ...item, quantity: newQty };
    }
    return item;
  });
  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Decrease quantity of a specific item by 1; removes the item if quantity reaches 0
export const decrementItem = (productId, vid = null) => {
  const cart = getCart();
  let items = (cart.items || [])
    .map((item) => {
      if (item.product === productId && item.vId === vid) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    })
    .filter((item) => item.quantity > 0); // Remove items with 0 quantity

  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Clear the entire guest cart
export const clearCart = () => {
  saveCart({ items: [], subtotal: 0, totalItems: 0 });
};
