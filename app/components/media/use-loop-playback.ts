"use client";

import { shouldPlayLoop } from "app/lib/playback";
import { useEffect, type RefObject } from "react";

/** Silent portfolio films: they play while visible and pause offscreen or in a hidden tab. */
export function useLoopPlayback(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const video = root.current?.querySelector("video");
    if (!enabled || !video) return;
    let visible = false;
    let disposed = false;
    const shouldPlay = () => !disposed && shouldPlayLoop({ hasRecording: enabled, visible, documentHidden: document.hidden });
    const update = () => {
      if (shouldPlay()) {
        video.play().then(() => { if (!shouldPlay()) video.pause(); }).catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      update();
    }, { threshold: [0, 0.2] });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [root, enabled]);
}
