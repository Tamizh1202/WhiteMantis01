"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatImageUrl } from "@/lib/imageUtils";
import styles from "./BlogInternal.module.css";

const RelatedBlogsClient = ({ relatedBlogs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current && window.innerWidth <= 640) {
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollRef.current.scrollLeft / width);
      setActiveIndex(index);
    }
  };

  if (!relatedBlogs || relatedBlogs.length === 0) return null;

  return (
    <section className={styles.RelatedSection}>
      <h2 className={styles.SectionTitle}>Explore More Blogs</h2>
      <div className={styles.BlogGrid} ref={scrollRef} onScroll={handleScroll}>
        {relatedBlogs.map((relatedBlog) => (
          <RelatedBlogCard
            key={relatedBlog.id}
            blog={relatedBlog}
            styles={styles}
          />
        ))}
      </div>
    </section>
  );
};

const RelatedBlogCard = ({ blog, styles }) => {
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
            Read more <svg
                  width="9"
                  height="9"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1H11V9.59L1.41 0L0 1.41L9.59 11H1V13H13V1Z"
                    fill="#6C7A5F"
                  />
                </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedBlogsClient;
