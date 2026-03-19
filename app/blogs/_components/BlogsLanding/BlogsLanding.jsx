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
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const currentTime = new Date().toISOString();
                const response = await axiosClient.get(
                    `/api/blogs?where[and][0][_status][equals]=published&where[and][1][or][0][scheduledFor][less_than_equal]=${currentTime}&where[and][1][or][1][scheduledFor][exists]=false&limit=100&sort=-createdAt`
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

    // Filter logic: Get top 3 featured blogs
    const featuredBlogs = blogs.filter(blog => Boolean(blog.isFeatured)).slice(0, 3);

    // Grid logic: Exclude the 3 featured blogs from the grid
    const gridBlogs = blogs.filter(blog => !featuredBlogs.find(fb => fb.id === blog.id));

    // Timer Logic: Change the featured blog every 3 seconds
    useEffect(() => {
        if (featuredBlogs.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === featuredBlogs.length - 1 ? 0 : prevIndex + 1
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
            {featuredBlogs.length > 0 && (
                <section className={styles.HeroSection}>
                    <h1 className={styles.HeroTitle}>The Mantis Journal</h1>
                    <div className={styles.StaticHeroWrapper}>
                        <div className={styles.HeroCard}>
                            <div className={styles.HeroImageWrapper}>
                                <Image
                                    src={formatImageUrl(currentBlog.featuredImage)}
                                    alt={currentBlog.featuredImage?.alt || currentBlog.title}
                                    fill
                                    className={styles.HeroImage}
                                    priority
                                    key={currentBlog.id} // Forces image refresh on swap
                                />
                            </div>
                            <div className={styles.HeroContent}>
                                <div className={styles.MetaRow}>
                                    <span>{currentBlog.readTime || 5} Minutes</span>
                                </div>
                                <h2 className={styles.HeroBlogTitle}>{currentBlog.title}</h2>
                                <p className={styles.HeroExcerpt}>
                                    {currentBlog.meta?.description || "Dive deep into the science behind our beans."}
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

                                {/* Stage Indicators (Dots) */}
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
                </section>
            )}

            <section className={`${styles.GridSection} ${featuredBlogs.length === 0 ? styles.NoHero : ""}`}>
                <div className={styles.SectionHeader}>
                    <h2 className={styles.SectionTitle}>Latest Blogs</h2>
                </div>
                <div className={styles.lowersec}>
                    {gridBlogs && gridBlogs.length > 0 ? (
                        <>
                            <div className={styles.BlogGrid}>
                                {gridBlogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                            <div className={styles.ViewMoreWrapper}>
                                <button className={styles.ViewMoreBtn}>View more</button>
                            </div>
                        </>
                    ) : (
                        /* THE EMPTY STATE: Shows inside the grid section if no blogs exist */
                        <div className={styles.EmptyGridState}>
                            <div className={styles.emptypt1}>
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