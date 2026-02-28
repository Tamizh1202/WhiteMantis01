"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosClient from "@/lib/axios";

export default function Shop() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get("/api/web-categories?sort=createdAt&select[slug]=true&depth=0&limit=100");
        const fetchedCategories = await res.data;

        if (res.status !== 200) {
          throw new Error(fetchedCategories.message || "Categories fetch failed");
        }
        setCategories(fetchedCategories.docs);
      } catch (e) {
        console.log(e.message || "Something went wrong");
      }
    };
    fetchCategories();
  }, [])

  const router = useRouter();

  useEffect(() => {
    if (categories.length > 0) {
      const firstCategorySlug = categories[0].slug;
      if (firstCategorySlug) {
        router.push(`/shop/${firstCategorySlug}`);
      }
    }
  }, [categories, router]);

  return (
    <>
    </>
  );
}