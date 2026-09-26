import { useEffect, type ReactNode } from 'react';
import { HINT_AFTER_SECONDS, puzzleText } from '../content/puzzles';
import { site } from '../content/site';
import { useFilm, type ReelId } from '../state/store';
import styles from './PuzzleFrame.module.css';

type PuzzleFrameProps = {
  reel: ReelId;
  name: string;
  instructions: string;
  solvedText: string;
  children: ReactNode;
};

// The shared panel around every puzzle: title, instructions, hint + skip + close, and the solved note.
export default function PuzzleFrame({
  reel,
  name,
  instructions,
  solvedText,
  children,
}: PuzzleFrameProps) {
  const solved = useFilm((state) => state.solved.includes(reel));
  const solvePuzzle = useFilm((state) => state.solvePuzzle);
  const closePuzzle = useFilm((state) => state.closePuzzle);
  const showHint = useFilm((state) => state.showHint);

  // Stuck for a while? The crow offers a hint once (SPEC section 6).
  useEffect(() => {
    if (solved) return;
    const timer = window.setTimeout(() => {
      if (useFilm.getState().hintsShown === 0) showHint();
    }, HINT_AFTER_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [solved, showHint]);

  return (
    <section
      className={styles.panel}
      aria-label={`${puzzleText.reelLabel.replace('{reel}', reel)} ${name}`}
    >
      <header className={styles.top}>
        <p className={styles.label}>
          {puzzleText.reelLabel.replace('{reel}', reel)} · {name}
        </p>
        <button className={styles.close} onClick={closePuzzle} aria-label={puzzleText.close}>
          ×
        </button>
      </header>

      <p className={styles.instructions}>{instructions}</p>
      {children}

      {/* role=status: screen readers announce the solve. */}
      <p className={styles.solved} role="status">
        {solved ? solvedText : ''}
      </p>

      <footer className={styles.bottom}>
        {solved ? (
          <button className={styles.action} onClick={closePuzzle}>
            {puzzleText.backToField}
          </button>
        ) : (
          <>
            <button className={styles.action} onClick={showHint}>
              {puzzleText.askHint.replace('{crow}', site.crowName)}
            </button>
            {/* Skipping counts as solved, so the 7-2-4 chain never breaks. */}
            <button className={styles.action} onClick={solvePuzzle}>
              {puzzleText.skip}
            </button>
          </>
        )}
      </footer>
    </section>
  );
}
