import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'example.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'media.istockphoto.com',
      'unsplash.com',
      // No new domains needed for current home page images, but keep this list updated if you add more sources
    ],
  },
};

export default nextConfig;
