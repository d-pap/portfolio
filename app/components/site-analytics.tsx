"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Analytics start only once a page is actually shown, so prerendered pages that are never opened aren't counted. */
export function SiteAnalytics() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const doc = document as Document & { prerendering?: boolean };
    if (!doc.prerendering) {
      setShown(true);
      return;
    }
    const show = () => setShown(true);
    document.addEventListener("prerenderingchange", show, { once: true });
    return () => document.removeEventListener("prerenderingchange", show);
  }, []);
  return shown ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
}
