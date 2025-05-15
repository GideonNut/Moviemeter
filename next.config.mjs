/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'placeholder.svg',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'm.media-amazon.com',
      'i.ytimg.com',
      'wallpaperaccess.com',
      'moviemeter13.vercel.app'
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/farcaster-manifest',
      },
    ];
  },
};

export default nextConfig;
