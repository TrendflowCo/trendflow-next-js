/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.com',
      },
      {
        protocol: 'https',
        hostname: '**.org',
      },
      {
        protocol: 'https',
        hostname: '**.net',
      },
      {
        protocol: 'https',
        hostname: '**.no',
      },
      {
        protocol: 'https',
        hostname: '**.co.uk',
      }
      // Add more patterns as needed
    ],
  }
};

module.exports = nextConfig;