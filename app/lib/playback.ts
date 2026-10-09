/** One playback policy for thumbnails, case heroes, and inline films. */
export function shouldPlayLoop({ hasRecording, visible, reducedMotion, documentHidden }: {
  hasRecording: boolean; visible: boolean; reducedMotion: boolean; documentHidden: boolean;
}): boolean {
  return hasRecording && visible && !reducedMotion && !documentHidden;
}
