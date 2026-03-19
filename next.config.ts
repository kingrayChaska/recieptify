import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // Prevent build from failing silently due to minor issues (debug phase)
  typescript: {
    ignoreBuildErrors: false, // keep strict in production
  },

  eslint: {
    ignoreDuringBuilds: false, // enforce clean code
  },

  // Ensure compatibility with Vercel runtime
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // prevents unexpected crashes on large payloads
    },
  },

  // Optional but useful for debugging deployment issues
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;