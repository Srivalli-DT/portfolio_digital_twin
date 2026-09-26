import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EASE_MOVE, prefersReducedMotion } from '../lib/transitions';
import { useFilm } from '../state/store';
import styles from './Letterbox.module.css';

// Transition 4, the letterbox change: black bars slide in (2.39:1) or out (full frame).
export default function Letterbox() {
  const visible = useFilm((state) => state.letterbox);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.to([top.current, bottom.current], {
      scaleY: visible ? 1 : 0,
      duration: prefersReducedMotion() ? 0 : 1.4,
      ease: EASE_MOVE,
    });
    return () => {
      tween.kill();
    };
  }, [visible]);

  return (
    <>
      <div ref={top} className={`${styles.bar} ${styles.top}`} aria-hidden="true" />
      <div ref={bottom} className={`${styles.bar} ${styles.bottom}`} aria-hidden="true" />
    </>
  );
}
