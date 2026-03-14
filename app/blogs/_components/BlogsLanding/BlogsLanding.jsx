"use client";
import React, { useState, useEffect } from "react";
import styles from "../../Blogs.module.css";
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import Link from "next/link";

const BlogsLanding = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All Articles");

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const currentTime = new Date().toISOString();
                const response = await axiosClient.get(
                    `/api/blogs?where[and][0][_status][equals]=published&where[and][1][or][0][scheduledFor][less_than_equal]=${currentTime}&where[and][1][or][1][scheduledFor][exists]=false`
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

    const featuredBlog = blogs[0];
    const gridBlogs = blogs.slice(1);

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

    return (
        <div className={styles.Main}>
            {featuredBlog && <BlogHero blog={featuredBlog} />}

            <section className={styles.GridSection}>
                <div className={styles.SectionHeader}>
                    <h2 className={styles.SectionTitle}>Latest Blogs</h2>
                </div>

                <div className={styles.BlogGrid}>
                    {gridBlogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>

                <div className={styles.ViewMoreWrapper}>
                    <button className={styles.ViewMoreBtn}>View more</button>
                </div>
            </section>
        </div>
    );
};

const BlogHero = ({ blog }) => {
    const imageUrl = formatImageUrl(blog.featuredImage);

    return (
        <section className={styles.HeroSection}>
            <h1 className={styles.HeroTitle}>The Mantis Journal</h1>
            <div className={styles.HeroCard}>
                <div className={styles.HeroImageWrapper}>
                    <Image
                        src={imageUrl}
                        alt={blog.featuredImage?.alt || blog.title}
                        fill
                        className={styles.HeroImage}
                    />
                </div>
                <div className={styles.HeroContent}>
                    <div className={styles.MetaRow}>
                        <span>{blog.readTime || 5} Minutes</span>
                    </div>
                    <h2 className={styles.HeroBlogTitle}>{blog.title}</h2>
                    <p className={styles.HeroExcerpt}>
                        {blog.meta?.description || "Dive deep into the science behind our beans. We break down how unique fermentation processes create complex, vibrant tasting profiles."}
                    </p>
                    <span className={styles.DateText}>
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
                <div className={styles.HeroDots}>
                    <div className={`${styles.Dot} ${styles.DotActive}`}></div>
                    <div className={styles.Dot}></div>
                    <div className={styles.Dot}></div>
                </div>
            </div>
        </section>
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
                <h3 className={styles.CardTitle}>{blog.title}</h3>
                <div className={styles.MetaRow}>
                    <span>{blog.readTime || 5} Minutes</span>
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
