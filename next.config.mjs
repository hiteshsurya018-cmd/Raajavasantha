/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async redirects() {
    return [
      { source: "/donate", destination: "/support", permanent: false },
      { source: "/our-work", destination: "/focus-areas", permanent: false },
      { source: "/news", destination: "/", permanent: false },
      { source: "/documents", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
