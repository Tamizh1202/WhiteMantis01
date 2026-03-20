"use client";
import React, { useCallback, useState, useEffect } from "react";
import styles from "./Coffees.module.css";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";

const Coffees = ({ category }) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });
  useEffect(() => {
    async function fetchProducts() {
      if (!category?.slug) return;
      setIsLoading(true);
      try {
        const productFields = [
          "id",
          "name",
          "slug",
          "description",
          "tagline",
          "productImage",
          "createdAt",
          "tastingNotes",
        ];
        const productSelectQuery = productFields
          .map((f) => `select[${f}]=true`)
          .join("&");

        const res = await axiosClient.get(
          `/api/web-products?where[categories.slug][equals]=${category.slug}&limit=5&${productSelectQuery}`,
        );
        setProducts(res.data.docs || []);
      } catch (err) {
        console.error("Error fetching products for Coffees carousel:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  console.log(products);

  useEffect(() => {
    if (!emblaApi) return;

    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateButtons();

    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, products]); // Re-init embla when products load

  const scrollPrev = useCallback(() => {
    if (!emblaApi || !canScrollPrev) return;
    emblaApi.scrollPrev();
  }, [emblaApi, canScrollPrev]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || !canScrollNext) return;
    emblaApi.scrollNext();
  }, [emblaApi, canScrollNext]);

  if (isLoading && products.length === 0) {
    return (
      <div className={styles.Main}>
        <div
          className={styles.MainContainer}
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Image
            src="/White-mantis-green-loader.gif"
            alt="Loading products"
            width={120}
            height={120}
            unoptimized
          />
        </div>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return null; // Or show nothing if no products
  }

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.Left}>
          <div className={styles.LeftTop}>
            <h3>{category?.title || "Selected coffees"}</h3>
            <p>
              The White Mantis coffee experience, delivered seamlessly to your
              door. Subscribe for a never-ending supply of excellence.
            </p>
          </div>

          <div className={styles.LeftBottom}>
            <svg
              onClick={scrollPrev}
              style={{
                opacity: canScrollPrev ? 1 : 0.4,
                cursor: canScrollPrev ? "pointer" : "not-allowed",
              }}
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="23.0469" cy="23.0469" r="23.0469" fill="#6C7A5F" />
              <path
                d="M27.9023 32.7578L18.1914 23.0469L27.9023 13.3359"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <svg
              onClick={scrollNext}
              style={{
                opacity: canScrollNext ? 1 : 0.4,
                cursor: canScrollNext ? "pointer" : "not-allowed",
              }}
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="23.0469" cy="23.0469" r="23.0469" fill="#6C7A5F" />
              <path
                d="M18.1914 13.3359L27.9023 23.0469L18.1914 32.7578"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className={styles.Right}>
          <div className={styles.Embla} ref={emblaRef}>
            <div
              className={styles.EmblaContainer}
              style={{ cursor: "pointer" }}
            >
              {products.map((item, index) => (
                <div
                  onClick={() =>
                    router.push(`/shop/${category.slug}/${item.slug}`)
                  }
                  className={styles.EmblaSlide}
                  key={`coffee-${item.id}`}
                >
                  <div className={styles.Card}>
                    <div className={styles.CardTop}>
                      <div className={styles.LinkSvg}>
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="-0.5"
                            width="29"
                            height="29"
                            transform="matrix(1 0 0 -1 0 29)"
                            stroke="#6C7A5F"
                          />
                          <path
                            d="M21.0029 20.2479H19.0039V11.5562L9.41838 21.2598L8.00904 19.8331L17.5945 10.1295H9.00857V8.10583H21.0029V20.2479Z"
                            fill="#6C7A5F"
                          />
                        </svg>
                      </div>

                      <div className={styles.ProductImage}>
                        <Image
                          src={formatImageUrl(item.productImage)}
                          alt={item.name}
                          width={300}
                          height={300}
                        />
                      </div>
                    </div>

                    <div className={styles.CardBottom}>
                      <h3>
                        {item.name} {item.tagline}
                      </h3>
                      <p>{item.tastingNotes || item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.MobileArrows}>
          <svg
            onClick={scrollPrev}
            style={{
              opacity: canScrollPrev ? 1 : 0.4,
              cursor: canScrollPrev ? "pointer" : "not-allowed",
            }}
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="23.0469" cy="23.0469" r="23.0469" fill="#6C7A5F" />
            <path
              d="M27.9023 32.7578L18.1914 23.0469L27.9023 13.3359"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            onClick={scrollNext}
            style={{
              opacity: canScrollNext ? 1 : 0.4,
              cursor: canScrollNext ? "pointer" : "not-allowed",
            }}
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="23.0469" cy="23.0469" r="23.0469" fill="#6C7A5F" />
            <path
              d="M18.1914 13.3359L27.9023 23.0469L18.1914 32.7578"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Coffees;
