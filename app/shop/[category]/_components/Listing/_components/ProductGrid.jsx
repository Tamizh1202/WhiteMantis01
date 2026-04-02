import React from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "@/app/_components/AddToCart";
import Wishlist from "@/app/_components/Whishlist";
import BuyNowPopup from "./BuyNowPopup/BuyNowPopup";
import prodZero from "./BuyNowPopup/prodZero.png";
const ProductGrid = ({
  filteredProducts,
  visibleCount,
  handleLoadMore,
  getDisplayData,
  handleOpenSubscribePopup,
  categorySlug,
  currentCategory,
  sortType,
  setSortType,
  sortOpen,
  setSortOpen,
  setIsMobileFiltersOpen,
  resetFilters,
  styles,
}) => {
  return (
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
                className={`${styles.SortArrow} ${
                  sortOpen ? styles.SortArrowOpen : ""
                }`}
              >
                <svg
                  width="13"
                  height="7"
                  viewBox="0 0 13 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0625 6.75L12.1247 0H0.000322342L6.0625 6.75Z"
                    fill="#2F362A"
                  />
                </svg>
              </span>
            </div>
            {sortOpen && (
              <div className={styles.SortDropdown}>
                {["Recommended", "Latest to Oldest", "Oldest to Latest"].map(
                  (item) => (
                    <p
                      key={item}
                      onClick={() => {
                        setSortType(item);
                        setSortOpen(false);
                      }}
                    >
                      {item}
                    </p>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.RightBottom}>
        {filteredProducts.length === 0 ? (
          /* --- ZERO STATE OUTSIDE GRID --- */
          <div className={styles.NoProducts}>
            <Image src={prodZero} alt="No products" width={140} height={150} />
            <div className={styles.NoProductsP}>
              <p style={{ color: "black" }}>Nothing brewing here</p>
              <p>Refine or clear filters to explore available selections.</p>
            </div>
            <button className={styles.zeroButton} onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          /* --- REGULAR CONTENT --- */
          <>
            <div className={styles.ProductsGrid}>
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const displayData = getDisplayData(product);
                const cartProduct = {
                  productId: product.id,
                  variationId: product.hasVariantOptions
                    ? product.variants?.[0]?.id
                    : null,
                  quantity: 1,
                };
                const productUrl = `/shop/${categorySlug}/${product.slug}`;
                const isOutOfStock = product.hasVariantOptions
                  ? !product.variants?.some((v) => v.variantInStock)
                  : product.inStock === false;
                const stockQuantity = product.hasVariantOptions
                  ? product.variants?.[0]?.variantStockQuantity
                  : product.stockQuantity;
                const isLowStock =
                  !isOutOfStock && stockQuantity > 0 && stockQuantity <= 10;
                return (
                  <div className={styles.ProductCard} key={product.id}>
                    <div className={styles.ProductTop}>
                      {isLowStock && (
                        <div className={styles.LowStockBadge}>
                          Only few left
                        </div>
                      )}
                      <div className={styles.WishlistIcon}>
                        <Wishlist product={product} />
                      </div>
                      <Link
                        href={productUrl}
                        className={`${styles.ProductImage} ${isOutOfStock ? styles.Muted : ""}`}
                      >
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
                        {isOutOfStock ? (
                          <div className={styles.OutOfStockRow}>
                            <button className={styles.OutOfStockBtn} disabled>
                              Out of Stock
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className={styles.DesktopActions}>
                              <AddToCart product={cartProduct} />
                              {(product.hasSimpleSub ||
                                (product.hasVariantOptions &&
                                  product.variants?.some(
                                    (v) => v.hasVariantSub,
                                  ))) && (
                                <button
                                  className={styles.Subscribe}
                                  onClick={() =>
                                    handleOpenSubscribePopup(product)
                                  }
                                >
                                  Subscribe
                                </button>
                              )}
                            </div>
                            <div className={styles.MobileActions}>
                              <BuyNowPopup
                                product={product}
                                getDisplayData={getDisplayData}
                                handleOpenSubscribePopup={
                                  handleOpenSubscribePopup
                                }
                              />
                            </div>
                          </>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
