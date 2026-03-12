"use client";
import React, { useState, useEffect } from "react";
import { useWishlist } from "../../../../_context/WishlistContext";
import AddToCart from "@/app/_components/AddToCart";
import styles from "./WhislistComponents.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatImageUrl } from "@/lib/imageUtils";

const WhislistComponents = () => {
  const { items: wishlistData, loading, remove } = useWishlist();
  const router = useRouter();
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

  // Initialize default selections when wishlist data loads
  useEffect(() => {
    if (wishlistData.length > 0) {
      const initialSelections = {};
      wishlistData.forEach((item) => {
        if (item.children?.[0]?.variation_options?.length > 0) {
          // Set first variation as default
          initialSelections[item.id] = item.children[0].variation_options[0];
        }
      });
      setSelectedVariations(initialSelections);
    }
  }, [wishlistData]);

  const handleRemove = async (productId) => {
    console.log("Deleting ID:", productId); // Use the variable 'id' passed in
    await remove(productId);
  };

  const handleProductClick = (slug) => {
    router.push(`/product/${slug}`);
  };
  console.log('initial data', wishlistData)
  const handleWeightChange = (productId, weight) => {
    const product = wishlistData.find((item) => item.id === productId);
    if (product?.children?.[0]?.variation_options) {
      const variation = product.children[0].variation_options.find(
        (v) => v.attributes.attribute_pa_weight === weight
      );
      if (variation) {
        setSelectedVariations((prev) => ({
          ...prev,
          [productId]: variation,
        }));
      }
    }
  };


  const getVariationImage = (item) => {
    const selectedVariation = selectedVariations[item.id];
    if (selectedVariation?.image) {
      return selectedVariation.image;
    }
    // Fallback to first variation image or parent image
    return item.children?.[0]?.variation_options?.[0]?.image || item.image;
  };

  const getVariationPrice = (item, productDoc) => {
    // 1. Check if a variation is selected using the Wishlist Item ID
    const selectedVariation = selectedVariations[item.id];

    if (selectedVariation?.price) {
      return `AED ${parseFloat(selectedVariation.price).toFixed(2)}`;
    }

    // 2. Fallback to productDoc prices (Payload CMS uses regularPrice / salePrice)
    // Logic: Use salePrice if it exists, otherwise use regularPrice
    const price = productDoc?.salePrice || productDoc?.regularPrice || 0;

    return `AED ${parseFloat(price).toFixed(2)}`;
  };

  const getRegularPrice = (item, productDoc) => {
    const selectedVariation = selectedVariations[item.id];

    if (selectedVariation) {
      const regular = selectedVariation.regular_price;
      const sale = selectedVariation.sale_price;
      if (regular && sale && parseFloat(regular) > parseFloat(sale)) {
        return `AED ${parseFloat(regular).toFixed(2)}`;
      }
    }

    // Fallback: If product has a sale, show the original regularPrice as the strikethrough
    if (productDoc?.salePrice && productDoc?.regularPrice) {
      if (parseFloat(productDoc.regularPrice) > parseFloat(productDoc.salePrice)) {
        return `AED ${parseFloat(productDoc.regularPrice).toFixed(2)}`;
      }
    }

    return null;
  };
  const getAvailableWeights = (item) => {
    if (!item.children?.[0]?.variation_options) return [];

    return item.children[0].variation_options.map((variation) => ({
      label: variation.attributes.attribute_pa_weight,
      variation: variation,
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
            <p className={styles.EmptyText}>Your wish list is empty.</p>
            <p className={styles.EmptySubText}>
              Explore more and shortlist some items.
            </p>
            <button className={styles.ShopNow} onClick={() => router.push('/shop')}>
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
              const variationImage = formatImageUrl(item?.product?.value?.productImage?.url)

              console.log(formatImageUrl(item?.product?.value?.productImage?.url))

              return (
                <div className={styles.Card} key={item.id}>
                  <div className={styles.CardTop}>
                    <div
                      className={styles.Remove}
                      onClick={() => handleRemove(item.product.value.id)}
                    >
                      {/* SVG remains the same */}
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="16" fill="#6C7A5F" fillOpacity="0.2" />
                        <path d="M11.0125 22.4016L9.60156 20.9906L14.6072 15.985L9.60156 11.0125L11.0125 9.60156L16.0181 14.6072L20.9906 9.60156L22.4016 11.0125L17.3959 15.985L22.4016 20.9906L20.9906 22.4016L16.0181 17.3959L11.0125 22.4016Z" fill="#6C7A5F" />
                      </svg>
                    </div>

                    <div
                      className={styles.ImgContainer}
                      onClick={() => handleProductClick(productDoc.slug)}
                      style={{ cursor: 'pointer' }}
                    >
                      {variationImage ? (
                        <Image
                          src={formatImageUrl(item?.product?.value?.productImage?.url)}
                          alt={productDoc.name || "Product"}
                          className={styles.Img}
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className={styles.Img} style={{ background: '#f0f0f0' }} />
                      )}
                    </div>
                  </div>

                  <div className={styles.CardMiddle}>
                    <div className={styles.Price}>
                      {/* Pass productDoc to helpers */}
                      <h4>{getVariationPrice(item, productDoc)}</h4>
                      {getRegularPrice(item, productDoc) && <p>{getRegularPrice(item, productDoc)}</p>}
                    </div>
                    <div className={styles.line}></div>
                    <div
                      className={styles.TagLine}
                      onClick={() => handleProductClick(productDoc.slug)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h4>{productDoc.name}</h4>
                    </div>

                    {availableWeights.length > 0 && (
                      <div className={styles.WeightSelector}>
                        <select
                          value={selectedVariation?.attributes?.attribute_pa_weight || ''}
                          onChange={(e) => handleWeightChange(item.id, e.target.value)}
                          className={styles.WeightDropdown}
                        >
                          {availableWeights.map((w) => (
                            <option key={w.label} value={w.label}>
                              {w.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className={styles.CardBottom}>
                    <AddToCart
                      product={{
                        productId: productDoc.id,
                        variationId: selectedVariation?.id,
                        quantity: 1,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhislistComponents;