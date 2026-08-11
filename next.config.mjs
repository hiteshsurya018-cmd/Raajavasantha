/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      { source: "/donate", destination: "/support", permanent: false },
      { source: "/our-work", destination: "/focus-areas", permanent: false },
      { source: "/projects", destination: "/focus-areas", permanent: false },
      { source: "/gallery", destination: "/", permanent: false },
      { source: "/news", destination: "/", permanent: false },
      { source: "/documents", destination: "/contact", permanent: false },
    ];
  },
};
export default nextConfig;
