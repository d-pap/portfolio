import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/isbn/**" }],
  },
  async redirects() {
    return [
      { source: "/work/rag-api", destination: "/work/sprout", permanent: true },
      { source: "/work/renew-app", destination: "/work/renew", permanent: true },
      { source: "/blog/rag-api", destination: "/work/sprout", permanent: true },
      { source: "/blog/renew-app", destination: "/work/renew", permanent: true },
    ];
  },
};

export default nextConfig;
