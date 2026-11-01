# RENEW portfolio media
Prepared: 2026-10-08

The approved app films and their timing are preserved. The overview hero and its poster were re-exported at higher resolution on 2026-11-01; the other app exports remain unchanged.

- `loops/`: three thumbnail loops, each under five seconds, with a dissolve back to its starting state.
- `videos/`: all ten tighter v3 edits for project detail pages and other placements.
- `manifest.json`: ready-to-use site URLs, poster URLs, dimensions, durations, and descriptions.
- `stills/`: the Upgrade and Backend images, added 2026-10-13. `renew-release-*` recomposes the public App Store listing with the 3.1.1 release notes (released 2026-10-10). `renew-context-*` is an excerpt of the request RENEW's backend sends to Sprout: real field names, made-up values. Each has a home tile (`1x1`, `4x3`) and a case-page figure (1824×1080).

These are full-phone exports on plain white, silent H.264 at 60 fps. The loops retain native interaction speed; their return is an edited dissolve, not a recorded app action. Their final selection is still subject to review.

Files in this folder are served by the site at `/projects/renew/`. For example:

```html
<video
  src="/projects/renew/loops/renew-completion-loop-4x5.mp4"
  poster="/projects/renew/loops/renew-completion-loop-4x5.jpg"
  autoplay muted loop playsinline
></video>
```

The site now uses visible-only silent autoplay with no playback controls. Reduced-motion visitors see stills.

## Thumbnail loops

| Clip | Duration | Video | Poster |
|---|---:|---|---|
| Completing a goal | 3.5s | [renew-completion-loop-4x5.mp4](loops/renew-completion-loop-4x5.mp4) | [JPEG](loops/renew-completion-loop-4x5.jpg) |
| Mood check-in | 4.45s | [renew-mood-loop-4x5.mp4](loops/renew-mood-loop-4x5.mp4) | [JPEG](loops/renew-mood-loop-4x5.jpg) |
| Chart study | 4.9s | [renew-chart-loop-4x5.mp4](loops/renew-chart-loop-4x5.mp4) | [JPEG](loops/renew-chart-loop-4x5.jpg) |

## Longer collection — tighter v3 edits

| Clip | Duration | Video | Poster |
|---|---:|---|---|
| Overview | 12s | [renew-overview-4x3.mp4](videos/renew-overview-4x3.mp4) | [JPEG](videos/renew-overview-4x3.jpg) |
| Statistics | 12.8s | [renew-statistics-4x5.mp4](videos/renew-statistics-4x5.mp4) | [JPEG](videos/renew-statistics-4x5.jpg) |
| Chart study | 7.05s | [renew-chart-4x5.mp4](videos/renew-chart-4x5.mp4) | [JPEG](videos/renew-chart-4x5.jpg) |
| Completing a goal | 3.25s | [renew-completion-4x5.mp4](videos/renew-completion-4x5.mp4) | [JPEG](videos/renew-completion-4x5.jpg) |
| Mood check-in | 4.3s | [renew-mood-4x5.mp4](videos/renew-mood-4x5.mp4) | [JPEG](videos/renew-mood-4x5.jpg) |
| New goal | 12.9s | [renew-new-goal-4x5.mp4](videos/renew-new-goal-4x5.mp4) | [JPEG](videos/renew-new-goal-4x5.jpg) |
| Manage goals | 5.5s | [renew-manage-goals-4x5.mp4](videos/renew-manage-goals-4x5.mp4) | [JPEG](videos/renew-manage-goals-4x5.jpg) |
| Learning modules | 12.75s | [renew-modules-4x5.mp4](videos/renew-modules-4x5.mp4) | [JPEG](videos/renew-modules-4x5.jpg) |
| Launch | 3.2s | [renew-launch-4x5.mp4](videos/renew-launch-4x5.mp4) | [JPEG](videos/renew-launch-4x5.jpg) |
| A quiet app film | 28.75s | [renew-film-16x9.mp4](videos/renew-film-16x9.mp4) | [JPEG](videos/renew-film-16x9.jpg) |

## Production source

The overview is now 2880×2160, rendered from the original 1170×2532 display recording with the approved phone frame at the same proportions. It remains 12 seconds, 720 frames, silent H.264, with fast-start metadata. The export is about 953 KB. The previous 1440×1080 version, source clips, plates, masks, render script, and validation are retained at:
`/Users/derek/.codex/visualizations/2026/11/01/01a19786-ca60-7ce3-a6a6-f40f3cd45abe/retina-heroes/`.

The original media workspace remains at:
`/Users/derek/.codex/visualizations/2026/10/08/01a11d13-cd05-7d71-9e9c-c1fc51747fa2/renew-motion/`

It retains the raw recordings, display-only versions, earlier v2 edits, review galleries, edit decisions, and editable Remotion project. The files here are the latest framed exports intended for site use. Do not replace these with the rejected v1 treatment.
