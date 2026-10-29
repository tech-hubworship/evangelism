/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
