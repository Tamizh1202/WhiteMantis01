import { formatImageUrl } from "@/lib/imageUtils";

/**
 * Returns variants sorted by weight (parsed from variantName).
 */
export const getSortedVariants = (product) => {
  if (!product?.variants || product.variants.length === 0) return [];
  return [...product.variants].sort((a, b) => {
    const weightA = parseInt(a.variantName) || 0;
    const weightB = parseInt(b.variantName) || 0;
    return weightA - weightB;
  });
};

/**
 * Returns display data for the smallest variant (or product if no variants).
 */
export const getSmallestVariantDisplayData = (product) => {
  let price = product.regularPrice;
  let salePrice = product.salePrice;
  let imageSrc = formatImageUrl(product.productImage);
  let variationId = null;

  if (product.hasVariantOptions && product.variants?.length > 0) {
    const sortedVariants = getSortedVariants(product);
    const smallestVariant = sortedVariants[0];
    price = smallestVariant.variantRegularPrice;
    salePrice = smallestVariant.variantSalePrice;
    imageSrc = formatImageUrl(smallestVariant.variantImage);
    variationId = smallestVariant.id;
  }

  return {
    price: salePrice || price,
    regular_price: price,
    sale_price: salePrice,
    image: imageSrc,
    cartProduct: {
      productId: product.id,
      variationId: variationId,
      quantity: 1,
    },
  };
};
