import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatImageUrl } from "@/lib/imageUtils";
import RichText from "../_components/RichText/RichText";
import styles from "./BlogInternal.module.css";
import RelatedBlogsClient from "./RelatedBlogsClient";

async function getBlog(slug) {
  try {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "https://endpoint.whitemantis.ae";
    const res = await fetch(
      `${serverUrl}/api/blogs?where[slug][equals]=${slug}`,
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.docs?.[0] || null;
  } catch (e) {
    console.error("Error fetching blog:", e);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return { title: "Blog Not Found | WhiteMantis" };

  const blog = await getBlog(slug);

  if (blog) {
    const imageUrl = blog.featuredImage
      ? formatImageUrl(blog.featuredImage)
      : "";
    return {
      title: blog.meta?.title || blog.title || "WhiteMantis Blog",
      description: blog.meta?.description || blog.excerpt || "",
      openGraph: {
        title: blog.meta?.title || blog.title || "WhiteMantis Blog",
        description: blog.meta?.description || blog.excerpt || "",
        images: imageUrl ? [imageUrl] : [],
      },
    };
  }
  return { title: "WhiteMantis Blog" };
}

export default async function BlogInternalPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

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
      <nav className={styles.Breadcrumb}>
        <Link href="/">Home</Link>
        <span>
          <svg
            width="8"
            height="13"
            viewBox="0 0 8 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "translateY(1px)" }}
          >
            <path
              d="M0.946166 12.8717L0 11.9255L5.48967 6.43583L0 0.946167L0.946166 0L7.382 6.43583L0.946166 12.8717Z"
              fill="#6C7A5F"
            />
          </svg>
        </span>
        <Link href="/blogs">Blogs</Link>
        <span>
          <svg
            width="8"
            height="13"
            viewBox="0 0 8 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "translateY(1px)" }}
          >
            <path
              d="M0.946166 12.8717L0 11.9255L5.48967 6.43583L0 0.946167L0.946166 0L7.382 6.43583L0.946166 12.8717Z"
              fill="#6C7A5F"
            />
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
          <RelatedBlogsClient relatedBlogs={blog.relatedBlogs} />
        )}
      </div>

      <article className={styles.ContentWrapper}>
        <RichText content={blog.content} />
      </article>

      {/* Mobile view related blogs scroller */}
      {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
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
      )}
    </main>
  );
}

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
