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
        hostname: 'static.zara.net'
      },
      {
        protocol: 'https',
        hostname: 'www.desigual.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: 'www.loewe.com'
      },
      {
        protocol: 'https',
        hostname: 'image.uniqlo.com'
      },
      {
        protocol: 'https',
        hostname: 'lp.stories.com'
      },
      {
        protocol: 'https',
        hostname: 'lp2.hm.com'
      },
      {
        protocol: 'https',
        hostname: 'www.farmrio.com'
      },
      {
        protocol: 'https',
        hostname: 'st.mngbcn.com'
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
        hostname: 'www.storets.com'
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com'
      },
      {
        protocol: 'https',
        hostname: 'www.disturbia.co.uk'
      },
      {
        protocol: 'https',
        hostname: '2.bp.blogspot.com'
      },
      {
        protocol: 'https',
        hostname: 'images.crunchbase.com'
      },
      {
        protocol: 'https',
        hostname: 'www.sweetlemonboutique.com'
      },
      {
        protocol: 'https',
        hostname: 'static.zara.net'
      },
      {
        protocol: 'https',
        hostname: 'www.desigual.com'
      },
      {
        protocol: 'https',
        hostname: 'www.loewe.com'
      },
      {
        protocol: 'https',
        hostname: 'image.uniqlo.com'
      },
      {
        protocol: 'https',
        hostname: 'www.championstore.com'
      },
      {
        protocol: 'https',
        hostname: 'static.bershka.net'
      },
      {
        protocol: 'https',
        hostname: 'static.e-stradivarius.net'
      },
    ],
    domains: [
      'api.producthunt.com',
      'upload.wikimedia.org',
      'static.zara.net',
      'www.desigual.com',
      'cdn.shopify.com',
      'www.loewe.com',
      'image.uniqlo.com',
      'lp.stories.com',
      'lp2.hm.com',
      'www.farmrio.com',
      'st.mngbcn.com',
      'seeklogo.com',
      'www.pacificplace.com.hk',
      'torrado.es',
      'cdn.shopify.com',
      'logodownload.org',
      'logos-download.com',
      'fashionunited.com',
      'lh3.googleusercontent.com',
      'images.squarespace-cdn.com',
      'www.ink-clothing.com',
      'adanola.com',
      'danielleguiziony.com',
      'geel.us',
      'gimaguas.com',
      'kitteny.com',
      'media.licdn.com',
      'modemischiefstudios.com',
      'nodress67.com',
      'vanessamooney.com',
      'withjean.com',
      'troisthelabel.com',
      'shop.amlul.com',
      'maisxfrida.com',
      'www.getinspired.no',
      'www.storets.com',
      'i.pinimg.com',
      'www.disturbia.co.uk',
      '2.bp.blogspot.com',
      'images.crunchbase.com',
      'www.sweetlemonboutique.com',
      'static.zara.net',
      'www.desigual.com',
      'www.loewe.com',
      'image.uniqlo.com',
      'www.championstore.com',
      'static.bershka.net',
      'static.e-stradivarius.net'
    ],
  }
}
module.exports = nextConfig