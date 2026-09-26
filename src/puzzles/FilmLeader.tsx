import { splicePuzzle } from '../content/puzzles';
import styles from './FilmLeader.module.css';

type FilmLeaderProps = { clue: number };

// A countdown film leader (the circle-and-cross before a reel starts), showing Reel II's clue number.
export default function FilmLeader({ clue }: FilmLeaderProps) {
  return (
    <svg
      className={styles.leader}
      viewBox="0 0 160 90"
      role="img"
      aria-label={splicePuzzle.leaderLabel.replace('{clue}', String(clue))}
    >
      <rect className={styles.paper} width="160" height="90" />
      <circle className={styles.line} cx="80" cy="45" r="34" />
      <circle className={styles.line} cx="80" cy="45" r="28" />
      <line className={styles.line} x1="0" y1="45" x2="160" y2="45" />
      <line className={styles.line} x1="80" y1="0" x2="80" y2="90" />
      <text className={styles.number} x="80" y="46" textAnchor="middle" dominantBaseline="central">
        {clue}
      </text>
    </svg>
  );
}
