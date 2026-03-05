export const formatImageUrl = (image: any): string => {
    if (!image) return "";

    // If image is an object (from Payload CMS), extract the URL
    let url = typeof image === "string" ? image : image.url;

    if (!url) return "";

    // If it's a relative path starting with /api/media, prepend the server URL
    if (url.startsWith("/api/media/")) {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
        // Remove trailing slash from serverUrl if it exists and ensure single slash between them
        const normalizedServerUrl = serverUrl.endsWith("/") ? serverUrl.slice(0, -1) : serverUrl;
        return `${normalizedServerUrl}${url}`;
    }

    return url;
};
