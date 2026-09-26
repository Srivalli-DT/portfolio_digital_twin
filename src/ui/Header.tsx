import { site } from '../content/site';
import { useFilm, type ReelId } from '../state/store';
import styles from './Header.module.css';

const REELS: ReelId[] = ['I', 'II', 'III'];

// The tiny always-visible header: name on the left, controls and ● ○ ○ progress on the right.
export default function Header() {
  const scene = useFilm((state) => state.scene);
  const sound = useFilm((state) => state.sound);
  const watched = useFilm((state) => state.watched);
  const openCredits = useFilm((state) => state.openCredits);
  const toggleSound = useFilm((state) => state.toggleSound);
  const openPlain = useFilm((state) => state.openPlain);

  const progressLabel = site.header.progressLabel.replace('{n}', String(watched.length));

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
        <span className={styles.progress} role="img" aria-label={progressLabel}>
          {REELS.map((reel) => (watched.includes(reel) ? '●' : '○')).join(' ')}
        </span>
      </nav>
    </header>
  );
}
