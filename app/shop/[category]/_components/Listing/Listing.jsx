"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./Lisiting.module.css";
import Image from "next/image";
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";
import FilterSidebar from "./_components/FilterSidebar";
import ProductGrid from "./_components/ProductGrid";
import SubscriptionPopup from "./_components/SubscriptionPopup";

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
  const [selectedQuantity, setSelectedQuantity] = useState(2);

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
          "id",
          "name",
          "slug",
          "description",
          "tagline",
          "tastingNotes",
          "productImage",
          "regularPrice",
          "salePrice",
          "hasVariantOptions",
          "variants",
          "hasSimpleSub",
          "subFreq",
          "subscriptionDiscount",
          "subCategories",
          "createdAt",
          "inStock",
          "stockQuantity",
        ];
        const productSelectQuery = productFields
          .map((f) => `select[${f}]=true`)
          .join("&");

        // 1. Fetch Products and Subcategories in parallel using the slug directly
        const [prodRes, subCatRes] = await Promise.all([
          axiosClient.get(
            `/api/web-products?where[categories.slug][equals]=${categorySlug}&limit=0&${productSelectQuery}`,
          ),
          axiosClient.get(
            `/api/web-sub-categories?where[parentCategory.slug][equals]=${categorySlug}&depth=1&select[level1]=true&select[parentCategory]=true`,
          ),
        ]);

        const products = prodRes.data.docs || [];
        const subCats = subCatRes.data.docs?.[0] || null;

        setAllProducts(products);
        setSubCategoriesData(subCats);

        // Get category title from the subcategory's parentCategory field if available,
        // or fallback to capitalized slug
        const categoryData = subCats?.parentCategory;
        setCurrentCategory(
          categoryData || {
            title: categorySlug.replace(/-/g, " ").toUpperCase(),
          },
        );

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
        if (!product.subCategories || !Array.isArray(product.subCategories))
          return false;

        // Product is kept if it has ANY of the selected sub-category IDs
        return product.subCategories.some(
          (sub) =>
            selectedSubCatIds.includes(sub.level1Id) ||
            selectedSubCatIds.includes(sub.level2Id) ||
            selectedSubCatIds.includes(sub.level3Id),
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
    let imageSrc = formatImageUrl(product.productImage);
    let variationId = null;

    // If variants exist, prioritize the first variant for listing view (or logic as needed)
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

  // Subscription Handlers updated for WebProducts schema
  const handleOpenSubscribePopup = (product) => {
    let subFreqs = [];
    let discount = 0;

    if (product.hasVariantOptions && product.variants?.length > 0) {
      // For simplicity in listing, use the first variant that has subscription enabled
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

    setSelectedQuantity(2); // Default to 2 bags as per updated list
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
          <FilterSidebar
            subCategoriesData={subCategoriesData}
            selectedSubCatIds={selectedSubCatIds}
            handleToggleCategory={handleToggleCategory}
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            styles={styles}
          />
        </div>

        {/* Right Product Section */}
        <ProductGrid
          filteredProducts={filteredProducts}
          visibleCount={visibleCount}
          handleLoadMore={handleLoadMore}
          getDisplayData={getDisplayData}
          handleOpenSubscribePopup={handleOpenSubscribePopup}
          categorySlug={categorySlug}
          currentCategory={currentCategory}
          sortType={sortType}
          setSortType={setSortType}
          sortOpen={sortOpen}
          setSortOpen={setSortOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          styles={styles}
        />

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

              <FilterSidebar
                subCategoriesData={subCategoriesData}
                selectedSubCatIds={selectedSubCatIds}
                handleToggleCategory={handleToggleCategory}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                styles={styles}
              />
            </div>
          </>
        )}

        {/* Subscription Popup */}
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

export default Lisiting;
