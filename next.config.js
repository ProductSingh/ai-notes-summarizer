/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/ai-notes-summarizer',
  assetPrefix: '/ai-notes-summarizer',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    loader: 'custom',
    loaderFile: './lib/imageLoader.js'
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_GEMINI_KEY: process.env.NEXT_PUBLIC_GEMINI_KEY,
    NEXT_PUBLIC_GEMINI_URL: process.env.NEXT_PUBLIC_GEMINI_URL,
  }
};

module.exports = nextConfig;
