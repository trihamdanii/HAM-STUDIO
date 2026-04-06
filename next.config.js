/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.discordapp.com'],
  },
  // Needed so that prisma client works on Vercel edge runtime
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
}
module.exports = nextConfig
