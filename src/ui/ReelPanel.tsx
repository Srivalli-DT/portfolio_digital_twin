import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { projectFor } from '../content/projects';
import { puzzleText } from '../content/puzzles';
import { site } from '../content/site';
import { EASE_MOVE, prefersReducedMotion } from '../lib/transitions';
import { useFilm, type ReelId } from '../state/store';
import { useFocusTrap } from './useFocusTrap';
import styles from './ReelPanel.module.css';

type ReelPanelProps = { reel: ReelId };

// The case study that slides in while a reel plays. Close: ×, Esc, or a click on the field.
export default function ReelPanel({ reel }: ReelPanelProps) {
  const project = projectFor(reel);
  const closeReel = useFilm((state) => state.closeReel);
  const panel = useRef<HTMLElement>(null);
  useFocusTrap(panel);

  // Slide in from the right (fade only, with reduced motion).
  useEffect(() => {
    const tween = prefersReducedMotion()
      ? gsap.fromTo(panel.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      : gsap.fromTo(
          panel.current,
          { xPercent: 100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.9, delay: 0.6, ease: EASE_MOVE },
        );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <article ref={panel} className={styles.panel} aria-labelledby="reel-title">
      <header className={styles.top}>
        <p className={styles.label}>{puzzleText.reelLabel.replace('{reel}', reel)}</p>
        <button className={styles.close} onClick={closeReel} aria-label={site.reel.close}>
          ×
        </button>
      </header>

      <h2 id="reel-title" className={styles.title}>
        {project.title}
      </h2>
      <p className={styles.logline}>{project.logline}</p>
      <p className={styles.meta}>
        {project.year} · {project.role} · {project.tools.join(', ')}
      </p>

      {project.body.map((paragraph) => (
        <p key={paragraph} className={styles.body}>
          {paragraph}
        </p>
      ))}

      <ul className={styles.links}>
        {project.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
