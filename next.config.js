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
        hostname: '**.com.hk',
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
      },
      {
        protocol: 'https',
        hostname: '**.es',
      },
      {
        protocol: 'https',
        hostname: '**.us',
      }
      // Add more patterns as needed
    ],
    domains: [
      // ... other existing domains
      'www.pacificplace.com.hk',
      'torrado.es', // Add this new domain
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

module.exports = nextConfig;