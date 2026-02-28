import { notFound } from "next/navigation";
import Listing from "./_components/Listing/Listing";
import NavigationStrip from "./_components/NavigationStrip/NavigationStrip";
import Landing from "./_components/Landing/Landing";

export default async function ShopCategoryPage({ params }) {
  const { category } = await params;

  // Validate the category slug against the real list
  const res = await axiosClient.get("/api/web-categories?sort=createdAt&select[slug]=true&depth=0&limit=100");

  if (!res.ok) notFound();

  const data = await res.json();
  const categories = data.docs ?? [];
  const match = categories.find((cat) => cat.slug === category);

  if (!match) notFound();

  return (
    <>
      <Landing />
      <NavigationStrip />
      <Listing />
    </>
  );
}
