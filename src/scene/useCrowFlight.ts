import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import type { Group, Object3D } from 'three';
import { EASE_MOVE, prefersReducedMotion } from '../lib/transitions';
import { useFilm } from '../state/store';

// Which way the crow turns before it flies: toward the sky shot's view (+x, up, away from camera).
const FLIGHT_HEADING = 2.7;
const FLIGHT_OFFSET = { x: 4, y: 5, z: -9 };
const FLAP_SPEED = 22;

// The end of the film: when the store says `flownAway`, the crow turns, flaps and flies off-frame.
// When `flownAway` goes back to false (always during a cut to black), it is put back on its perch.
export function useCrowFlight(rootRef: RefObject<Group | null>) {
  const flownAway = useFilm((state) => state.flownAway);
  const wings = useRef<{ left: Object3D; right: Object3D } | null>(null);
  const flying = useRef(false);

  useEffect(() => {
    const left = rootRef.current?.getObjectByName('Wing_L');
    const right = rootRef.current?.getObjectByName('Wing_R');
    if (left && right) wings.current = { left, right };
  }, [rootRef]);

  useEffect(() => {
    const crow = rootRef.current;
    if (!crow || !flownAway) return;
    const home = crow.position.clone();
    const homeHeading = crow.rotation.y;
    const reset = () => {
      flying.current = false;
      crow.position.copy(home);
      crow.rotation.y = homeHeading;
      crow.visible = true;
      wings.current?.left.rotation.set(0, 0, 0);
      wings.current?.right.rotation.set(0, 0, 0);
    };

    // Reduced motion: no flight, the crow is simply gone.
    if (prefersReducedMotion()) {
      crow.visible = false;
      return reset;
    }

    flying.current = true;
    const timeline = gsap
      .timeline({
        onComplete: () => {
          flying.current = false;
          crow.visible = false;
        },
      })
      .to(crow.rotation, { y: FLIGHT_HEADING, duration: 0.6, ease: EASE_MOVE })
      .to(
        crow.position,
        {
          x: home.x + FLIGHT_OFFSET.x,
          y: home.y + FLIGHT_OFFSET.y,
          z: home.z + FLIGHT_OFFSET.z,
          duration: 3,
          ease: EASE_MOVE,
        },
        0.3,
      );
    return () => {
      timeline.kill();
      reset();
    };
  }, [flownAway, rootRef]);

  // Flap while flying: both wings swing up and down, mirrored.
  useFrame((state) => {
    if (!flying.current || !wings.current) return;
    const flap = Math.sin(state.clock.elapsedTime * FLAP_SPEED) * 0.9;
    wings.current.left.rotation.z = flap;
    wings.current.right.rotation.z = -flap;
  });
}
