export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://whitemantis.ae";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/checkout/",
          "/auth/",
          "/preview-invoice/",
          "/api/",
        ],
      },
      {
        userAgent: [
          "Googlebot",
          "Google-Extended", // Gemini
          "GPTBot", // OpenAI
          "ChatGPT-User", // OpenAI Custom Plugins
          "ClaudeBot", // Anthropic
          "Claude-Web", // Anthropic
          "anthropic-ai", // Anthropic
        ],
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
