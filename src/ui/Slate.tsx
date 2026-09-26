import { site } from '../content/site';
import { prefersReducedMotion } from '../lib/transitions';
import { useFilm } from '../state/store';
import styles from './Slate.module.css';

// Screen 0: the black entry screen. Its click also lets the browser play sound later.
export default function Slate() {
  const enter = useFilm((state) => state.enter);
  const openPlain = useFilm((state) => state.openPlain);
  // People who asked their device for less motion get the plain cut focused first (SPEC section 8).
  const reduced = prefersReducedMotion();

  return (
    <main className={styles.slate}>
      <h1 className={styles.title}>
        {site.name} — {site.slate.tagline}
      </h1>
      <div className={styles.actions}>
        <button className={styles.button} onClick={() => enter(true)} autoFocus={!reduced}>
          {site.slate.enterWithSound}
        </button>
        <button className={styles.button} onClick={() => enter(false)}>
          {site.slate.enterSilent}
        </button>
      </div>
      <button className={styles.plain} onClick={openPlain} autoFocus={reduced}>
        {site.slate.plainCut}
      </button>
    </main>
  );
}
