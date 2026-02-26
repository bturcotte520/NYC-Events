import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: '/Users/brianturcotte/my-app',
  },
};

export default nextConfig;
