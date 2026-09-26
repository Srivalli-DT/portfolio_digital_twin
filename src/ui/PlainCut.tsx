import { site } from '../content/site';
import { useFilm } from '../state/store';
import styles from './PlainCut.module.css';

// PLACEHOLDER until Phase 6, when this becomes the full no-WebGL version of the site.
export default function PlainCut() {
  const closePlain = useFilm((state) => state.closePlain);

  return (
    <main className={styles.plain}>
      <h1 className={styles.name}>{site.name}</h1>
      <p>{site.plainCut.placeholder}</p>
      <button className={styles.back} onClick={closePlain} autoFocus>
        {site.plainCut.back}
      </button>
    </main>
  );
}
