"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./Lisiting.module.css";
import Image from "next/image";
import Link from "next/link";
import Wishlist from "../../../../_components/Whishlist";
import AddToCart from "../../../../_components/AddToCart";
import axiosClient from "@/lib/axios";

const Lisiting = () => {
  const params = useParams();
  const categorySlug = params.category;
  const ITEMS_PER_LOAD = 6;

  // 1. Data State (Functionality)
  const [currentCategory, setCurrentCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [subCategoriesData, setSubCategoriesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const popupRef = useRef(null);


  // 2. UI/Filter State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [sortType, setSortType] = useState("Recommended");
  const [selectedSubCatIds, setSelectedSubCatIds] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const [sortOpen, setSortOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Subscription Popup State
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedSubWeight, setSelectedSubWeight] = useState(null);

  // UI Ref for Mobile Filters
  const mobileFiltersRef = useRef(null);
  const router = useRouter();

  // 3. Fetch Data Dynamically using axiosClient and slug-based filtering
  useEffect(() => {
    async function fetchData() {
      if (!categorySlug) return;
      setIsLoading(true);
      try {
        // Field selection for products
        const productFields = [
          "id", "name", "slug", "description", "tagline", "tastingNotes", "productImage",
          "regularPrice", "salePrice", "hasVariantOptions", "variants", "hasSimpleSub",
          "subFreq", "subscriptionDiscount", "subCategories", "createdAt"
        ];
        const productSelectQuery = productFields.map(f => `select[${f}]=true`).join("&");

        // 1. Fetch Products and Subcategories in parallel using the slug directly
        const [prodRes, subCatRes] = await Promise.all([
          axiosClient.get(`/api/web-products?where[categories.slug][equals]=${categorySlug}&limit=0&${productSelectQuery}`),
          axiosClient.get(`/api/web-sub-categories?where[parentCategory.slug][equals]=${categorySlug}&depth=1&select[level1]=true&select[parentCategory]=true`)
        ]);

        const products = prodRes.data.docs || [];
        const subCats = subCatRes.data.docs?.[0] || null;

        setAllProducts(products);
        setSubCategoriesData(subCats);

        // Get category title from the subcategory's parentCategory field if available, 
        // or fallback to capitalized slug
        const categoryData = subCats?.parentCategory;
        setCurrentCategory(categoryData || { title: categorySlug.replace(/-/g, ' ').toUpperCase() });

        // Initialize openMenus state for level1 items
        const initOpen = {};
        if (subCats?.level1) {
          subCats.level1.forEach((l1) => {
            initOpen[l1.slug] = false;
          });
        }
        setOpenMenus(initOpen);

      } catch (err) {
        console.error("Error fetching shop data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);
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

  // 4. FRONTEND ONLY: Filter & Sort logic (Functionality)
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Sub-Category Filter logic based on the subCategories JSON field
    if (selectedSubCatIds.length > 0) {
      result = result.filter((product) => {
        if (!product.subCategories || !Array.isArray(product.subCategories)) return false;

        // Product is kept if it has ANY of the selected sub-category IDs
        return product.subCategories.some(sub =>
          selectedSubCatIds.includes(sub.level1Id) ||
          selectedSubCatIds.includes(sub.level2Id) ||
          selectedSubCatIds.includes(sub.level3Id)
        );
      });
    }

    // Sorting
    if (sortType === "Latest to Oldest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortType === "Oldest to Latest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return result;
  }, [allProducts, selectedSubCatIds, sortType]);
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFiltersOpen]);

  // 5. Handlers
  const handleToggleCategory = (id) => {
    setSelectedSubCatIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return newSelection;
    });
    setVisibleCount(ITEMS_PER_LOAD); // Reset scroll position on filter
  };

  const toggleMenu = (slug) => {
    setOpenMenus((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  };

  // Helper to get display data from WebProducts schema
  const getDisplayData = (product) => {
    let price = product.regularPrice;
    let salePrice = product.salePrice;
    let imageSrc = product.productImage?.url || product.productImage;

    // If variants exist, prioritize the first variant for listing view (or logic as needed)
    if (product.hasVariantOptions && product.variants?.length > 0) {
      const firstVariant = product.variants[0];
      price = firstVariant.variantRegularPrice;
      salePrice = firstVariant.variantSalePrice;
      imageSrc = firstVariant.variantImage?.url || firstVariant.variantImage;
    }

    return {
      price: salePrice || price,
      regular_price: price,
      sale_price: salePrice,
      image: imageSrc,
    };
  };

  // Subscription Handlers updated for WebProducts schema
  const handleOpenSubscribePopup = (product) => {
    let subFreqs = [];
    let discount = 0;

    if (product.hasVariantOptions && product.variants?.length > 0) {
      // For simplicity in listing, use the first variant that has subscription enabled
      const subVariant = product.variants.find(v => v.hasVariantSub) || product.variants[0];
      subFreqs = subVariant.subFreq || [];
      discount = subVariant.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: product,
        variant: subVariant,
        isVariant: true,
        discount,
        subFreqs
      });
    } else {
      subFreqs = product.subFreq || [];
      discount = product.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: product,
        isVariant: false,
        discount,
        subFreqs
      });
    }

    if (subFreqs.length > 0) {
      setSelectedFrequency(subFreqs[0]);
    }

    setShowSubscribePopup(true);
  };

  const handleSubscriptionCheckout = () => {
    if (!selectedProduct || !selectedFrequency) {
      console.error("Please select a frequency");
      return;
    }

    // Navigate to checkout with subscription parameters
    const params = new URLSearchParams({
      mode: "subscription",
      productId: selectedProduct.parent.id,
      variantId: selectedProduct.isVariant ? selectedProduct.variant.id : "",
      duration: selectedFrequency.duration.toString(),
      interval: selectedFrequency.interval,
    });

    router.push(`/checkout?${params.toString()}`);
  };

  const getFrequencyLabel = (freq) => {
    if (!freq) return "";
    const plural = freq.duration > 1 ? "s" : "";
    return `Every ${freq.duration} ${freq.interval}${plural}`;
  };

  // Render Categories Recursive Helper (UI)
  function renderCategoriesRecursive(levels, parentId) {
    if (!levels || !Array.isArray(levels) || levels.length === 0)
      return null;

    return levels.map((item) => {
      const hasChildren = (item.level2 && item.level2.length > 0) || (item.level3 && item.level3.length > 0);
      const itemId = item.id;

      if (hasChildren) {
        return (
          <div key={item.slug} className={styles.FilterBox}>
            <div
              className={styles.FilterHeader}
              onClick={() => toggleMenu(item.slug)}
            >
              <h5>{item.name}</h5>
              {openMenus[item.slug] ? <span>✕</span> : <span>▾</span>}
            </div>
            <div
              className={`${styles.AnimatedBox} ${openMenus[item.slug] ? styles.open : ""
                }`}
            >
              <div className={styles.FilterOptions}>
                {renderCategoriesRecursive(item.level2 || item.level3, itemId)}
              </div>
            </div>
          </div>
        );
      }

      return (
        <label key={item.slug}>
          <input
            type="checkbox"
            checked={selectedSubCatIds.includes(itemId)}
            onChange={() => handleToggleCategory(itemId)}
          />
          {item.name}
        </label>
      );
    });
  }

  // Outside click for mobile filters (UI - Preserved)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileFiltersRef.current &&
        !mobileFiltersRef.current.contains(e.target)
      ) {
        setIsMobileFiltersOpen(false);
      }
    };
    if (isMobileFiltersOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileFiltersOpen]);

  if (isLoading) {
    return (
      <div className={styles.LoaderWrapper}>
        <Image
          src="/White-mantis-green-loader.gif"
          alt="Loading products"
          width={120}
          height={120}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>
        {/* Sidebar Filters */}
        <div className={styles.LeftConatiner}>
          <div className={styles.LeftTop}>
            <p>Filter</p>
          </div>
          <div className={styles.LeftBottom}>
            {subCategoriesData && renderCategoriesRecursive(subCategoriesData.level1)}
          </div>
        </div>

        {/* Right Product Section */}
        <div className={styles.RightConatiner}>
          <div className={styles.RightTop}>
            <div className={styles.RightTopLeft}>
              <div className={styles.CatName}>
                <h3>{currentCategory?.title || "Shop"}</h3>
              </div>
              <div className={styles.CatCount}>
                <p>({filteredProducts.length} items)</p>
              </div>
            </div>

            <div className={styles.RightTopRight}>
              <button
                className={styles.MobileFilterBtn}
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66667 8V6.66667H7.33333V8H4.66667ZM2 4.66667V3.33333H10V4.66667H2ZM0 1.33333V0H12V1.33333H0Z"
                    fill="#6E736A"
                  />
                </svg>
                Filter
              </button>

              <div className={styles.SortBy}>
                <p>Sort by:</p>
              </div>
              <div className={styles.SortWrapper}>
                <div
                  className={styles.SortOptions}
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  <p>{sortType}</p>
                  <span
                    className={`${styles.SortArrow} ${sortOpen ? styles.SortArrowOpen : ""
                      }`}
                  >
                    ▼
                  </span>
                </div>
                {sortOpen && (
                  <div className={styles.SortDropdown}>
                    {[
                      "Recommended",
                      "Latest to Oldest",
                      "Oldest to Latest",
                    ].map((item) => (
                      <p
                        key={item}
                        onClick={() => {
                          setSortType(item);
                          setSortOpen(false);
                        }}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.RightBottom}>
            <div className={styles.ProductsGrid}>
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const displayData = getDisplayData(product);

                // Format product data for AddToCart (Functionality)
                const cartProduct = {
                  product_id: product.id,
                  variation_id: product.hasVariantOptions ? product.variants?.[0]?.id : null,
                  name: product.name,
                  image: displayData.image,
                  description: product.description,
                  quantity: 1,
                  tagline: product.tagline,
                };

                /* --------- SEO SLUG + ID --------- */
                const productUrl = `/shop/${categorySlug}/${product.slug}-${product.id}`;

                return (
                  <div className={styles.ProductCard} key={product.id}>
                    <div className={styles.ProductTop}>
                      {/* <div className={styles.WishlistIcon}>
                        <Wishlist product={product} />
                      </div> */}
                      <Link href={productUrl} className={styles.ProductImage}>
                        {displayData.image ? (
                          <Image
                            src={displayData.image}
                            alt={product.name}
                            width={300}
                            height={300}
                          />
                        ) : (
                          <div className={styles.NoImage}>No Image</div>
                        )}
                      </Link>
                    </div>

                    <div className={styles.ProductBottom}>
                      <Link
                        href={productUrl}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className={styles.ProductInfo}>
                          <div className={styles.ProductPrice}>
                            <h4>AED {displayData.price}</h4>
                            {displayData.sale_price &&
                              displayData.sale_price !==
                              displayData.regular_price && (
                                <p className={styles.OldPrice}>
                                  AED {displayData.regular_price}
                                </p>
                              )}
                          </div>
                          <div className={styles.Line}></div>
                          <div className={styles.ProductName}>
                            <h3>{`${product.name} ${product.tagline || ""}`}</h3>
                            <p>{product.tastingNotes}</p>
                          </div>
                        </div>
                      </Link>
                      <div className={styles.ProductActions}>
                        <AddToCart product={cartProduct} />
                        {/* Subscribe button with popup functionality - only show if subscription product exists */}
                        {(product.hasSimpleSub || (product.hasVariantOptions && product.variants?.some(v => v.hasVariantSub))) && (
                          <button
                            className={styles.Subscribe}
                            onClick={() => handleOpenSubscribePopup(product)}
                          >
                            Subscribe
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className={styles.LoadMore}>
                <button className={styles.LoadMoreCta} onClick={handleLoadMore}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>

        {isMobileFiltersOpen && (
          <>
            {/* Background overlay */}
            <div
              className={styles.MobileFilterOverlay}
              onClick={() => setIsMobileFiltersOpen(false)}
            />

            {/* Filter drawer */}
            <div className={styles.MobileFilters} ref={mobileFiltersRef}>
              <div className={styles.MobileFilterHeader}>
                <p>Filters</p>
                <span onClick={() => setIsMobileFiltersOpen(false)}>✕</span>
              </div>

              <div className={styles.LeftBottom}>
                {subCategoriesData && renderCategoriesRecursive(subCategoriesData.level1)}
              </div>
            </div>
          </>
        )}

        {/* Subscription Popup */}
        {showSubscribePopup && selectedProduct && (
          <div className={styles.PopupOverlay}>
            <div className={styles.Popup} ref={popupRef}>
              <button
                className={styles.PopupClose}
                onClick={() => setShowSubscribePopup(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <h3>SUBSCRIPTION OPTIONS</h3>

              {/* Variant Selection (e.g. Size/Bag Amount if they are variants) */}
              {selectedProduct.parent.hasVariantOptions && (
                <div className={styles.SubscriptionSection}>
                  <h4>Selection</h4>
                  <div className={styles.FrequencyOptions}>
                    {selectedProduct.parent.variants.map((v) => (
                      <button
                        key={v.id}
                        className={
                          selectedProduct.variant?.id === v.id
                            ? styles.ActiveFrequency
                            : styles.FrequencyBtn
                        }
                        onClick={() => setSelectedProduct({
                          ...selectedProduct,
                          variant: v,
                          discount: v.subscriptionDiscount || 0,
                          subFreqs: v.subFreq || []
                        })}
                      >
                        {v.variantName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.SubscriptionSection}>
                <h4>Frequency</h4>
                <div className={styles.FrequencyOptions}>
                  {selectedProduct.subFreqs?.map((freq, idx) => (
                    <button
                      key={idx}
                      className={
                        selectedFrequency === freq
                          ? styles.ActiveFrequency
                          : styles.FrequencyBtn
                      }
                      onClick={() => setSelectedFrequency(freq)}
                    >
                      {getFrequencyLabel(freq)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.PopupActions}>
                <button
                  onClick={handleSubscriptionCheckout}
                  className={styles.PopupConfirm}
                >
                  Subscribe – Save {selectedProduct.discount}%
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lisiting;
