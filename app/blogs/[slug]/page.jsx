import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatImageUrl } from "@/lib/imageUtils";
import RichText from "../_components/RichText/RichText";
import styles from "./BlogInternal.module.css";
import RelatedBlogsClient from "./RelatedBlogsClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return { title: "Blog Not Found | WhiteMantis" };

  try {
    const serverUrl =
      process.env.PAYLOAD_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "https://endpoint.whitemantis.ae";
    const response = await fetch(
      `${serverUrl}/api/blogs?where[slug][equals]=${slug}`,
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      const blog = json.docs?.[0] || null;

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
    }
  } catch (err) {
    console.error("Error fetching blog meta:", err);
  }
  return { title: "WhiteMantis Blog" };
}

async function getBlog(slug) {
  try {
    const serverUrl =
      process.env.PAYLOAD_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "https://endpoint.whitemantis.ae";
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
    return null;
  }
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
        <RelatedBlogsClient relatedBlogs={blog.relatedBlogs} />
      )}
    </main>
  );
}
