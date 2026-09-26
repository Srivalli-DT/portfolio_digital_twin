# SPEC — "{{YOUR_NAME}}: A Film in Three Reels"

A minimal, cinematic student portfolio. One 3D scene, one creature, three projects, three small puzzles.
Static site, built with Vite + React Three Fiber, deployed free on GitHub Pages.

> Placeholders look like `{{THIS}}`. Section 12 lists everything you need to supply.

---

## 1. The idea in one paragraph

The visitor enters a quiet A24-style short film. There's a foggy field at dusk with an old film projector on a wooden stool. Its beam lands on a white bedsheet hanging from a line. A crow sits on the projector. **The crow is you**: your digital twin. It speaks in subtitles, answers questions in your voice, and keeps the reels. Each of your three projects is a film reel. To play a reel, the visitor solves one small projector puzzle (focus the lens, splice the frames, open the canister). The reel then plays on the sheet, and the case study appears as an overlay. After all three reels, the credits roll with your About and contact info. The crow flies off, and the film ends.

**Why it holds together:** everything is a piece of filmmaking. The puzzles are film tasks, the projects are reels, the About section is credits, the transitions are film cuts, and the guide is the one creature who lives in this world. Nothing on the site sits outside that metaphor.

## 2. Goals and non-goals

**Goals**
- A recruiter can see all 3 projects and contact info in **under 60 seconds** (skip everything).
- A curious visitor gets a 3–5 minute experience that feels crafted and calm, not busy.
- It runs well on a mid-range laptop and a phone.
- A beginner can maintain it: all text and project data live in `src/content/`.
- Free to host: a static build on GitHub Pages, no backend, no API keys.

**Non-goals (cut on purpose)**
| Cut | Why |
|---|---|
| Human / realistic avatar | The crow *is* the avatar. A second character splits attention. |
| LLM-powered chat, voice | You chose scripted. It's free, safe, and honest, and it can't say something wrong about you. It could be a later upgrade (section 11). |
| Walkable world, physics, character controller | Heavy, hard for beginners, and it fights the "minimal" goal. The camera moves *for* the visitor, like a director would. |
| Multiple pages / router | One scene, one state machine. The film is continuous. |
| Contact form / EmailJS | A mailto link plus socials in the credits is enough and needs no backend. |
| Many effects (bloom, glitch, particles everywhere) | A24 restraint: grain, vignette, fog, one warm light. |

## 3. Experience flow (the "shot list")

```
[0 Slate] → [1 Title card] → [2 Field] ⇄ [Crow dialogue]
                                 │
                 ┌───────────────┼───────────────┐
            [Puzzle I]       [Puzzle II]     [Puzzle III]   (any order, III needs clues)
                 │               │               │
            [Reel I plays]  [Reel II plays] [Reel III plays]
                 └───────────────┴───────────────┘
                                 │
                           [3 Credits] → [End: "fin." + replay]
```

**0 — Slate (entry screen).** Black screen with small mono text: `{{YOUR_NAME}} — a film in three reels`. There are two buttons: `Enter (with sound)` and `Enter (silent)`. There's also a small link: `Watch the plain cut →` (the no-WebGL version, section 8). This screen gives the browser the click it needs before audio can play, and it's where assets preload.

**1 — Title card.** Hard cut to black. A centered serif title fades in and holds for about 2s: *"{{FILM_TITLE}}"*, then *"a film by {{YOUR_NAME}}"*. Fade out.

**2 — The Field (hub).** Letterbox bars (2.39:1) settle in. The camera does a slow dolly-in toward the projector and sheet. The crow turns its head to the camera, and the first subtitle appears: *"You came. Good. I've been keeping the reels."*
- Three film canisters sit at the foot of the stool, labelled I, II, III. Hovering one tilts it slightly and shows the project's working title in mono.
- Clicking the crow opens the dialogue menu (section 5).
- Clicking a canister starts that reel's puzzle.
- Header, always visible and tiny: name (left), `sound on/off`, `plain cut`, and a progress mark `● ○ ○` (right).

**Puzzle → Reel.** The camera pushes in to the projector. The puzzle UI appears (section 6). When it's solved, the projector clicks, the beam brightens and flickers, and the project's hero image or clip plays on the sheet. A side panel slides in with the case study (section 7). Closing it cuts back to the field and marks the canister as watched.

**3 — Credits.** They unlock after all 3 reels, or at any time from the header (`credits`). The letterbox opens to full frame. The camera tilts up to the dusk sky and the credits roll: About (as "Written & directed by"), skills (as "Crew"), education, links, and "Special thanks". Then the crow flies off-frame, and the screen shows *fin.* and `replay` / `back to field`.

## 4. The creature: `{{CROW_NAME}}` the crow

- **Role:** your digital twin, and the only character. It speaks in first person *as you* ("I built this in my second year…") with a slight crow flavour ("…I like shiny problems.").
- **Look:** stylized low-poly, flat or soft shading, matte blue-black with a faint green sheen, one small warm catchlight in the eye. About 2–5k triangles. It should read as a silhouette first.
- **Model requirement (important):** the model must have **separate named parts**: `Body`, `Head`, `Beak_Upper`, `Beak_Lower`, `Wing_L`, `Wing_R`. That lets us animate it *in code* (head tracking, talking, hops) without needing baked animations. Baked clips (idle, hop, fly) are a bonus.
- **Behaviours** (all procedural, subtle):
  - Idle breathing: a slow body scale of ±1.5%.
  - The head tracks the cursor with delay and clamped angles, and sometimes tilts 20° like it's curious.
  - Beak open/close while subtitles type out.
  - A small hop when the visitor solves a puzzle.
  - Fly-away at the credits (a baked clip, or a simple arc with wing flaps).
  - It caws once on click (only when sound is on, and at most once every 5s).
- **Sourcing path (beginner-friendly):**
  1. **Phase 1:** Claude Code builds a placeholder crow from primitives (cones and spheres) with the same part names, so all behaviour works on day one.
  2. **Phase 7:** Swap in a real GLB. Options: a CC0 bird from Poly Pizza (filter licence = CC0 so no credit is required), a Sketchfab model under a licence you can use, or one you model in Blender. Re-parent or rename its parts to match the names above.

## 5. Digital twin dialogue (scripted)

- Subtitles sit bottom-center inside the letterbox: an italic serif, a soft text-shadow, and a typewriter effect at about 40 chars/sec. Click to finish a line instantly, and click again to continue.
- The menu offers 4–6 question "chips" in mono above the subtitles. There's no free-text input.
- The data is a small node graph in `src/content/dialogue.ts`:

```ts
type Node = { id: string; lines: string[]; options: { label: string; next: string | 'close' }[] };
```

- Starter topics (you write the answers):
  - *"Who are you?"* → an intro, and an honest note: "I'm a scripted twin: everything I say, {{YOUR_NAME}} wrote."
  - *"What do you make?"* → a one-line summary of your hybrid (code + visual) practice.
  - *"What are you looking for?"* → internships, collaborations, and so on.
  - *"How old are you, crow?"* → **this is where the clue for Puzzle III lives**: "Four winters." (see section 6)
  - *"How was this made?"* → the stack in one line, plus a link to the repo.
  - *"How do I reach you?"* → email and links, with an offer to jump to the credits.
- **Hints:** if a puzzle is open and the visitor clicks the crow, it gives that puzzle's hint instead of the menu.

## 6. Puzzles (small, fair, skippable)

Rules for all puzzles:
- Each takes **under 60 seconds** for a first-timer. You don't need to know anything outside the site.
- There is **always** a `skip scene →` link (small mono text, bottom-right). Skipping counts as solved.
- After 2 failed tries or 45 seconds, the crow offers a hint in a subtitle.
- All puzzles work with a mouse, touch, and keyboard. There's no pixel hunting.
- Answers and hints live in `src/content/puzzles.ts`.

| # | Name | What you do | Feels like | Gives |
|---|---|---|---|---|
| I | **Focus** | Drag the focus knob on the projector's side, or use a slider or the ←/→ keys, until the blurred image on the sheet is sharp. A "click" plays when you're within tolerance. | Pulling focus on set | Frame number **7** printed in the corner of the sharp frame |
| II | **Splice** | Four film frames of a tiny sequence (the crow landing) are shuffled. Drag or tap to put them in order. | Editing on a Steenbeck | Frame number **2** on the film leader |
| III | **Canister** | A film canister with a 3-dial number lock. | Opening the last reel | The final reel |

**How they connect:** Puzzle III's code is **7-2-4**: Reel I's frame, Reel II's frame, and the crow's age from the dialogue. So the puzzles, the reels, and the twin all feed each other. If someone opens III first, the crow's hint says: *"The numbers are in the other reels. And ask me my age."* Skipping I or II still shows its number on the solved frame, so the chain never breaks.

**Implementation notes:** Puzzle I is a 3D interaction (a focus knob on the projector's side, where the puzzle camera can see it) with an HTML slider as the accessible twin. The image blur is either a blur on the sheet texture or a `DepthOfField` focus change. Puzzles II and III are **HTML overlays** (easier, accessible, work well on mobile), styled like film objects.

## 7. Reels (the 3 projects)

Each project in `src/content/projects.ts`:

```ts
{
  id: 'reel-1',
  reel: 'I',
  title: '{{PROJECT_TITLE}}',
  logline: 'One sentence, like a film logline.',
  year: '2026',
  role: 'Solo — design + code',
  tools: ['React', 'Blender'],
  media: { poster: 'images/reels/reel-1.webp', clip?: 'video/reel-1.mp4' },  // clip is optional, muted, ≤ 4MB
  body: ['Problem, 2–3 sentences.', 'What I did.', 'What I learned / result.'],
  links: [{ label: 'Live', href: '…' }, { label: 'Code', href: '…' }],
}
```

- On the sheet: the poster, or a looping muted clip, with a slight projector flicker and a warm cast.
- Panel: a right-side HTML overlay (a bottom sheet on mobile). The top reads `REEL I` in mono, then the title in serif, the logline in italic, a meta row, the 3 body paragraphs, and the links. Close it with `Esc`, `×`, or by clicking the field.

**Chosen projects** (decided 2026-09-26, from github.com/Srivalli-DT, public repos + collaborations):
- Reel I: Space Atlas (`Srivalli-DT/Space-Atlas-backend-codes`), own repo
- Reel II: Memory of a City (`Meghna-K03/Memory-of--a-city`), collab
- Reel III: IoT Lab Inventory Management (`ibrahimarshath/IoT-Lab-Inventory-Management`), collab
- **More work** (no reel, no puzzle; a plain list in the credits and the plain cut): Help-Desk Bug Fix (`Srivalli-DT/Help-Desk-Bug-Fix`), eDoc Hospital Appointments (`Meghna-K03/Hospital-appointments`). Stored as `moreWork` in `src/content/projects.ts`.

## 8. The "plain cut" (accessibility + fallback)

A plain HTML page with the same content and no WebGL: name, a one-line intro, the 3 projects (poster, logline, body, links), and the About and contact info. It shows when:
- the visitor clicks `plain cut`,
- WebGL isn't available, or
- `prefers-reduced-motion: reduce` is set. In that case, show the choice on the slate with the plain cut preselected.

This is also what makes the site recruiter-proof.

## 9. Visual & motion language

**Palette** (CSS tokens + scene):
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0d0c0a` | background, letterbox |
| `--bone` | `#e9e3d6` | text, the sheet |
| `--fog` | `#6f7468` | fog, secondary text |
| `--moss` | `#3b4032` | ground, dusk shadow |
| `--lamp` | `#d9a441` | projector light, the *only* accent |

**Type:** one serif for title cards and subtitles (e.g. EB Garamond or Cormorant) and one mono for UI and labels (e.g. IBM Plex Mono). Load them self-hosted or from Google Fonts, 2 weights max each.

**Post-processing** (via `@react-three/postprocessing`, kept light):
- Noise at about 0.03 opacity (film grain, animated; static when reduced motion is on)
- Vignette (darkness about 0.6)
- A subtle color grade: lower saturation, lifted blacks (HueSaturation + BrightnessContrast, or a LUT later)
- Optional depth of field *only* during Puzzle I and on desktop
- Scene fog in `--fog`

**The only 5 transitions allowed** (consistency is what makes it feel directed):
1. **Hard cut to black**: a 300ms fade to `--ink`, a hold of 200–600ms, then a fade in. Used between major states.
2. **Title card**: a serif line centered on black. Used for the intro, `REEL I/II/III`, and *fin.*
3. **Dolly**: the camera eases to a preset shot over about 2.5s with `power2.inOut`. No orbiting.
4. **Letterbox change**: the bars animate between 2.39:1 and full frame (field ↔ credits).
5. **Projector flicker**: a brightness jitter on the beam and sheet when a reel starts.

Ambient only: slow fog drift, gate weave (a ±0.5px frame jitter), and the crow's idle motion.
**Banned:** bouncy or elastic easing, spins, parallax stacks, cursor trails, confetti, typewriter effects on anything other than subtitles.

**Camera shots** (preset positions in `src/scene/shots.ts`): `wide` (establishing), `field` (hub), `projector` (puzzles), `sheet` (reel playback), `sky` (credits).

**Sound** (off by default, toggle in header): a low field ambience loop (wind, crickets), a projector whirr while a reel plays, a click for focus and success, and one caw. All CC0 (e.g. freesound.org, filter by CC0), each ≤ 300KB, `.mp3` or `.ogg`. One master volume, and the choice is remembered in localStorage.

## 10. Technical design

**Stack**
- Vite + React + TypeScript (static build, fast dev server)
- three, @react-three/fiber, @react-three/drei (helpers: `useGLTF`, `Html`, `Text`, `PerformanceMonitor`, `AdaptiveDpr`, `useProgress`)
- @react-three/postprocessing (grain, vignette, grade)
- zustand (one small store for the state machine and progress)
- gsap (all timed transitions, both 3D and HTML, so there's one easing vocabulary)
- Tooling: ESLint + Prettier, `tsc --noEmit` for type checking. Tests are optional (Vitest for store logic if wanted).

**State machine** (`src/state/store.ts`):

```ts
type Scene = 'slate' | 'title' | 'field' | 'puzzle' | 'reel' | 'credits' | 'plain';
state = { scene, activeReel: 'I'|'II'|'III'|null, solved: Set, watched: Set,
          sound: boolean, dialogueNode: string|null, hintsShown: number }
```

UI and scene both read from the store. Only store actions change scenes, and each action runs its transition. Progress (solved, watched, sound) persists to localStorage, with every read and write wrapped in try/catch.

**Folder structure**

```
.
├── CLAUDE.md
├── docs/SPEC.md
├── .github/workflows/deploy.yml
├── public/
│   ├── models/        crow.glb, projector.glb (optimized)
│   ├── images/reels/  reel-1.webp …
│   ├── video/         optional clips
│   └── audio/
├── src/
│   ├── main.tsx, App.tsx
│   ├── content/       site.ts, projects.ts, dialogue.ts, puzzles.ts   ← only files you edit for text
│   ├── state/         store.ts
│   ├── scene/         Stage.tsx, Field.tsx, Crow.tsx, Projector.tsx, Sheet.tsx,
│   │                  Canisters.tsx, CameraRig.tsx, shots.ts, Effects.tsx
│   ├── puzzles/       FocusPuzzle.tsx, SplicePuzzle.tsx, CanisterPuzzle.tsx
│   ├── ui/            Slate, TitleCard, Letterbox, Header, Subtitles, DialogueMenu,
│   │                  ReelPanel, Credits, SkipButton, PlainCut
│   ├── lib/           asset.ts (BASE_URL helper), audio.ts, storage.ts, transitions.ts
│   └── styles/        tokens.css, global.css
```

**Performance budget**
- Initial JS ≤ 500KB gzipped. Lazy-load the puzzles and credits.
- All models together ≤ 2MB. Each GLB is optimized with `gltf-transform optimize in.glb out.glb --texture-compress webp --texture-resize 1024`. If Draco or Meshopt compression is used, configure the matching decoder (drei's `useGLTF` handles Draco).
- Textures ≤ 1024px, WebP. Reel posters ≤ 250KB.
- Target 60fps on a mid laptop and 30+ on a phone. `dpr={[1, 2]}`, and `PerformanceMonitor` drops DOF, then grain, then DPR when frames fall.
- Mobile: no DOF, fewer fog layers, bottom-sheet panels, and 44px touch targets.

**Accessibility**
- Every interactive 3D object has an HTML equivalent (the canisters are also real buttons in the header menu).
- Subtitles sit in an `aria-live="polite"` region, and focus is visible and trapped in open panels.
- `Esc` closes panels and puzzles.
- Reduced motion: cuts instead of dollies, static grain, no weave.
- Text contrast is at least 4.5:1 on `--ink`.

**GitHub Pages deployment**
- In `vite.config.ts`, set `base: '/<repo-name>/'`, or `'/'` if the repo is named `<username>.github.io`.
- **Every** asset path goes through a helper that prefixes `import.meta.env.BASE_URL`. Hard-coded `/models/...` works in dev but 404s on Pages. This is the #1 bug in these projects.
- Use the official Vite GitHub Pages workflow (checkout → setup-node → `npm ci` → `npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact` with `path: dist` → `actions/deploy-pages`). Check vite.dev/guide/static-deploy for current action versions.
- In the repo, go to Settings → Pages → Source: **GitHub Actions**.

## 11. Build phases

Each phase ends in a working, pushed state. Don't start the next phase until the current one passes its "done when" check.

| Phase | Build | Done when |
|---|---|---|
| **0. Skeleton & deploy** | Vite+React+TS, dependencies, lint/format, the `asset()` helper, deploy workflow, and an empty black canvas with "hello" | The GitHub Pages URL shows the page |
| **1. Blockout scene** | Ground, fog, dusk sky, lights, and primitive projector, sheet, canisters, and crow (with named parts), plus CameraRig with shots and Effects (grain, vignette, grade) | The field looks moody with placeholders at 60fps |
| **2. Film language** | Store + state machine, Slate, TitleCard, Letterbox, Header, hard cut, dolly, all 5 transitions | You can click slate → title → field → credits placeholder with correct transitions |
| **3. The twin** | Crow procedural behaviours, Subtitles, DialogueMenu, and the content in `dialogue.ts` | You can have a full conversation and the beak moves while it talks |
| **4. Puzzles** | Focus, Splice, and Canister, plus skip and hints, and the 7-2-4 chain | All 3 are solvable with mouse, touch, and keyboard, and skip works |
| **5. Reels** | Sheet media, ReelPanel, and `projects.ts` with your real content | Each project reads well, and all links work |
| **6. Credits, plain cut, a11y** | Credits roll, fly-away, *fin.*, the PlainCut page, reduced motion, and the WebGL fallback | A recruiter path takes under 60s, and reduced-motion is tested |
| **7. Real assets & polish** | Swap in real GLBs (optimized), sound, mobile tuning, loading screen on the slate | The budget above is met, it's tested on a real phone, and Lighthouse is ≥ 80 |

**Later, optional:** upgrade the crow to a real AI twin. That would take a tiny serverless proxy (Cloudflare Worker) to an LLM API, grounded in `content/`. GitHub Pages can't hold secrets, so it needs somewhere other than Pages. Keep the scripted tree as a fallback.

## 12. What you need to provide

- [ ] Your name, and the film title (e.g. *"Small Hours"*, *"The Field"*, or your own)
- [ ] The crow's name (ideas: Ash, Wick, Moss, Soot)
- [ ] For 3 projects: title, logline, year, role, tools, 3 short paragraphs, links, and one poster image (16:9, or 2.39:1 to match the letterbox). A short muted clip is optional.
- [ ] Answers for the crow's 6 dialogue topics, in your own voice
- [ ] About (3–4 sentences), skills, education, email, GitHub, LinkedIn, and any other links
- [ ] (Later) a crow GLB with named parts, a projector GLB, and 4 CC0 sound files

## 13. How to start in Claude Code

1. Create an empty GitHub repo and clone it. Put `CLAUDE.md` in the root and this file at `docs/SPEC.md`.
2. Run `claude` in that folder.
3. First prompt: *"Read docs/SPEC.md. We're doing Phase 0 only. Plan it first, explain each step simply since I'm a beginner, then build it and help me push and deploy."*
4. After each phase: check the "done when" line, commit, push, and open the Pages URL. Then prompt *"Phase N next."*
5. If Claude repeats a mistake, add one concrete line to `CLAUDE.md`.

## 14. Reference repos & docs

- **mohitvirli/mohitvirli.github.io**: R3F + Drei + GSAP + Zustand portfolio deployed to GitHub Pages. The closest stack match.
- **HxnDev/Portfolio**: a cinematic Vite + R3F + postprocessing portfolio with a gh-pages Actions workflow, and a good example of keeping per-frame work off React renders.
- **Chris-B/Portfolio-Website**: an R3F world with an avatar Q&A room. It's a reference for the twin *pattern*, but we skip its backend.
- **sitek94/vite-deploy-demo**: a minimal Vite → GitHub Pages walkthrough (the `base` setting).
- **pmndrs/react-postprocessing**: Noise, Vignette, DepthOfField, and friends.
- **donmccurdy/glTF-Transform**: the model optimization CLI.
- **poly.pizza**: free low-poly models. Filter by CC0.
- Inspiration: Bruno Simon's portfolio (for craft, but we deliberately keep ours far smaller), and A24 title design (serif, restraint, lots of black).
