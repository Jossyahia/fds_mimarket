/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "frsmcjzgunhzcsxffmyj.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig
