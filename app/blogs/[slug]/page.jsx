"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";
import RichText from "../_components/RichText/RichText";
import styles from "./BlogInternal.module.css";

const BlogInternalPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/api/blogs?where[slug][equals]=${slug}`,
        );

        if (response.data.docs && response.data.docs.length > 0) {
          setBlog(response.data.docs[0]);
        } else {
          console.error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.LoaderWrapper}>
        <Image
          src="/White-mantis-green-loader.gif"
          alt="Loading blog"
          width={100}
          height={100}
          unoptimized
        />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.Main}>
        <nav className={styles.Breadcrumb}>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/blogs">Blogs</Link>
          <span>›</span>
          <span>{blog.title}</span>
        </nav>
        <div className={styles.Header}>
          <h1 className={styles.Title}>Blog Not Found</h1>
          <Link href="/blogs" className={styles.ReadMoreBtn}>
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = formatImageUrl(blog.featuredImage);

  return (
    <main className={styles.Main}>
      <nav className={styles.Breadcrumb}>
        <Link href="/">Home</Link>
        <span><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "translateY(1px)" }}>
          <path d="M0.946166 12.8717L0 11.9255L5.48967 6.43583L0 0.946167L0.946166 0L7.382 6.43583L0.946166 12.8717Z" fill="#6C7A5F" />
        </svg>
        </span>
        <Link href="/blogs">Blogs</Link>
        <span><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "translateY(1px)" }}>
          <path d="M0.946166 12.8717L0 11.9255L5.48967 6.43583L0 0.946167L0.946166 0L7.382 6.43583L0.946166 12.8717Z" fill="#6C7A5F" />
        </svg>
        </span>
        <span>{blog.title}</span>
      </nav>
      <header className={styles.Header}>

        <h1 className={styles.Title}>{blog.title}</h1>
        <div className={styles.HeaderDate}>
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </header>

      {/* Image left + Sidebar right — same row */}
      <div className={styles.ImageRow}>
        <div className={styles.FeaturedImageWrapper}>
          <Image
            src={imageUrl}
            alt={blog.featuredImage?.alt || blog.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
          <aside className={styles.RelatedSection}>
            <h2 className={styles.SectionTitle}>Explore More Blogs</h2>

            <div className={styles.BlogGrid} ref={scrollRef}>
              {blog.relatedBlogs.map((relatedBlog) => (
                <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>

            <Link href="/blogs" className={styles.ViewMoreBtn}>
              View more
            </Link>
          </aside>
        )}
      </div>

      {/* Article content below the image row */}
      <article className={styles.ContentWrapper}>
        <RichText content={blog.content} />
      </article>
      <div className={styles.mobileView}>{blog.relatedBlogs?.length > 0 && (
        <div className={styles.mobileView}>
          <div className={styles.RelatedSectionMobile}>
            <h2 className={styles.SectionTitleMobile}>Explore More Blogs</h2>
            <div className={styles.BlogGridMobile}>
              {blog.relatedBlogs.map((relatedBlog) => (
                <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </div>
      )}</div>
    </main>
  );
};

const RelatedBlogCard = ({ blog }) => {
  const imageUrl = formatImageUrl(blog.featuredImage);

  return (
    <Link href={`/blogs/${blog.slug}`} className={styles.BlogCard}>
      <div className={styles.CardImageWrapper}>
        <Image
          src={imageUrl}
          alt={blog.featuredImage?.alt || blog.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.CardContent}>
        <span className={styles.ReadTime}>
          {blog.readTime || 5} Minutes Read
        </span>
        <h3 className={styles.CardTitle}>{blog.title}</h3>
        <span className={styles.DateText}>
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
};

export default BlogInternalPage;