import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { Vector3 } from 'three';
import { EASE_MOVE, cutToBlack, prefersReducedMotion } from '../lib/transitions';
import { useFilm } from '../state/store';
import { shots, type ShotName } from './shots';

const DOLLY_SECONDS = 2.5;

// Transition 3, the dolly: whenever the store's `shot` changes, glide the camera there.
// With reduced motion on (or shotMode 'cut'), it jumps instead.
export default function CameraRig() {
  const camera = useThree((state) => state.camera);
  const shot = useFilm((state) => state.shot);
  // The point the camera looks at. Tweened alongside the position so the aim moves smoothly too.
  const lookAt = useRef(new Vector3(...shots.wide.target));
  // The shot we're on (or heading to). null until the first one is placed.
  const currentShot = useRef<ShotName | null>(null);

  useEffect(() => {
    if (currentShot.current === shot) return;
    const isFirstShot = currentShot.current === null;
    currentShot.current = shot;

    const { position, target } = shots[shot];
    const jump = () => {
      camera.position.set(...position);
      lookAt.current.set(...target);
      camera.lookAt(lookAt.current);
    };

    // First placement, or the store asked for a cut (it happens while the screen is black).
    if (isFirstShot || useFilm.getState().shotMode === 'cut') {
      jump();
      return;
    }
    if (prefersReducedMotion()) {
      cutToBlack(jump);
      return;
    }

    const [x, y, z] = position;
    const [tx, ty, tz] = target;
    const timeline = gsap
      .timeline({
        defaults: { duration: DOLLY_SECONDS, ease: EASE_MOVE },
        onUpdate: () => camera.lookAt(lookAt.current),
      })
      .to(camera.position, { x, y, z }, 0)
      .to(lookAt.current, { x: tx, y: ty, z: tz }, 0);

    // If the shot changes mid-move, stop here; the next dolly starts from wherever we are.
    return () => {
      timeline.kill();
    };
  }, [shot, camera]);

  return null;
}
