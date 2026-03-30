export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://whitemantis.ae";

  const staticRoutes = [
    "",
    "/shop",
    "/blogs",
    "/about-us",
    "/academy",
    "/wholesale",
    "/subscription",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((route) => {
    let priorityWeight = 0.6; // Commercial/Info fallback

    if (route === "") priorityWeight = 1.0;
    else if (route === "/shop" || route === "/blogs") priorityWeight = 0.8;
    else if (route === "/contact") priorityWeight = 0.3;
    else if (route === "/privacy-policy" || route === "/terms-and-conditions")
      priorityWeight = 0.1;

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: priorityWeight,
    };
  });

  // Helper variables to store dynamic routes
  let categoryRoutes = [];
  let productRoutes = [];
  let blogRoutes = [];

  const serverUrl =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://endpoint.whitemantis.ae";

  // 2. Fetch Categories
  try {
    const categoriesRes = await fetch(
      `${serverUrl}/api/web-categories?select[slug]=true&depth=0&limit=100`,
      { next: { revalidate: 3600 } },
    );
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      categoryRoutes = (categoriesData.docs || []).map((cat) => ({
        url: `${baseUrl}/shop/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Error fetching categories for sitemap:", err);
  }

  // 3. Fetch Products for PDP
  try {
    const productsRes = await fetch(
      `${serverUrl}/api/web-products?where[_status][equals]=published&depth=1&limit=1000`,
      { next: { revalidate: 3600 } },
    );
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      productRoutes = (productsData.docs || [])
        .filter((prod) => prod.slug && prod.categories?.slug) // Ensure categories is populated or usable
        .map((prod) => {
          let catSlug =
            typeof prod.categories === "object"
              ? prod.categories.slug
              : "coffee-beans"; // Fallback if unpopulated, but depth=1 should populate it
          return {
            url: `${baseUrl}/shop/${catSlug}/${prod.slug}`,
            lastModified: new Date(prod.updatedAt || new Date()),
            changeFrequency: "weekly",
            priority: 0.9,
          };
        });
    }
  } catch (err) {
    console.error("Error fetching products for sitemap:", err);
  }

  // 4. Fetch Blogs
  try {
    const currentTime = new Date().toISOString();
    const blogsRes = await fetch(
      `${serverUrl}/api/blogs?where[and][0][_status][equals]=published&where[and][1][or][0][scheduledFor][less_than_equal]=${currentTime}&where[and][1][or][1][scheduledFor][exists]=false&limit=1000`,
      { next: { revalidate: 3600 } },
    );
    if (blogsRes.ok) {
      const blogsData = await blogsRes.json();
      blogRoutes = (blogsData.docs || []).map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || new Date()),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Error fetching blogs for sitemap:", err);
  }

  // Combine and return all routes
  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
