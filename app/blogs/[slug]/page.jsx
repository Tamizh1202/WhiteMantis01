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

  // Scroller State
  const [activeIndex, setActiveIndex] = useState(0);
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

  // Handle Scroll for Mobile Dots
  const handleScroll = () => {
    if (scrollRef.current && window.innerWidth <= 640) {
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollRef.current.scrollLeft / width);
      setActiveIndex(index);
    }
  };

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
        <div className={styles.Header}>
          <h1 className={styles.Title}>Blog Not Found</h1>
          <Link href="/blogs" className={styles.ReadMoreBtn}>
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  console.log("Blog Data:", blog);

  const imageUrl = formatImageUrl(blog.featuredImage);

  return (
    <main className={styles.Main}>
      <header className={styles.Header}>
        <h1 className={styles.Title}>{blog.title}</h1>
<<<<<<< HEAD
        <div className={styles.Date}>
=======
        <div className={styles.HeaderDate}>
>>>>>>> dd104d0 (latest changes)
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </header>

      <div className={styles.FeaturedImageWrapper}>
        <Image
          src={imageUrl}
          alt={blog.featuredImage?.alt || blog.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <article className={styles.ContentWrapper}>
        {/* Rendering the Lexical JSON content from Payload */}
        <RichText content={blog.content} />
      </article>

      {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
        <section className={styles.RelatedSection}>
          <h2 className={styles.SectionTitle}>Explore More Blogs</h2>

          <div
            className={styles.BlogGrid}
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {blog.relatedBlogs.map((relatedBlog) => (
              <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const RelatedBlogCard = ({ blog }) => {
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
        <div className={styles.underline}>
          <h3 className={styles.CardTitle}>{blog.title}</h3>
        </div>
        <div className={styles.minute}>
          <span>Process Mastery | {blog.readTime || 5} Minutes</span>
        </div>
        <hr className={styles.Separator} />
        <div className={styles.CardFooter}>
          <span className={styles.DateText}>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Link href={`/blogs/${blog.slug}`} className={styles.ReadMoreBtn}>
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogInternalPage;
