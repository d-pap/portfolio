import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  // The root layout inlines these at render time (app/boot/boot.ts). Routes rendered on request, like an unknown
  // /blog slug, need them in their traced files too.
  outputFileTracingIncludes: { "/*": ["app/boot/*.js", "app/styles/trip.css"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/isbn/**" }],
  },
  async redirects() {
    return [
      { source: "/work/rag-api", destination: "/work/sprout", permanent: true },
      { source: "/work/renew-app", destination: "/work/renew", permanent: true },
      { source: "/blog/rag-api", destination: "/work/sprout", permanent: true },
      { source: "/blog/renew-app", destination: "/work/renew", permanent: true },
      { source: "/reading", destination: "/bookshelf", permanent: true },
    ];
  },
};

// app/lib/media-colors.json is generated and gitignored. Writing it here covers every way Next is started (a plain
// `next build` on Vercel included), not only the package.json scripts.
export default async function config(phase: string): Promise<NextConfig> {
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_DEVELOPMENT_SERVER) {
    const { writeMediaColors } = await import("./scripts/media-colors.mjs");
    await writeMediaColors();
  }
  return nextConfig;
}
