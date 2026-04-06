import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'admin.petshop.local',
    'rider.petshop.local',
    'user.petshop.local',
    'kanha-admin.local',
    'kanha-rider.local',
    'localhost:3000'
  ],
  experimental: {
    memoryBasedWorkersCount: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'content.jdmagicbox.com',
      },
      {
        protocol: 'https',
        hostname: 'images.jdmagicbox.com',
      },
    ],
  },
};

export default nextConfig;

