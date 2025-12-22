import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    return [
      {
        source: '/api/:path((?!auth).*)',
        destination: `${apiUrl}/api/:path`,
      },
    ];
  },
};

export default nextConfig;
