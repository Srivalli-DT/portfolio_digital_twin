// Puzzle text, answers and hints. The three puzzles chain together:
// Reel I gives 7, Reel II gives 2, the crow's age (dialogue.ts, "Four winters") gives 4 → the lock is 7-2-4.

export const puzzleText = {
  reelLabel: 'REEL {reel}',
  skip: 'skip scene →',
  askHint: 'ask {crow} for a hint',
  close: 'close puzzle',
  playReel: 'play reel →',
};

export const focusPuzzle = {
  name: 'Focus',
  instructions:
    'Pull focus. Drag the knob on the side of the projector, or use the slider or ← →, until the frame is sharp.',
  sliderLabel: 'Lens focus',
  hint: 'Slow down near the middle. It sharpens later than you think.',
  solvedText: 'Sharp. Something is printed in the corner of the frame: 7.',
  // Where the slider (0–100) is in focus, and how close counts.
  target: 62,
  tolerance: 4,
  start: 12,
  // The number printed on the frame (first digit of the lock).
  clue: 7,
};

export const splicePuzzle = {
  name: 'Splice',
  instructions:
    'The crow’s landing is cut out of order. Pick two frames to swap them (or drag one onto another), then splice.',
  // Spoken label for each frame: {n} = its slot, {pose} = what the frame shows.
  frameLabel: 'Slot {n}: {pose}',
  selectedLabel: '(selected)',
  // What each frame shows, from first (0) to last (3). Read by screen readers.
  poses: [
    'the crow high in the sky, wings raised',
    'the crow gliding lower',
    'the crow just above the wire, wings braking',
    'the crow perched on the wire',
  ],
  leaderLabel: 'Film leader showing the number {clue}',
  check: 'splice',
  wrong: 'It doesn’t run yet.',
  hint: 'Watch the height. A landing only ever comes down.',
  solvedText: 'It runs. The leader carries a number: 2.',
  // The shuffled starting order (frame 0 = highest in the sky, 3 = perched).
  startOrder: [2, 0, 3, 1],
  clue: 2,
};

export const canisterPuzzle = {
  name: 'Canister',
  instructions: 'Three dials. Three numbers.',
  dialLabel: 'Dial {n}',
  up: 'up',
  down: 'down',
  open: 'open',
  wrong: 'Still locked.',
  hint: 'The numbers are in the other reels. And ask me my age.',
  solvedText: 'The lid gives. The last reel is inside.',
  code: [7, 2, 4],
};

export const hints = {
  I: focusPuzzle.hint,
  II: splicePuzzle.hint,
  III: canisterPuzzle.hint,
} as const;

// After this long without solving, or this many wrong tries, the crow offers a hint.
export const HINT_AFTER_SECONDS = 45;
export const HINT_AFTER_FAILS = 2;
