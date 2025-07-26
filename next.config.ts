import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "assets.aceternity.com", protocol: "https" },
      { hostname: "academiq-lms.fly.storage.tigris.dev", protocol: "https" },
    ],
  },
};

export default nextConfig;
