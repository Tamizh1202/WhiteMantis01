import BlogsLanding from "./_components/BlogsLanding/BlogsLanding";
import { formatImageUrl } from "@/lib/imageUtils";

export async function generateMetadata() {
  const apiUrl =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://endpoint.whitemantis.ae";

  try {
    const res = await fetch(`${apiUrl}/api/globals/blogs-landing`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.meta) {
        const imageUrl = data.meta.image ? formatImageUrl(data.meta.image) : "";
        return {
          title: data.meta.title || "The Mantis Journal | WhiteMantis",
          description:
            data.meta.description ||
            "Stay updated with the latest in specialty coffee stories, coffee guides, and brew tips from WhiteMantis.",
          openGraph: {
            title: data.meta.title || "The Mantis Journal | WhiteMantis",
            description:
              data.meta.description ||
              "Stay updated with the latest in specialty coffee stories, coffee guides, and brew tips from WhiteMantis.",
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }
  } catch (err) {
    console.error("Error fetching blogs landing metadata:", err);
  }

  return {
    title: "The Mantis Journal | WhiteMantis",
    description:
      "Stay updated with the latest in specialty coffee stories, coffee guides, and brew tips from WhiteMantis.",
  };
}

async function BlogsPage() {
  return <BlogsLanding />;
}

export default BlogsPage;
