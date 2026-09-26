import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../content/site';
import { EASE_FADE } from '../lib/transitions';
import { useFilm } from '../state/store';
import styles from './Credits.module.css';

// PLACEHOLDER until Phase 6: proves the field → credits → field path and its transitions.
export default function Credits() {
  const closeCredits = useFilm((state) => state.closeCredits);
  const panel = useRef<HTMLElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Wait for the camera to reach the sky before the words appear.
    const tween = gsap.fromTo(
      panel.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.6, ease: EASE_FADE },
    );
    backButton.current?.focus();
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section ref={panel} className={styles.credits} aria-label={site.header.credits}>
      <p className={styles.eyebrow}>{site.credits.heading}</p>
      <h2 className={styles.name}>{site.name}</h2>
      <p className={styles.note}>{site.credits.placeholder}</p>
      <button ref={backButton} className={styles.back} onClick={closeCredits}>
        {site.credits.backToField}
      </button>
    </section>
  );
}
