import { useState } from 'react';
import { canisterPuzzle } from '../content/puzzles';
import { useFilm } from '../state/store';
import Dial from './Dial';
import PuzzleFrame from './PuzzleFrame';
import styles from './CanisterPuzzle.module.css';

// Puzzle III: a film canister with a 3-dial lock. The code is 7-2-4 (Reel I, Reel II, the crow's age).
export default function CanisterPuzzle() {
  const solved = useFilm((state) => state.solved.includes('III'));
  const solvePuzzle = useFilm((state) => state.solvePuzzle);
  const failAttempt = useFilm((state) => state.failAttempt);
  const [digits, setDigits] = useState([0, 0, 0]);
  const [message, setMessage] = useState('');
  const shown = solved ? canisterPuzzle.code : digits;

  const turn = (dial: number) => (delta: 1 | -1) => {
    // Wrap around: 9 + 1 = 0, 0 - 1 = 9.
    setDigits((current) => current.map((d, i) => (i === dial ? (d + delta + 10) % 10 : d)));
    setMessage('');
  };

  const open = () => {
    if (digits.every((d, i) => d === canisterPuzzle.code[i])) {
      solvePuzzle();
    } else {
      setMessage(canisterPuzzle.wrong);
      failAttempt();
    }
  };

  return (
    <PuzzleFrame
      reel="III"
      name={canisterPuzzle.name}
      instructions={canisterPuzzle.instructions}
      solvedText={canisterPuzzle.solvedText}
    >
      <div className={`${styles.tin} ${solved ? styles.open : ''}`}>
        <div className={styles.dials}>
          {shown.map((digit, i) => (
            <Dial key={i} index={i + 1} value={digit} onTurn={turn(i)} disabled={solved} />
          ))}
        </div>
      </div>
      {!solved && (
        <div className={styles.row}>
          <button className={styles.openButton} onClick={open}>
            {canisterPuzzle.open}
          </button>
          <p className={styles.message} role="status">
            {message}
          </p>
        </div>
      )}
    </PuzzleFrame>
  );
}
