import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // PDF Content-Disposition is set in vercel.json (headers() is ignored with output: "export")
};

export default nextConfig;
