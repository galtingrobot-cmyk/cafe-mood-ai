/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.9', 'localhost'],
  async rewrites() {
    return [
      {
        source: '/webhook/:path*',
        destination: `${process.env.N8N_URL || 'http://localhost:5678'}/webhook/:path*`, // Proxy ke n8n (bisa diatur lewat Vercel Env)
      },
    ]
  },
}

export default nextConfig;
