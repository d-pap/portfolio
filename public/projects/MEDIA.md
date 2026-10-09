# Portfolio media

Updated 2026-10-08. Production-ready MP4s and matching JPEG posters are grouped by project. `manifest.json` in each folder records paths, dimensions, duration, size, and provenance.

| Project | Home thumbnails | Project page |
| --- | --- | --- |
| RENEW | Mood loop; chart loop for Redesign; abstract Platform study | App overview; Statistics, new goal, and modules films; Platform study |
| Sprout | Sources interaction; wordless retrieval, memory, and evaluation studies | Conversation film; three abstract motion studies |
| Code Coach | Existing practice-home screenshot and logo | Existing workspace images plus a 12-second public landing-page scroll study |
| Stitches | Existing homepage and collection photography | Before/after wipe plus the redesigned homepage and collection images |

All films and loops silently autoplay and repeat without playback controls, including case-page films. Playback stops offscreen or when the tab is hidden. Reduced-motion visitors see a still. Thumbnail loops stay under five seconds.

Finished phone compositions include their full display, native notch, frame, and white canvas. Use `fit: contain` for thumbnails and `hero.type: composition`; do not put them inside another phone frame. Mobile case heroes reframe the white margins while keeping the entire phone visible.

Sprout's interface footage uses a local demonstration conversation and staged RENEW app data. The abstract studies use black linework, white space, and signal orange, with no text inside the artwork. They suggest gathering, retaining, comparing, and structuring information; they do not depict measured results or a literal architecture. Code Coach's film is an edited scroll assembled from public landing-page captures; it does not imply that the authenticated workspace currently works. Its hosted Cognito client needs restoration before fresh workspace recordings are possible.

All 13 earlier RENEW videos/loops remain available in `renew/`, alongside the new Platform study. Sprout has two interface films and three active abstract studies. Code Coach and Stitches each have one film. Superseded labeled Sprout graphics remain available but are marked archived in the manifest and are not used by the site. Originals and editable production files remain in:

`/Users/derek/.codex/visualizations/2026/10/08/01a11d13-cd05-7d71-9e9c-c1fc51747fa2/renew-motion/`

The active abstract studies are in `studio/src/StudiesV2.tsx`. Earlier illustrations, Code Coach, and Stitches compositions are in `studio/src/Systems.tsx`; capture/edit records are in `other-projects/`. Standalone review: `http://localhost:4318/other-projects/`. Integrated local production preview: `http://localhost:3101/`.
