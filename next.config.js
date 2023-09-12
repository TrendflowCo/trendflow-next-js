/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.producthunt.com'
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      },
      {
        protocol: 'https',
        hostname: 'ww1.freelogovectors.net'
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: 'seeklogo.com'
      },
      {
        protocol: 'https',
        hostname: 'www.pacificplace.com.hk'
      },
      {
        protocol: 'https',
        hostname: 'torrado.es'
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: 'logodownload.org'
      },
      {
        protocol: 'https',
        hostname: 'logos-download.com'
      },
      {
        protocol: 'https',
        hostname: 'fashionunited.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com'
      },
      {
        protocol: 'https',
        hostname: 'www.ink-clothing.com'
      },
      {
        protocol: 'https',
        hostname: 'adanola.com'
      },
      {
        protocol: 'https',
        hostname: 'danielleguiziony.com'
      },
      {
        protocol: 'https',
        hostname: 'geel.us'
      },
      {
        protocol: 'https',
        hostname: 'gimaguas.com'
      },
      {
        protocol: 'https',
        hostname: 'kitteny.com'
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com'
      },
      {
        protocol: 'https',
        hostname: 'modemischiefstudios.com'
      },
      {
        protocol: 'https',
        hostname: 'nodress67.com'
      },
      {
        protocol: 'https',
        hostname: 'vanessamooney.com'
      },
      {
        protocol: 'https',
        hostname: 'withjean.com'
      },
      {
        protocol: 'https',
        hostname: 'troisthelabel.com'
      },
      {
        protocol: 'https',
        hostname: 'shop.amlul.com'
      },
      {
        protocol: 'https',
        hostname: 'maisxfrida.com'
      },
      {
        protocol: 'https',
        hostname: 'www.getinspired.no'
      },
      {
        protocol: 'https',
        hostname: 'storets.no'
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com'
      }
    ]
  }
}
module.exports = nextConfig
