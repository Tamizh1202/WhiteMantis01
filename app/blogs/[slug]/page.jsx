"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        // Fetch the blog post by slug
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
      <header className={styles.Header}>
        <h1 className={styles.Title}>{blog.title}</h1>
        <div className={styles.Date}>
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
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
        <RichText content={blog.content} />
      </article>

      {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
        <section className={styles.RelatedSection}>
          <h2 className={styles.SectionTitle}>Related Articles</h2>
          <div className={styles.BlogGrid}>
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
        <h3 className={styles.CardTitle}>{blog.title}</h3>
        <Link href={`/blogs/${blog.slug}`} className={styles.ReadMoreBtn}>
          Read Article
        </Link>
      </div>
    </div>
  );
};

export default BlogInternalPage;
