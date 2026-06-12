/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  async rewrites() {
    return [
      {
        source: '/webhook/:path*',
        destination: 'http://localhost:5678/webhook/:path*',
      },
    ];
  },
};

export default nextConfig;
