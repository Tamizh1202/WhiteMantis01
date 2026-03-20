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
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/web-products?where[and][0][slug][equals]=${selectedSlug}&where[and][1][_status][equals]=published&where[and][2][categories.slug][equals]=${selectedCategory}`,
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

    console.log("product", product);

    if (!product) {
      console.warn(`Product not found for slug: ${slug}`);
      redirect("/shop");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    redirect("/shop");
  }

  // ---------- FETCH GROUPED CHILD PRODUCTS ----------

  // ---------- RENDER ----------
  return (
    <div>
      <ProductImageProvider>
        {/* <TopNavigation /> */}
        <ProductMain product={product} />
        <VideoSection product={product} />
        <Crafting product={product} />
        <BannerSection />
        <Recommendation product={product.recommendedProducts} />
        <StickyBar product={product} />
      </ProductImageProvider>
    </div>
  );
}
