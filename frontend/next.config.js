/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.stamp.fyi'
      },
    ],
  },
  transpilePackages: ['@lens-protocol'],
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  }
}


module.exports = nextConfig
