/** @type {import('next').NextConfig} */

const payloadUrl = process.env.NEXT_PUBLIC_SERVER_URL;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: payloadUrl ? new URL(payloadUrl).hostname : "",
      },
      {
        protocol: "https",
        hostname: "endpoint.whitemantis.ae",
      }

    ],
  },
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Handle canvas dependency for @react-pdf/renderer
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas'];
    }
    return config;
  },
};

export default nextConfig;
