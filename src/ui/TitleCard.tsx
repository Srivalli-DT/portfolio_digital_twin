import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../content/site';
import { EASE_FADE } from '../lib/transitions';
import styles from './TitleCard.module.css';

type TitleCardProps = {
  // Shown one after another in the same spot. The first line is the big one.
  lines: readonly string[];
  onDone: () => void;
};

const FADE_SECONDS = 0.9;
const HOLD_SECONDS = 2;

// Transition 2, the title card: serif lines fade in and out on black. Click or any key skips it.
export default function TitleCard({ lines, onDone }: TitleCardProps) {
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      timeline.kill();
      onDone();
    };

    const timeline = gsap.timeline({ onComplete: finish });
    lineRefs.current.forEach((line) => {
      if (!line) return;
      timeline
        .fromTo(line, { opacity: 0 }, { opacity: 1, duration: FADE_SECONDS, ease: EASE_FADE })
        .to(line, { opacity: 0, duration: FADE_SECONDS, ease: EASE_FADE }, `+=${HOLD_SECONDS}`);
    });

    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      finished = true;
      timeline.kill();
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [lines, onDone]);

  return (
    <div className={styles.card} role="presentation">
      {lines.map((line, index) => (
        <p
          key={line}
          ref={(element) => {
            lineRefs.current[index] = element;
          }}
          className={index === 0 ? styles.title : styles.line}
        >
          {line}
        </p>
      ))}
      <p className={styles.hint}>{site.titleCard.skipHint}</p>
    </div>
  );
}
