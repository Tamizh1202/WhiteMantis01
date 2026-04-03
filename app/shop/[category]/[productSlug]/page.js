// app/.../product/[id]/page.jsx
import React from "react";
import { redirect } from "next/navigation";
import TopNavigation from "./_components/TopNavigation/TopNavigation";
import ProductMain from "./_components/ProductMain/ProductMain";
import VideoSection from "./_components/Landing/VideoSection";
import Crafting from "./_components/Crafting/Crafting";
import Recommendation from "./_components/Recommendation/Recommendation";
import StickyBar from "./_components/StickyBar/StickyBar";
import BannerSection from "./_components/BannerSection/BannerSection";
import { ProductImageProvider } from "./_context/ProductImageContext";

import { formatImageUrl } from "@/lib/imageUtils";

export async function generateMetadata({ params }) {
  const { category, productSlug } = await params;
  const selectedCategory = category?.trim().toLowerCase();
  const selectedSlug = productSlug?.trim().toLowerCase();

  if (!selectedSlug) {
    return {
      title: "Product Not Found | WhiteMantis",
    };
  }

  try {
    const response = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/web-products?where[and][0][slug][equals]=${selectedSlug}&where[and][1][_status][equals]=published&where[and][2][categories.slug][equals]=${selectedCategory}&depth=2`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      const product = json.docs?.[0] || null;

      if (product?.meta) {
        let imageUrl = "";
        if (
          product.meta.image &&
          typeof product.meta.image === "object" &&
          product.meta.image.url
        ) {
          imageUrl = formatImageUrl(product.meta.image);
        } else if (
          product.productImage &&
          typeof product.productImage === "object" &&
          product.productImage.url
        ) {
          imageUrl = formatImageUrl(product.productImage);
        } else if (
          product.variants?.[0]?.variantImage &&
          typeof product.variants[0].variantImage === "object"
        ) {
          imageUrl = formatImageUrl(product.variants[0].variantImage);
        }

        return {
          title: product.meta.title || product.name || "WhiteMantis",
          description: product.meta.description || product.description || "",
          openGraph: {
            title: product.meta.title || product.name || "WhiteMantis",
            description: product.meta.description || product.description || "",
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }
  } catch (err) {
    console.error("Error fetching product meta:", err);
  }

  return {
    title: "WhiteMantis Product",
  };
}

export default async function ProductDetailPage({ params }) {
  const { category, productSlug } = await params;

  const selectedCategory = category.trim().toLowerCase();
  const selectedSlug = productSlug.trim().toLowerCase();

  if (!selectedSlug) {
    redirect("/shop");
  }

  let product = null;

  try {
    const response = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/web-products?where[and][0][slug][equals]=${selectedSlug}&where[and][1][_status][equals]=published&where[and][2][categories.slug][equals]=${selectedCategory}&depth=2`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    product = json.docs?.[0] || null;

    if (!product) {
      console.warn(`Product not found for slug: ${selectedSlug}`);
      redirect("/shop");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    redirect("/shop");
  }

  // ---------- FETCH CATEGORY DATA ----------
  let brewingGuide = null;

  // Try to find brewingGuide in product categories if depth=2 worked
  if (product?.categories && Array.isArray(product.categories)) {
    const matchedCategory = product.categories.find(
      (cat) =>
        (typeof cat === "object" && cat.slug === selectedCategory) ||
        (typeof cat === "object" && cat.slug === category),
    );
    if (matchedCategory?.brewingGuide) {
      console.log("Found brewingGuide in product.categories");
      brewingGuide = matchedCategory.brewingGuide;
    }
  }

  if (!brewingGuide) {
    const serverUrl =
      process.env.PAYLOAD_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      const categoryResponse = await fetch(
        `${serverUrl}/api/web-categories?where[slug][equals]=${selectedCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 },
        },
      );

      if (categoryResponse.ok) {
        const categoryJson = await categoryResponse.json();
        const categoryData = categoryJson.docs?.[0];
        if (categoryData?.brewingGuide) {
          brewingGuide = categoryData.brewingGuide;
        }
      }
    } catch (err) {
      // Fail silently
    }
  }

  // ---------- FETCH GROUPED CHILD PRODUCTS ----------

  // ---------- RENDER ----------
  return (
    <div>
      <ProductImageProvider>
        {/* <TopNavigation /> */}
        <ProductMain product={product} />
        <VideoSection product={product} />
        <Crafting product={product} brewingGuide={brewingGuide} />
        <BannerSection />
        <Recommendation product={product.recommendedProducts} />
        <StickyBar product={product} />
      </ProductImageProvider>
    </div>
  );
}
