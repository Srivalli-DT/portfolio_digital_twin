import { create } from 'zustand';
import { focusPuzzle, HINT_AFTER_FAILS } from '../content/puzzles';
import { load, save } from '../lib/storage';
import { cutToBlack, fadeFromBlack } from '../lib/transitions';
import type { ShotName } from '../scene/shots';

export type Scene = 'slate' | 'title' | 'field' | 'puzzle' | 'reel' | 'credits' | 'plain';
export type ReelId = 'I' | 'II' | 'III';

type Progress = { solved: ReelId[]; watched: ReelId[] };

type FilmState = {
  scene: Scene;
  // Camera shot the CameraRig moves to, and how: a smooth dolly or an instant cut (during black).
  shot: ShotName;
  shotMode: 'dolly' | 'cut';
  // true = 2.39:1 cinema bars, false = full frame.
  letterbox: boolean;
  activeReel: ReelId | null;
  solved: ReelId[];
  watched: ReelId[];
  sound: boolean;
  dialogueNode: string | null;
  // Hints given for the open puzzle, and wrong tries on it.
  hintsShown: number;
  puzzleFails: number;
  // Puzzle I's lens position, 0–100. Changed by the slider, arrow keys or dragging the focus knob.
  focus: number;
  // Goes up by one each time the projector should flicker on. Projector watches it.
  flickerCount: number;
  // True while a subtitle is typing out: the crow's beak moves.
  talking: boolean;
  // Goes up by one each time the crow should hop. The crow watches it.
  hopCount: number;
  // Where the plain cut's back button returns to.
  plainReturn: 'slate' | 'field';
  // The reel whose "REEL I" title card is showing (before the reel plays).
  reelCard: ReelId | null;

  enter: (withSound: boolean) => void;
  startField: () => void;
  openCredits: () => void;
  closeCredits: () => void;
  openPlain: () => void;
  closePlain: () => void;
  toggleSound: () => void;
  openDialogue: (nodeId?: string) => void;
  chooseOption: (next: string) => void;
  closeDialogue: () => void;
  setTalking: (talking: boolean) => void;
  hop: () => void;
  crowClicked: () => void;
  startPuzzle: (reel: ReelId) => void;
  closePuzzle: () => void;
  solvePuzzle: () => void;
  failAttempt: () => void;
  showHint: () => void;
  setFocus: (value: number) => void;
  playReel: (reel: ReelId) => void;
  beginReel: () => void;
  closeReel: () => void;
  escape: () => void;
};

// Wait for the arrival dolly to finish before the crow speaks.
const GREETING_DELAY_MS = 2800;

const savedProgress = load<Progress>('progress', { solved: [], watched: [] });

// The one store. Components read from it; only these actions change `scene`.
export const useFilm = create<FilmState>()((set, get) => ({
  scene: 'slate',
  shot: 'wide',
  shotMode: 'dolly',
  letterbox: false,
  activeReel: null,
  solved: savedProgress.solved,
  watched: savedProgress.watched,
  sound: load('sound', false),
  dialogueNode: null,
  hintsShown: 0,
  puzzleFails: 0,
  focus: focusPuzzle.start,
  flickerCount: 0,
  talking: false,
  hopCount: 0,
  plainReturn: 'slate',
  reelCard: null,

  // Slate → title card. The slate simply disappears: a cut on black.
  enter: (withSound) => set({ sound: withSound, scene: 'title' }),

  // Title card → field: reveal from black, bars settle in, camera dollies in, projector flickers on.
  startField: () => {
    set((state) => ({
      scene: 'field',
      letterbox: true,
      shot: 'field',
      shotMode: 'dolly',
      flickerCount: state.flickerCount + 1,
    }));
    fadeFromBlack();
    // The crow greets the visitor once the camera has settled (unless they already started talking).
    window.setTimeout(() => {
      if (get().scene === 'field' && get().dialogueNode === null) set({ dialogueNode: 'arrival' });
    }, GREETING_DELAY_MS);
  },

  // Field → credits: bars open to full frame while the camera tilts up to the sky.
  openCredits: () =>
    set({
      scene: 'credits',
      letterbox: false,
      shot: 'sky',
      shotMode: 'dolly',
      activeReel: null,
      dialogueNode: null,
      talking: false,
    }),
  closeCredits: () => set({ scene: 'field', letterbox: true, shot: 'field', shotMode: 'dolly' }),

  openPlain: () => {
    const plainReturn = get().scene === 'slate' ? 'slate' : 'field';
    cutToBlack(() =>
      set({ scene: 'plain', plainReturn, activeReel: null, dialogueNode: null, talking: false }),
    );
  },
  closePlain: () =>
    cutToBlack(() => {
      const scene = get().plainReturn;
      if (scene === 'field') set({ scene, shot: 'field', shotMode: 'cut', letterbox: true });
      else set({ scene });
    }),

  toggleSound: () => set((state) => ({ sound: !state.sound })),

  // The crow only chats in the field.
  openDialogue: (nodeId = 'menu') => {
    if (get().scene === 'field') set({ dialogueNode: nodeId });
  },
  chooseOption: (next) => {
    if (next === 'close') get().closeDialogue();
    else if (next === 'credits') get().openCredits();
    else set({ dialogueNode: next });
  },
  closeDialogue: () => set({ dialogueNode: null, talking: false }),
  setTalking: (talking) => set({ talking }),
  hop: () => set((state) => ({ hopCount: state.hopCount + 1 })),

  // During a puzzle the crow gives that puzzle's hint instead of the menu (SPEC section 5).
  crowClicked: () => {
    if (get().scene === 'puzzle') get().showHint();
    else get().openDialogue();
  },

  // Push in to the projector and open that reel's puzzle.
  startPuzzle: (reel) => {
    const { scene } = get();
    if (scene !== 'field' && scene !== 'puzzle') return;
    // Already solved? Go straight to the reel (keeps the recruiter path short).
    if (get().solved.includes(reel)) {
      get().playReel(reel);
      return;
    }
    set({
      scene: 'puzzle',
      activeReel: reel,
      shot: 'projector',
      shotMode: 'dolly',
      dialogueNode: null,
      talking: false,
      hintsShown: 0,
      puzzleFails: 0,
      focus: focusPuzzle.start,
    });
  },
  closePuzzle: () =>
    set({
      scene: 'field',
      activeReel: null,
      shot: 'field',
      shotMode: 'dolly',
      dialogueNode: null,
      talking: false,
    }),

  // Solving (or skipping) marks the reel solved; the crow hops and the projector flickers.
  solvePuzzle: () => {
    const reel = get().activeReel;
    if (!reel) return;
    set((state) => ({
      solved: state.solved.includes(reel) ? state.solved : [...state.solved, reel],
      flickerCount: state.flickerCount + 1,
      dialogueNode: null,
      talking: false,
    }));
    get().hop();
  },
  failAttempt: () => {
    const puzzleFails = get().puzzleFails + 1;
    set({ puzzleFails });
    if (puzzleFails === HINT_AFTER_FAILS && get().hintsShown === 0) get().showHint();
  },
  showHint: () => {
    const reel = get().activeReel;
    if (get().scene !== 'puzzle' || !reel) return;
    set((state) => ({ dialogueNode: `hint-${reel}`, hintsShown: state.hintsShown + 1 }));
  },
  setFocus: (value) => set({ focus: Math.min(100, Math.max(0, value)) }),

  // Puzzle → "REEL I" title card (App shows it while reelCard is set) → beginReel.
  playReel: (reel) => {
    const { scene } = get();
    if (scene !== 'field' && scene !== 'puzzle') return;
    set({ reelCard: reel, activeReel: reel, dialogueNode: null, talking: false });
  },
  // Title card done: cut to the sheet, flicker the projector on, fade up from black.
  beginReel: () => {
    if (!get().reelCard) return;
    set((state) => ({
      scene: 'reel',
      shot: 'sheet',
      shotMode: 'cut',
      reelCard: null,
      flickerCount: state.flickerCount + 1,
    }));
    fadeFromBlack(1);
  },
  // Hard cut back to the field and mark the reel watched. The last new reel rolls the credits.
  closeReel: () => {
    const reel = get().activeReel;
    if (get().scene !== 'reel' || !reel) return;
    cutToBlack(() => {
      const before = get().watched;
      const watched = before.includes(reel) ? before : [...before, reel];
      const justFinished = before.length < 3 && watched.length === 3;
      if (justFinished) {
        set({
          watched,
          scene: 'credits',
          letterbox: false,
          shot: 'sky',
          shotMode: 'cut',
          activeReel: null,
        });
      } else {
        set({ watched, scene: 'field', shot: 'field', shotMode: 'cut', activeReel: null });
      }
    });
  },

  // Esc closes the topmost thing: the chat, then a puzzle or reel, then credits or the plain cut.
  escape: () => {
    const { dialogueNode, scene } = get();
    if (dialogueNode) get().closeDialogue();
    else if (scene === 'puzzle') get().closePuzzle();
    else if (scene === 'reel') get().closeReel();
    else if (scene === 'credits') get().closeCredits();
    else if (scene === 'plain') get().closePlain();
  },
}));

// Remember progress and the sound choice between visits.
useFilm.subscribe((state) => {
  save('progress', { solved: state.solved, watched: state.watched });
  save('sound', state.sound);
});
