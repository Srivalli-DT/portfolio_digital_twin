import { useState, type DragEvent } from 'react';
import { splicePuzzle } from '../content/puzzles';
import { useFilm } from '../state/store';
import FilmLeader from './FilmLeader';
import PuzzleFrame from './PuzzleFrame';
import SpliceFrame from './SpliceFrame';
import styles from './SplicePuzzle.module.css';

const SOLVED_ORDER = [0, 1, 2, 3];

// Puzzle II: put four shuffled frames of the crow landing back in order.
// Tap/click (or Enter) two frames to swap them; with a mouse you can also drag one onto another.
export default function SplicePuzzle() {
  const solved = useFilm((state) => state.solved.includes('II'));
  const solvePuzzle = useFilm((state) => state.solvePuzzle);
  const failAttempt = useFilm((state) => state.failAttempt);
  const [order, setOrder] = useState<number[]>(splicePuzzle.startOrder);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const shown = solved ? SOLVED_ORDER : order;

  const swap = (a: number, b: number) => {
    setOrder((current) => {
      const next = [...current];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setMessage('');
  };

  const pick = (slot: number) => {
    if (selected === null) {
      setSelected(slot);
      return;
    }
    if (selected !== slot) swap(selected, slot);
    setSelected(null);
  };

  const check = () => {
    if (order.every((frame, slot) => frame === slot)) {
      solvePuzzle();
    } else {
      setMessage(splicePuzzle.wrong);
      failAttempt();
    }
  };

  const onDrop = (slot: number) => (event: DragEvent) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData('text/plain'));
    if (from !== slot) swap(from, slot);
    setSelected(null);
  };

  return (
    <PuzzleFrame
      reel="II"
      name={splicePuzzle.name}
      instructions={splicePuzzle.instructions}
      solvedText={splicePuzzle.solvedText}
    >
      <div className={styles.strip}>
        {shown.map((frame, slot) => {
          const label = splicePuzzle.frameLabel
            .replace('{n}', String(slot + 1))
            .replace('{pose}', splicePuzzle.poses[frame]);
          return (
            <button
              key={frame}
              className={`${styles.frame} ${selected === slot ? styles.selected : ''}`}
              onClick={() => pick(slot)}
              disabled={solved}
              aria-pressed={selected === slot}
              aria-label={selected === slot ? `${label} ${splicePuzzle.selectedLabel}` : label}
              draggable={!solved}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', String(slot))}
              onDragOver={(event) => event.preventDefault()}
              onDrop={onDrop(slot)}
            >
              <SpliceFrame frame={frame} />
            </button>
          );
        })}
      </div>

      {solved ? (
        <FilmLeader clue={splicePuzzle.clue} />
      ) : (
        <div className={styles.row}>
          <button className={styles.check} onClick={check}>
            {splicePuzzle.check}
          </button>
          <p className={styles.message} role="status">
            {message}
          </p>
        </div>
      )}
    </PuzzleFrame>
  );
}
