/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kimiatoranj-api.liara.run",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.kimiatoranj.com",
        pathname: "/**",
      },
    ],
  },

};

export default nextConfig;


