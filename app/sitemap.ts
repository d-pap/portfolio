import type { MetadataRoute } from "next";
import { getEntries, getReading } from "./lib/content";
import { metaData } from "./config";

const base = metaData.baseUrl.endsWith("/") ? metaData.baseUrl : `${metaData.baseUrl}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().slice(0, 10);
  const work = getEntries()
    .filter((entry) => entry.index !== "hidden")
    .map((entry) => ({ url: `${base}work/${entry.slug}`, lastModified: entry.publishedAt }));
  const reading = getReading().length > 0 ? [{ url: `${base}reading`, lastModified: today }] : [];
  return [{ url: base, lastModified: today }, ...work, ...reading];
}
