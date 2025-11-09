/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.infura.io', 'th.bing.com', 'crowdfunding.infura-ipfs.io', 'gateway.pinata.cloud']
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;