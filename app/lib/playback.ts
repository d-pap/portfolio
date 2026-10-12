/** One playback policy for thumbnails, case heroes, and inline films. */
export function shouldPlayLoop({ hasRecording, visible, documentHidden }: {
  hasRecording: boolean; visible: boolean; documentHidden: boolean;
}): boolean {
  return hasRecording && visible && !documentHidden;
}
