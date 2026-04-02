"use client";
import React, { useState, useEffect } from "react";
import { useWishlist } from "../../../../_context/WishlistContext";
import AddToCart from "@/app/_components/AddToCart";
import styles from "./WhislistComponents.module.css";
import Image from "next/image";
import zeroWish from "./zeroWish.png"
import BuyNowPopup from "@/app/shop/[category]/_components/Listing/_components/BuyNowPopup/BuyNowPopup";
import SubscriptionPopup from "@/app/shop/[category]/_components/Listing/_components/SubscriptionPopup";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formatImageUrl } from "@/lib/imageUtils";

const WhislistComponents = () => {
  const { items: wishlistData, loading, remove } = useWishlist();
  const router = useRouter();

  console.log(wishlistData);
  // const remove = async (id) => {
  //   try {
  //     // 1. Send the request to the specific ID URL
  //     await axiosClient.delete(`/api/wishlist/${id}`);

  //     // 2. Refresh the list so the item actually disappears from the screen
  //     if (refresh) {
  //       await refresh();
  //     }
  //   } catch (error) {
  //     console.error("Server Error:", error.response?.data || error.message);
  //   }
  // };
  // Track selected variation for each product
  const [selectedVariations, setSelectedVariations] = useState({});

  // Subscription Popup State
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(2);
  const popupRef = useRef(null);

  // Initialize default selections when wishlist data loads
  useEffect(() => {
    if (wishlistData?.length > 0) {
      const initialSelections = {};
      wishlistData.forEach((item) => {
        const productDoc = item.product?.value;
        if (productDoc?.variants?.length > 0) {
          // Set first variant as default
          initialSelections[item.id] = productDoc.variants[0];
        }
      });
      setSelectedVariations(initialSelections);
    }
  }, [wishlistData]);

  useEffect(() => {
    if (!showSubscribePopup) return;

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSubscribePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSubscribePopup]);

  const handleRemove = async (productId) => {
    console.log("Deleting ID:", productId); // Use the variable 'id' passed in
    await remove(productId);
  };

  const handleProductClick = (slug, category) => {
    router.push(`/shop/${category}/${slug}`);
  };

  // Helper to get display data for BuyNowPopup
  const getDisplayData = (product) => {
    let price = product.regularPrice;
    let salePrice = product.salePrice;
    let imageSrc = formatImageUrl(product.productImage);
    let variationId = null;

    if (product.hasVariantOptions && product.variants?.length > 0) {
      const firstVariant = product.variants[0];
      price = firstVariant.variantRegularPrice;
      salePrice = firstVariant.variantSalePrice;
      imageSrc = formatImageUrl(firstVariant.variantImage);
      variationId = firstVariant.id;
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

  const handleOpenSubscribePopup = (product) => {
    let subFreqs = [];
    let discount = 0;

    if (product.hasVariantOptions && product.variants?.length > 0) {
      const subVariant =
        product.variants.find((v) => v.hasVariantSub) || product.variants[0];
      subFreqs = subVariant.subFreq || [];
      discount = subVariant.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: product,
        variant: subVariant,
        isVariant: true,
        discount,
        subFreqs,
      });
    } else {
      subFreqs = product.subFreq || [];
      discount = product.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: product,
        isVariant: false,
        discount,
        subFreqs,
      });
    }

    if (subFreqs.length > 0) {
      setSelectedFrequency(subFreqs[0]);
    }

    setSelectedQuantity(2);
    setShowSubscribePopup(true);
  };

  const handleSubscriptionCheckout = () => {
    if (!selectedProduct || !selectedFrequency) return;

    const params = new URLSearchParams({
      mode: "subscription",
      productId: selectedProduct.parent.id,
      subscriptionId: selectedFrequency.id || selectedFrequency._id || "",
      variationId: selectedProduct.isVariant ? selectedProduct.variant.id : "",
      quantity: selectedQuantity.toString(),
    });

    router.push(`/checkout?${params.toString()}`);
  };

  const getFrequencyLabel = (freq) => {
    if (!freq) return "";
    const plural = freq.duration > 1 ? "s" : "";
    return `Every ${freq.duration} ${freq.interval}${plural}`;
  };
  console.log("initial data", wishlistData);
  const handleWeightChange = (wishlistItemId, weight) => {
    const item = wishlistData.find((it) => it.id === wishlistItemId);
    const productDoc = item?.product?.value;
    if (productDoc?.variants) {
      const variation = productDoc.variants.find(
        (v) => v.variantName === weight,
      );
      if (variation) {
        setSelectedVariations((prev) => ({
          ...prev,
          [wishlistItemId]: variation,
        }));
      }
    }
  };

  const getVariationImage = (item) => {
    const selectedVariation = selectedVariations[item.id];
    if (selectedVariation?.variantImage) {
      return formatImageUrl(selectedVariation.variantImage);
    }
    const productDoc = item.product?.value;
    // Fallback to first variation image or parent image
    return (
      formatImageUrl(productDoc?.variants?.[0]?.variantImage) ||
      formatImageUrl(productDoc?.productImage)
    );
  };

  const getVariationPrice = (item, productDoc) => {
    const selectedVariation = selectedVariations[item.id];

    if (selectedVariation) {
      const price =
        selectedVariation.variantSalePrice ||
        selectedVariation.variantRegularPrice ||
        0;
      return `AED ${parseFloat(price).toFixed(2)}`;
    }

    const price = productDoc?.salePrice || productDoc?.regularPrice || 0;
    return `AED ${parseFloat(price).toFixed(2)}`;
  };

  const getRegularPrice = (item, productDoc) => {
    const selectedVariation = selectedVariations[item.id];

    if (selectedVariation) {
      const regular = selectedVariation.variantRegularPrice;
      const sale = selectedVariation.variantSalePrice;
      if (regular && sale && parseFloat(regular) > parseFloat(sale)) {
        return `AED ${parseFloat(regular).toFixed(2)}`;
      }
    }

    if (productDoc?.salePrice && productDoc?.regularPrice) {
      if (
        parseFloat(productDoc.regularPrice) > parseFloat(productDoc.salePrice)
      ) {
        return `AED ${parseFloat(productDoc.regularPrice).toFixed(2)}`;
      }
    }

    return null;
  };
  const getAvailableWeights = (item) => {
    if (!item.variants || item.variants.length === 0) return [];

    return item.variants.map((v) => ({
      label: v.variantName,
      variation: v,
    }));
  };

  if (loading) {
    return (
      <div className={styles.Main}>
        <div className={styles.MainContainer}>
          <div className={styles.Top}>
            <div className={styles.TopLeft}>
              <h3>Wishlist</h3>
            </div>
            <div className={styles.WhishListCount}>
              <p>(Loading...)</p>
            </div>
          </div>
          <div className={styles.EmptyState}>
            <p className={styles.EmptyText}>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.Top}>
          <div className={styles.TopLeft}>
            <h3>Wishlist</h3>
          </div>
          <div className={styles.WhishListCount}>
            <p>({wishlistData.length} items)</p>
          </div>
        </div>

        {wishlistData.length === 0 ? (
          <div className={styles.EmptyState}>
            <Image
                src={zeroWish}
                alt="No products"
                width={140}
                height={140}
            />
            <p className={styles.EmptyText}>Your wish list is empty.</p>
            <p className={styles.EmptySubText}>
              Explore more and shortlist some items.
            </p>
            <button
              className={styles.ShopNow}
              onClick={() => router.push("/shop")}
            >
              Shop now
            </button>
          </div>
        ) : (
          <div className={styles.Bottom}>
            {wishlistData.map((item) => {
              // 1. Extract the actual product data from the Payload relationship
              const productDoc = item.product?.value;

              // 2. If the product data is missing for some reason, skip or show fallback
              if (!productDoc) return null;

              // 3. Pass productDoc to your existing helper functions
              const availableWeights = getAvailableWeights(productDoc);
              const selectedVariation = selectedVariations[item.id];
              const variationImage = formatImageUrl(
                item?.product?.value?.productImage?.url,
              );

              console.log(
                formatImageUrl(item?.product?.value?.productImage?.url),
              );

              const isOutOfStock = productDoc.hasVariantOptions
                ? selectedVariation
                  ? !selectedVariation.variantInStock
                  : !productDoc.variants?.some((v) => v.variantInStock)
                : productDoc.inStock === false;

              const stockQuantity = productDoc.hasVariantOptions
                ? selectedVariation
                  ? selectedVariation.variantStockQuantity
                  : productDoc.variants?.[0]?.variantStockQuantity
                : productDoc.stockQuantity;

              const isLowStock =
                !isOutOfStock && stockQuantity > 0 && stockQuantity <= 10;

              return (
                <div
                  className={`${styles.Card} ${isOutOfStock ? styles.Muted : ""}`}
                  key={item.id}
                >
                  <div className={styles.CardTop}>
                    {isLowStock && (
                      <div className={styles.LowStockBadge}>Only few left</div>
                    )}
                    <div
                      className={styles.Remove}
                      onClick={() => handleRemove(item.product.value.id)}
                    >
                      {/* SVG remains the same */}
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <rect
                          width="32"
                          height="32"
                          rx="16"
                          fill="#6C7A5F"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M11.0125 22.4016L9.60156 20.9906L14.6072 15.985L9.60156 11.0125L11.0125 9.60156L16.0181 14.6072L20.9906 9.60156L22.4016 11.0125L17.3959 15.985L22.4016 20.9906L20.9906 22.4016L16.0181 17.3959L11.0125 22.4016Z"
                          fill="#6C7A5F"
                        />
                      </svg>
                    </div>

                    <div
                      className={styles.ImgContainer}
                      onClick={() =>
                        handleProductClick(
                          productDoc?.slug,
                          productDoc?.categories?.slug,
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {getVariationImage(item) ? (
                        <Image
                          src={getVariationImage(item)}
                          alt={productDoc.name || "Product"}
                          className={styles.Img}
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div
                          className={styles.Img}
                          style={{ background: "#f0f0f0" }}
                        />
                      )}
                    </div>
                  </div>

                  <div className={styles.CardMiddle}>
                    <div className={styles.Price}>
                      {/* Pass productDoc to helpers */}
                      <h4>{getVariationPrice(item, productDoc)}</h4>
                      {getRegularPrice(item, productDoc) && (
                        <p>{getRegularPrice(item, productDoc)}</p>
                      )}
                    </div>
                    <div className={styles.line}></div>
                    <div
                      className={styles.TagLine}
                      onClick={() =>
                        handleProductClick(
                          productDoc.slug || "",
                          productDoc.categories?.slug || "",
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <h4>
                        {productDoc.name} {productDoc.tagline}
                      </h4>
                    </div>
                  </div>

                  <div className={styles.CardBottom}>
                    <div className={styles.DesktopActions}>
                      {isOutOfStock ? (
                        <div className={styles.OutOfStockRow}>
                          <button className={styles.OutOfStockBtn} disabled>
                            Out of Stock
                          </button>
                        </div>
                      ) : (
                        <>
                          <AddToCart
                            product={{
                              productId: productDoc.id,
                              variationId: selectedVariation?.id || null,
                              quantity: 1,
                            }}
                          />
                          {(productDoc.hasSimpleSub ||
                            (productDoc.hasVariantOptions &&
                              productDoc.variants?.some(
                                (v) => v.hasVariantSub,
                              ))) && (
                            <button
                              className={styles.Subscribe}
                              onClick={() =>
                                handleOpenSubscribePopup(productDoc)
                              }
                            >
                              Subscribe
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <div className={styles.MobileActions}>
                      {isOutOfStock ? (
                        <div className={styles.OutOfStockRow}>
                          <button className={styles.OutOfStockBtn} disabled>
                            Out of Stock
                          </button>
                        </div>
                      ) : (
                        <BuyNowPopup
                          product={productDoc}
                          getDisplayData={getDisplayData}
                          handleOpenSubscribePopup={handleOpenSubscribePopup}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <SubscriptionPopup
          showSubscribePopup={showSubscribePopup}
          setShowSubscribePopup={setShowSubscribePopup}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          selectedFrequency={selectedFrequency}
          setSelectedFrequency={setSelectedFrequency}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          handleSubscriptionCheckout={handleSubscriptionCheckout}
          getFrequencyLabel={getFrequencyLabel}
          popupRef={popupRef}
          styles={styles}
        />
      </div>
    </div>
  );
};

export default WhislistComponents;
