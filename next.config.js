/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental appDir as it's now default in Next.js 14
  // Disable edge runtime for bcrypt compatibility
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
}

module.exports = nextConfig
