import { execFileSync } from "node:child_process";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  // The root layout inlines these at render time (app/boot/boot.ts). Routes rendered on request, like an unknown
  // /blog slug, need them in their traced files too. Pages refreshed on request read content/ as well.
  outputFileTracingIncludes: { "/*": ["app/boot/*.js", "app/styles/trip.css", "content/**/*"] },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
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

// The "updated" date is the last commit (app/lib/updated.ts). Pages refreshed after a deploy render where there is no
// git, so it's read here, at build time, and inlined as process.env.SITE_COMMIT_DATE.
function commitDate(): string {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

// app/lib/media-colors.json is generated and gitignored. Writing it here covers every way Next is started (a plain
// `next build` on Vercel included), not only the package.json scripts.
export default async function config(phase: string): Promise<NextConfig> {
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_DEVELOPMENT_SERVER) {
    const { writeMediaColors } = await import("./scripts/media-colors.mjs");
    await writeMediaColors();
  }
  return { ...nextConfig, env: { SITE_COMMIT_DATE: commitDate() } };
}
