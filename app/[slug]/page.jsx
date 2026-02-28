"use client";
import { useRouter, useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import axiosClient from "@/lib/axios";

export default function SlugRedirect() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;

    const [shouldNotFound, setShouldNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchAndRedirect = async () => {
            try {
                const res = await axiosClient.get("/api/web-categories?select[slug]=true&depth=0&limit=100&sort=createdAt");
                const fetchedCategories = res.data;

                if (res.status !== 200) {
                    throw new Error(fetchedCategories.message || "Categories fetch failed");
                }

                const categories = fetchedCategories.docs ?? [];
                const match = categories.find((cat) => cat.slug === slug);

                if (match) {
                    router.replace(`/shop/${match.slug}`);
                } else {
                    setShouldNotFound(true);
                }
            } catch (e) {
                setShouldNotFound(true);
            }
        };

        fetchAndRedirect();
    }, [slug, router]);

    // notFound() must be called during render, not inside useEffect async callbacks
    if (shouldNotFound) notFound();

    return null;
}
