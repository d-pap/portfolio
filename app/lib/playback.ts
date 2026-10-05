export type PlaybackMode = "hover" | "in-view" | "tap" | "none";

export function playbackMode({ hasRecording, canHover, reducedMotion }: { hasRecording: boolean; canHover: boolean; reducedMotion: boolean }): PlaybackMode {
  if (!hasRecording) return "none";
  if (canHover) return "hover";
  return reducedMotion ? "tap" : "in-view";
}
