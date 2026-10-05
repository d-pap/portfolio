import { metaData } from "./config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: new URL("/sitemap.xml", metaData.baseUrl).href,
  };
}
