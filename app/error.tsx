"use client";

import { useEffect } from "react";
import { Frame } from "app/components/frame";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <>
      <Frame plane="front" />
      <section className="page empty-page">
        <h1>This page didn’t load.</h1>
        <p>Please try again.</p>
        <button type="button" className="text-link" onClick={reset}>retry</button>
      </section>
    </>
  );
}
