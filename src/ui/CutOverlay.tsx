import { useEffect, useRef } from 'react';
import { registerCutElement } from '../lib/transitions';
import styles from './CutOverlay.module.css';

// The black layer that every hard cut fades through. It sits above everything and never takes clicks.
export default function CutOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerCutElement(ref.current);
    return () => registerCutElement(null);
  }, []);

  return <div ref={ref} className={styles.cut} aria-hidden="true" />;
}
