# CLAUDE.md

Cinematic student portfolio: one foggy 3D field, a crow digital twin (scripted, no AI API), three projects as film reels unlocked by three small puzzles. A24 mood: quiet, minimal, restrained.
Full design: `docs/SPEC.md` (not auto-loaded, to save context). Read the relevant spec section before building a feature. If the spec and a request conflict, ask.

## About me (the developer)
- I'm a beginner. Before each phase, give a short plan in plain language. After it, tell me exactly what to run and what I should see.
- Work one phase at a time (SPEC section 11). Stop when the phase's "done when" check passes, then help me commit and push.
- Prefer simple, readable code over clever code. Add a one-line comment above anything non-obvious.

## Commands
- `npm run dev`: local dev server
- `npm run build`: type-check + production build to `dist/`
- `npm run preview`: serve the built site (use this to test the GitHub Pages base path)
- `npm run lint` / `npm run format`
- Before saying a task is done, run `npm run build` and `npm run lint` and fix all errors.

## Stack (don't add dependencies without asking)
Vite + React + TypeScript · three · @react-three/fiber · @react-three/drei · @react-three/postprocessing · zustand · gsap

## Layout
- `src/content/`: ALL user-facing text and data (site, projects, dialogue, puzzles). Never hard-code copy in components.
- `src/state/store.ts`: the single zustand store and scene state machine. Only store actions change `scene`.
- `src/scene/`: 3D components (inside `<Canvas>`). `src/ui/` and `src/puzzles/`: HTML overlays (outside `<Canvas>`).
- `src/lib/`: helpers (`asset.ts`, `audio.ts`, `storage.ts`, `transitions.ts`).
- `public/`: models, images, video, audio.

## Hard rules
- **Asset paths:** always use `asset('models/crow.glb')` from `src/lib/asset.ts` (prefixes `import.meta.env.BASE_URL`). Never write a path starting with `/`. It breaks on GitHub Pages.
- **Per-frame work:** animate in `useFrame` by mutating refs. Never call `setState` inside `useFrame`.
- **Transitions:** only the 5 in SPEC section 9 (cut to black, title card, dolly, letterbox, projector flicker). Use gsap with `power2.inOut` or `power1.out`. No bounce/elastic, no spins, no new effects.
- **Palette:** use only the CSS tokens in `src/styles/tokens.css` (`--ink --bone --fog --moss --lamp`). `--lamp` is the only accent.
- **Fonts:** one serif (titles, subtitles), one mono (UI). Nothing else.
- **Skippable:** every puzzle has a working `skip scene →`. The recruiter path to all projects + contact must stay under 60 seconds.
- **Accessibility:** every clickable 3D object has an HTML/keyboard equivalent. `Esc` closes panels. Respect `prefers-reduced-motion` (cuts instead of dollies, static grain).
- **Storage:** wrap every `localStorage` read/write in try/catch (see `src/lib/storage.ts`).
- **Crow model:** code relies on part names `Body Head Beak_Upper Beak_Lower Wing_L Wing_R`. Keep them when swapping models.
- **No secrets, no backend.** This is a static site.

## Performance budget
- Models total ≤ 2MB; textures ≤ 1024px WebP; reel posters ≤ 250KB; audio files ≤ 300KB.
- Optimize every GLB before committing: `npx @gltf-transform/cli optimize in.glb out.glb --texture-compress webp --texture-resize 1024`
- Canvas `dpr={[1, 2]}`; lazy-load puzzles and credits; drei `PerformanceMonitor` degrades DOF → grain → DPR.

## Style
- TypeScript strict. Function components; one component per file, PascalCase filenames.
- Keep components under ~150 lines; split if bigger.
- CSS modules or plain CSS with tokens. No Tailwind or UI kits.

## Deploy
- GitHub Pages via `.github/workflows/deploy.yml` (official Vite workflow: upload-pages-artifact + deploy-pages).
- `vite.config.ts` `base` must be `'/<repo-name>/'` (or `'/'` for a `<user>.github.io` repo).
- Repo Settings → Pages → Source: GitHub Actions.

## Git
- Small commits, one per working step, imperative messages ("Add focus puzzle").
- Never commit `node_modules/`, `dist/`, or unoptimized source models (keep those in `raw-assets/`, gitignored).
