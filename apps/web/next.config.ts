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
    remotePatterns: [
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

