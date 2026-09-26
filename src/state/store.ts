import { create } from 'zustand';
import { load, save } from '../lib/storage';
import { cutToBlack, fadeFromBlack } from '../lib/transitions';
import type { ShotName } from '../scene/shots';

export type Scene = 'slate' | 'title' | 'field' | 'puzzle' | 'reel' | 'credits' | 'plain';
export type ReelId = 'I' | 'II' | 'III';

type Progress = { solved: ReelId[]; watched: ReelId[] };

type FilmState = {
  scene: Scene;
  // Camera shot the CameraRig dollies to.
  shot: ShotName;
  // true = 2.39:1 cinema bars, false = full frame.
  letterbox: boolean;
  activeReel: ReelId | null;
  solved: ReelId[];
  watched: ReelId[];
  sound: boolean;
  dialogueNode: string | null;
  hintsShown: number;
  // Goes up by one each time the projector should flicker on. Projector watches it.
  flickerCount: number;
  // Where the plain cut's back button returns to.
  plainReturn: 'slate' | 'field';

  enter: (withSound: boolean) => void;
  startField: () => void;
  openCredits: () => void;
  closeCredits: () => void;
  openPlain: () => void;
  closePlain: () => void;
  toggleSound: () => void;
};

const savedProgress = load<Progress>('progress', { solved: [], watched: [] });

// The one store. Components read from it; only these actions change `scene`.
export const useFilm = create<FilmState>()((set, get) => ({
  scene: 'slate',
  shot: 'wide',
  letterbox: false,
  activeReel: null,
  solved: savedProgress.solved,
  watched: savedProgress.watched,
  sound: load('sound', false),
  dialogueNode: null,
  hintsShown: 0,
  flickerCount: 0,
  plainReturn: 'slate',

  // Slate → title card. The slate simply disappears: a cut on black.
  enter: (withSound) => set({ sound: withSound, scene: 'title' }),

  // Title card → field: reveal from black, bars settle in, camera dollies in, projector flickers on.
  startField: () => {
    set((state) => ({
      scene: 'field',
      letterbox: true,
      shot: 'field',
      flickerCount: state.flickerCount + 1,
    }));
    fadeFromBlack();
  },

  // Field → credits: bars open to full frame while the camera tilts up to the sky.
  openCredits: () => set({ scene: 'credits', letterbox: false, shot: 'sky' }),
  closeCredits: () => set({ scene: 'field', letterbox: true, shot: 'field' }),

  openPlain: () => {
    const plainReturn = get().scene === 'slate' ? 'slate' : 'field';
    cutToBlack(() => set({ scene: 'plain', plainReturn }));
  },
  closePlain: () => cutToBlack(() => set({ scene: get().plainReturn })),

  toggleSound: () => set((state) => ({ sound: !state.sound })),
}));

// Remember progress and the sound choice between visits.
useFilm.subscribe((state) => {
  save('progress', { solved: state.solved, watched: state.watched });
  save('sound', state.sound);
});
