import { useEffect } from 'react';
import { focusPuzzle } from '../content/puzzles';
import { useFilm } from '../state/store';
import PuzzleFrame from './PuzzleFrame';
import styles from './FocusPuzzle.module.css';

// How long the lens must stay in focus before it counts (so sweeping past doesn't solve it).
const HOLD_MS = 600;

// Puzzle I: pull focus until the frame on the sheet is sharp. The slider is the accessible twin
// of the 3D focus knob (FocusKnob.tsx); both change the same `focus` value in the store.
export default function FocusPuzzle() {
  const focus = useFilm((state) => state.focus);
  const setFocus = useFilm((state) => state.setFocus);
  const solvePuzzle = useFilm((state) => state.solvePuzzle);
  const solved = useFilm((state) => state.solved.includes('I'));
  const inFocus = Math.abs(focus - focusPuzzle.target) <= focusPuzzle.tolerance;

  useEffect(() => {
    if (solved || !inFocus) return;
    const timer = window.setTimeout(solvePuzzle, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [inFocus, solved, solvePuzzle]);

  return (
    <PuzzleFrame
      reel="I"
      name={focusPuzzle.name}
      instructions={focusPuzzle.instructions}
      solvedText={focusPuzzle.solvedText}
    >
      {/* A native range input: arrow keys, touch and screen readers all work for free. */}
      <input
        className={styles.slider}
        type="range"
        min={0}
        max={100}
        step={1}
        value={solved ? focusPuzzle.target : focus}
        onChange={(event) => setFocus(Number(event.target.value))}
        disabled={solved}
        aria-label={focusPuzzle.sliderLabel}
        autoFocus
      />
    </PuzzleFrame>
  );
}
