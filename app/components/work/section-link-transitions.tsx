"use client";

import { useEffect } from "react";

type PageSwapEvent = Event & { activation?: { entry?: { url?: string } } | null };

/**
 * A feature tile opens a section further down its product page, where the hero isn't on screen, so only clicks
 * that open the top of a page keep the main tile's morph into the hero. Runs on the outgoing home page just
 * before the browser captures it.
 */
export function SectionLinkTransitions() {
  useEffect(() => {
    const mainTiles = () => document.querySelectorAll<HTMLElement>(".tile-media.is-main");
    const onSwap = (event: Event) => {
      const url = (event as PageSwapEvent).activation?.entry?.url;
      const toSection = Boolean(url && new URL(url).hash);
      mainTiles().forEach((media) => {
        media.style.viewTransitionName = toSection ? "none" : "";
      });
    };
    // Coming back through the back/forward cache restores the names a section click removed.
    const onShow = () => mainTiles().forEach((media) => {
      media.style.viewTransitionName = "";
    });
    window.addEventListener("pageswap", onSwap);
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("pageswap", onSwap);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);
  return null;
}
