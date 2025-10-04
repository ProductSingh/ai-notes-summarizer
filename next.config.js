/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_GEMINI_KEY: process.env.NEXT_PUBLIC_GEMINI_KEY,
    NEXT_PUBLIC_GEMINI_URL: process.env.NEXT_PUBLIC_GEMINI_URL,
  }
};

module.exports = nextConfig;
