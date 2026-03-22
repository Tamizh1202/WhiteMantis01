"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "../../Blogs.module.css";
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogsLanding = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setVisibleCount(mobile ? 3 : 6);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const currentTime = new Date().toISOString();
        const response = await axiosClient.get(
          `/api/blogs?where[and][0][_status][equals]=published&where[and][1][or][0][scheduledFor][less_than_equal]=${currentTime}&where[and][1][or][1][scheduledFor][exists]=false&limit=100&sort=-createdAt`,
        );
        setBlogs(response.data.docs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter logic: prefer isFeatured blogs; fall back to first 3 regular blogs
  const markedFeatured = blogs.filter((blog) => Boolean(blog.isFeatured)).slice(0, 3);
  const featuredBlogs = markedFeatured.length > 0 ? markedFeatured : blogs.slice(0, 3);

  // Grid logic: Exclude whichever blogs are used in the featured hero
  const gridBlogs = blogs.filter(
    (blog) => !featuredBlogs.find((fb) => fb.id === blog.id),
  );

  // Timer Logic: Change the featured blog every 3 seconds
  useEffect(() => {
    if (featuredBlogs.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredBlogs.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000); // 3 seconds

    return () => clearInterval(timer);
  }, [featuredBlogs.length]);

  if (loading) {
    return (
      <div className={styles.LoaderWrapper}>
        <Image
          src="/White-mantis-green-loader.gif"
          alt="Loading blogs"
          width={120}
          height={120}
          unoptimized
        />
      </div>
    );
  }

  const currentBlog = featuredBlogs[currentIndex];

  return (
    <div className={styles.Main}>
      <section className={`${styles.HeroSection} ${featuredBlogs.length === 0 ? styles.HeroNoCard : ""}`}>
        <h1 className={styles.HeroTitle}>The Mantis Journal</h1>
        {featuredBlogs.length > 0 && (
          <div className={styles.StaticHeroWrapper}>
            <div className={styles.HeroCard}>
              <div className={styles.HeroImageWrapper}>
                <Image
                  src={formatImageUrl(currentBlog.featuredImage)}
                  alt={currentBlog.featuredImage?.alt || currentBlog.title}
                  fill
                  className={styles.HeroImage}
                  priority
                  key={currentBlog.id}
                />
              </div>
              <div className={styles.HeroContent}>
                <div className={styles.MetaRow}>
                  <span>{currentBlog.readTime || 5} Minutes</span>
                </div>
                <h2 className={styles.HeroBlogTitle}>{currentBlog.title}</h2>
                <p className={styles.HeroExcerpt}>
                  {currentBlog.meta?.description ||
                    "Dive deep into the science behind our beans."}
                </p>
                <span className={styles.DateText}>
                  {new Date(currentBlog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <Link href={`/blogs/${currentBlog.slug}`}>
                  <button className={styles.ReadMoreBtn}>Read more</button>
                </Link>
                <div className={styles.HeroDots}>
                  {featuredBlogs.map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.Dot} ${currentIndex === index ? styles.DotActive : ""}`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        className={`${styles.GridSection} ${featuredBlogs.length === 0 ? styles.NoHero : ""}`}
      >
        <div className={styles.SectionHeader}>
          <h2 className={styles.SectionTitle}>Latest Blogs</h2>
        </div>
        <div className={styles.lowersec}>
          {gridBlogs && gridBlogs.length > 0 ? (
            <>
              <div className={styles.BlogGrid}>
                {gridBlogs.slice(0, visibleCount).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
              {visibleCount < gridBlogs.length && (
                <div className={styles.ViewMoreWrapper}>
                  <button
                    className={styles.ViewMoreBtn}
                    onClick={() => setVisibleCount((prev) => prev + (isMobile ? 3 : 6))}
                  >
                    View more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.EmptyGridState}>
              <div className={styles.EmptyIcon}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="28" cy="28" r="27" stroke="#6C7A5F" strokeWidth="1.5"/>
                  <path d="M28 16C22 16 17 21 17 27C17 33 22 38 28 38C34 38 39 33 39 27" stroke="#6C7A5F" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M28 16C28 16 33 20.5 33 27C33 31.5 30.5 35 28 37" stroke="#6C7A5F" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M39 22C39 22 41 21 42 22.5C43 24 41.5 26 39 27" stroke="#6C7A5F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={styles.EmptyBody}>
                <p className={styles.EmptyText}>Brewing stories soon</p>
                <p className={styles.EmptySubText}>
                  Our latest coffee guides and stories will appear here.
                </p>
              </div>
              <button
                className={styles.ShopNow}
                onClick={() => router.push("/shop")}
              >
                Shop Coffee
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const BlogCard = ({ blog }) => {
  const imageUrl = formatImageUrl(blog.featuredImage);
  return (
    <div className={styles.BlogCard}>
      <div className={styles.CardImageWrapper}>
        <Image
          src={imageUrl}
          alt={blog.featuredImage?.alt || blog.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.CardContent}>
        <div className={styles.head}>
          <h3 className={styles.CardTitle}>{blog.title}</h3>
        </div>
        <hr className={styles.Separator} />
        <div className={styles.MetaRow}>
          <span>Process Mastery | {blog.readTime || 5} Minutes</span>
        </div>
        <div className={styles.CardMetaBottom}>
          <span className={styles.CardDate}>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Link href={`/blogs/${blog.slug}`}>
            <button className={styles.ReadMoreBtn}>Read more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogsLanding;
