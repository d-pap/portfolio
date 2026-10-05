"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { playbackMode, type PlaybackMode } from "app/lib/playback";

/**
 * Plays the first <video> inside `root` per the recording policy (spec §6 item 3, §6.1).
 * `allowHover: false` skips hover mode (the case hero plays in view instead).
 * Recordings that play on their own (in view) or wait for a tap get a play/pause control;
 * a pause from it sticks while the recording stays in view (spec §12).
 */
export function useRecordingPlayback(root: RefObject<HTMLElement | null>, hasRecording: boolean, allowHover = true) {
  const [mode, setMode] = useState<PlaybackMode>("none");
  const [playing, setPlaying] = useState(false);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(playbackMode({ hasRecording, canHover: allowHover && hover.matches, reducedMotion: reduce.matches }));
    update();
    hover.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      hover.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, [hasRecording, allowHover]);

  useEffect(() => {
    const video = root.current?.querySelector("video");
    if (!video) return;
    if (playing) video.play().catch((error: DOMException) => { if (error.name !== "AbortError") setPlaying(false); });
    else video.pause();
  }, [playing, root]);

  useEffect(() => {
    pausedByUser.current = false;
    setPlaying(false);
  }, [mode]);

  useEffect(() => {
    if (mode !== "in-view" || !root.current) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.intersectionRatio >= 0.6 && !pausedByUser.current), { threshold: [0, 0.6, 1] });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [mode, root]);

  const toggle = () => {
    pausedByUser.current = playing;
    setPlaying(!playing);
  };
  const hover = {
    onPointerEnter: () => { if (mode === "hover") setPlaying(true); },
    onPointerLeave: () => { if (mode === "hover") setPlaying(false); },
  };
  return { mode, playing, controls: mode === "in-view" || mode === "tap", toggle, hover };
}
