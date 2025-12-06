/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // standalone output reduces installed files and works well on serverless deployments
  output: 'standalone',
  images: {
    // allow remote images from any host (tweak to specific domains if known)
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
  },
  // keep other stable defaults; add more experimental flags only if required
};

module.exports = nextConfig;
