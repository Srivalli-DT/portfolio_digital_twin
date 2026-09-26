import { lazy, Suspense } from 'react';
import { useFilm } from '../state/store';

// Each puzzle is downloaded only when its canister is first opened.
const PUZZLES = {
  I: lazy(() => import('./FocusPuzzle')),
  II: lazy(() => import('./SplicePuzzle')),
  III: lazy(() => import('./CanisterPuzzle')),
};

// Shows the open reel's puzzle. `key` makes each puzzle start fresh when you switch reels.
export default function PuzzleOverlay() {
  const reel = useFilm((state) => state.activeReel);
  if (!reel) return null;
  const Puzzle = PUZZLES[reel];
  return (
    <Suspense fallback={null}>
      <Puzzle key={reel} />
    </Suspense>
  );
}
