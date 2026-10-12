import type { MetadataRoute } from "next";
import { getEntries, getReading } from "./lib/content";
import { lastUpdated } from "./lib/updated";
import { metaData } from "./config";

const base = metaData.baseUrl.endsWith("/") ? metaData.baseUrl : `${metaData.baseUrl}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = lastUpdated() ?? new Date().toISOString().slice(0, 10);
  const work = getEntries()
    .filter((entry) => entry.index !== "hidden")
    .map((entry) => ({ url: `${base}work/${entry.slug}`, lastModified: entry.publishedAt }));
  const bookshelf = getReading().length > 0 ? [{ url: `${base}bookshelf`, lastModified: updated }] : [];
  return [{ url: base, lastModified: updated }, ...work, ...bookshelf];
}
