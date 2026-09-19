"use client";
import { useEffect } from "react";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <section className="site-shell empty-page"><h1>this page didn’t load.</h1><p>Please try again.</p><button className="text-link" onClick={reset}>retry <span aria-hidden="true">↗</span></button></section>;
}
