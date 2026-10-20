# Portfolio media

Updated 2026-10-20. Production-ready MP4s and matching posters are grouped by project. `manifest.json` in each folder records paths, dimensions, duration, size, and provenance.

| Project | Home thumbnails | Project page |
| --- | --- | --- |
| RENEW | Mood loop; chart loop for Redesign; App Store release still for Upgrade; app-context still for Backend | App overview; Statistics, new goal, and modules films; release and app-context stills |
| Sprout | Sources interaction; wordless retrieval, memory, and evaluation studies | Conversation film; three abstract motion studies |
| Code Coach | Approved 20-second hint → edit → run loop | Landing-page hero; workspace, submission, discussion, and résumé stills; coaching, execution, and courses videos; architecture diagram |
| Stitches | Existing homepage and collection photography | Before/after wipe plus the redesigned homepage and collection images |

All films and loops silently autoplay and repeat without playback controls, including case-page films. Playback stops offscreen or when the tab is hidden. Code Coach's approved homepage loop runs for 20 seconds to show a complete development sequence.

Finished phone compositions include their full display, native notch, frame, and white canvas. Use `fit: contain` for thumbnails and `hero.type: composition`; do not put them inside another phone frame. Mobile case heroes reframe the white margins while keeping the entire phone visible.

Sprout's interface footage uses a local demonstration conversation and staged RENEW app data. The abstract studies use black linework, white space, and signal orange, with no text inside the artwork. They suggest gathering, retaining, comparing, and structuring information; they do not depict measured results or a literal architecture.

Code Coach uses the original React interface running locally, with illustrative problems, courses, discussion comments, and résumé details. Coaching is scripted. Run and Submit use a bounded local simulation for the featured Python solution; the displayed outputs were checked with Python. Submit retains the original inline result panel, with unavailable performance measurements identified instead of invented. The diagram describes the original cloud application and is grounded in its README, design specification, and frontend request paths. The old landing-page film remains archived.

All 13 earlier RENEW videos/loops remain available in `renew/`, alongside the Upgrade and Backend stills. Sprout has two interface films and three active abstract studies. Code Coach has four active videos; Stitches has one. Superseded labeled Sprout graphics remain available but are marked archived in the manifest and are not used by the site. Earlier originals and editable production files remain in:

`/Users/derek/.codex/visualizations/2026/10/08/01a11d13-cd05-7d71-9e9c-c1fc51747fa2/renew-motion/`

The active abstract studies are in `studio/src/StudiesV2.tsx`. Earlier illustrations, Code Coach, and Stitches compositions are in `studio/src/Systems.tsx`; capture/edit records are in `other-projects/`. Standalone review: `http://localhost:4318/other-projects/`. Integrated local production preview: `http://localhost:3101/`.

The approved Code Coach set and its editable sources are in `/Users/derek/.codex/visualizations/2026/10/20/01a15a49-a73d-70f3-b6d7-f5a1b847f132/`. Its `README.md` records capture and rendering details.
