import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Automatically attach the payload-token from cookies on every request
axiosClient.interceptors.request.use((config) => {
  const payloadToken = Cookies.get("paylaod-token");

  if (payloadToken) {
    config.headers["Authorization"] = `JWT ${payloadToken}`;
  }

  // Add where[_status][equals]=published to all GET requests for API routes
  if (config.method === "get") {
    const url = config.url || "";
    // Apply to /api/ routes but skip if _status is already present
    // Also skip collections that don't support draft/publish status
    const collectionsToSkip = [
      "user-wt-coins",
      "web-orders",
      "web-subscription",
      "web-cart",
    ];
    const shouldSkip = collectionsToSkip.some((c) => url.includes(c));

    if (url.includes("/api/") && !url.includes("_status") && !shouldSkip) {
      config.params = {
        ...config.params,
        "where[_status][equals]": "published",
      };
    }
  }

  return config;
});

export default axiosClient;
