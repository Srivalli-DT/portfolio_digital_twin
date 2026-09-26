import { projectFor } from '../content/projects';
import { site } from '../content/site';
import { useFilm, type ReelId } from '../state/store';
import styles from './Header.module.css';

const REELS: ReelId[] = ['I', 'II', 'III'];

// The tiny always-visible header: name on the left, controls on the right.
// The ● ○ ○ marks show progress AND are buttons that open each reel (the canisters' keyboard twin).
export default function Header() {
  const scene = useFilm((state) => state.scene);
  const sound = useFilm((state) => state.sound);
  const watched = useFilm((state) => state.watched);
  const openCredits = useFilm((state) => state.openCredits);
  const toggleSound = useFilm((state) => state.toggleSound);
  const openPlain = useFilm((state) => state.openPlain);
  const startPuzzle = useFilm((state) => state.startPuzzle);
  const canOpenReels = scene === 'field' || scene === 'puzzle';

  return (
    <header className={styles.header}>
      <span>{site.name}</span>
      <nav className={styles.nav}>
        {scene !== 'credits' && (
          <button className={styles.link} onClick={openCredits}>
            {site.header.credits}
          </button>
        )}
        <button className={styles.link} onClick={toggleSound} aria-pressed={sound}>
          {sound ? site.header.soundOn : site.header.soundOff}
        </button>
        <button className={styles.link} onClick={openPlain}>
          {site.header.plainCut}
        </button>
        <span className={styles.reels}>
          {REELS.map((reel) => {
            const isWatched = watched.includes(reel);
            const label = site.header.reelLabel
              .replace('{reel}', reel)
              .replace('{title}', projectFor(reel).title)
              .replace('{state}', isWatched ? site.header.watched : site.header.unwatched);
            return (
              <button
                key={reel}
                className={styles.reel}
                onClick={() => startPuzzle(reel)}
                disabled={!canOpenReels}
                aria-label={label}
                title={label}
              >
                {isWatched ? '●' : '○'}
              </button>
            );
          })}
        </span>
      </nav>
    </header>
  );
}
