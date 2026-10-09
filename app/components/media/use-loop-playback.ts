"use client";

import { shouldPlayLoop } from "app/lib/playback";
import { useEffect, type RefObject } from "react";

/** Silent portfolio films: visible-only playback, with a still for reduced motion. */
export function useLoopPlayback(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const video = root.current?.querySelector("video");
    if (!enabled || !video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    const shouldPlay = () => !disposed && shouldPlayLoop({ hasRecording: enabled, visible, reducedMotion: reduce.matches, documentHidden: document.hidden });
    const update = () => {
      if (shouldPlay()) {
        video.play().then(() => { if (!shouldPlay()) video.pause(); }).catch(() => {});
      } else {
        video.pause();
        if (reduce.matches && video.readyState > 0) video.currentTime = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      update();
    }, { threshold: [0, 0.2] });
    observer.observe(video);
    reduce.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true;
      observer.disconnect();
      reduce.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [root, enabled]);
}
