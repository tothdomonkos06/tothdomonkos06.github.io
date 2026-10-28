import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is now one page; old routes point at their sections.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/#work", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
