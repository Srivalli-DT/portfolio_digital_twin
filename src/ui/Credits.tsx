import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { moreWork } from '../content/projects';
import { about, site } from '../content/site';
import { EASE_FADE, prefersReducedMotion } from '../lib/transitions';
import { useFilm } from '../state/store';
import ContactLinks from './ContactLinks';
import styles from './Credits.module.css';

// How long the end of the credits stays on screen before the crow flies off.
const LINGER_MS = 2500;

// Screen 3, the credits: sections rise into view one by one over the dusk sky. Reaching the end
// makes the crow fly off and "fin." appear, with replay / back to field.
export default function Credits() {
  const flownAway = useFilm((state) => state.flownAway);
  const endFilm = useFilm((state) => state.endFilm);
  const replay = useFilm((state) => state.replay);
  const closeCredits = useFilm((state) => state.closeCredits);
  const panel = useRef<HTMLElement>(null);
  const end = useRef<HTMLDivElement>(null);

  // The roll: each section fades up in turn once the camera has reached the sky.
  useEffect(() => {
    const sections = panel.current?.querySelectorAll('[data-roll]');
    if (!sections) return;
    const tween = gsap.fromTo(
      sections,
      { opacity: 0, y: prefersReducedMotion() ? 0 : 24 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.5, delay: 1.6, ease: EASE_FADE },
    );
    return () => {
      tween.kill();
    };
  }, []);

  // When the end of the credits has been on screen for a moment, end the film.
  useEffect(() => {
    if (!end.current || flownAway) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting) timer = window.setTimeout(endFilm, LINGER_MS);
    });
    observer.observe(end.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [flownAway, endFilm]);

  return (
    <section ref={panel} className={styles.credits} aria-label={site.header.credits}>
      <div data-roll className={styles.block}>
        <p className={styles.heading}>{site.credits.heading}</p>
        <h2 className={styles.name}>{site.name}</h2>
        {about.bio.map((line) => (
          <p key={line} className={styles.bio}>
            {line}
          </p>
        ))}
      </div>

      <div data-roll className={styles.block}>
        <p className={styles.heading}>{site.credits.crew}</p>
        {about.crew.map((row) => (
          <p key={row.role} className={styles.row}>
            <span className={styles.role}>{row.role}</span> {row.names}
          </p>
        ))}
      </div>

      {about.education.length > 0 && (
        <div data-roll className={styles.block}>
          <p className={styles.heading}>{site.credits.education}</p>
          {about.education.map((item) => (
            <p key={item.place} className={styles.row}>
              <span className={styles.role}>{item.place}</span> {item.detail}
            </p>
          ))}
        </div>
      )}

      <div data-roll className={styles.block}>
        <p className={styles.heading}>{site.credits.moreWork}</p>
        {moreWork.map((work) => (
          <p key={work.href} className={styles.row}>
            <a href={work.href} target="_blank" rel="noreferrer">
              {work.title} ↗
            </a>{' '}
            {work.note}
          </p>
        ))}
      </div>

      <div data-roll className={styles.block}>
        <p className={styles.heading}>{site.credits.contact}</p>
        <ContactLinks className={styles.contact} />
      </div>

      <div data-roll className={styles.block}>
        <p className={styles.heading}>{site.credits.thanks}</p>
        {about.thanks.map((line) => (
          <p key={line} className={styles.row}>
            {line}
          </p>
        ))}
      </div>

      <div ref={end} className={styles.end}>
        {flownAway && (
          <>
            <p className={styles.fin}>{site.credits.fin}</p>
            <div className={styles.actions}>
              <button onClick={replay}>{site.credits.replay}</button>
              <button onClick={closeCredits} autoFocus>
                {site.credits.backToField}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
