import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { MathUtils, type Group, type Object3D } from 'three';
import { EASE_FADE, EASE_MOVE } from '../lib/transitions';
import { useFilm } from '../state/store';

type Parts = { body: Object3D; head: Object3D; beakUpper: Object3D; beakLower: Object3D };

const BREATH_SPEED = 1.6;
const BREATH_AMOUNT = 0.015; // ±1.5% (SPEC section 4)
const MAX_YAW = 0.6; // how far the head turns left/right, in radians
const MAX_PITCH = 0.3; // how far it looks up/down
const CURIOUS_TILT = MathUtils.degToRad(20);
const HOP_HEIGHT = 0.08;

// Fraction to move toward a target this frame. Same feel at 30fps or 144fps.
function smoothing(speed: number, delta: number) {
  return 1 - Math.exp(-speed * delta);
}

// All the crow's procedural motion. Everything happens by mutating objects in useFrame; no React state.
// Parts are found by NAME, so a real GLB with the same part names works without code changes.
export function useCrowBehaviour(root: RefObject<Group | null>) {
  const parts = useRef<Parts | null>(null);
  // Head tilt: 0 (level) or ±CURIOUS_TILT, switched at random times.
  const tilt = useRef({ target: 0, nextChange: 4 });
  const hopCount = useFilm((state) => state.hopCount);

  useEffect(() => {
    const crow = root.current;
    if (!crow) return;
    const find = (name: string) => {
      const part = crow.getObjectByName(name);
      if (!part) throw new Error(`Crow model is missing the part "${name}"`);
      return part;
    };
    parts.current = {
      body: find('Body'),
      head: find('Head'),
      beakUpper: find('Beak_Upper'),
      beakLower: find('Beak_Lower'),
    };
  }, [root]);

  // A small hop (up quick, down soft) each time hopCount goes up.
  useEffect(() => {
    const crow = root.current;
    if (!crow || hopCount === 0) return;
    const baseY = crow.position.y;
    const timeline = gsap
      .timeline()
      .to(crow.position, { y: baseY + HOP_HEIGHT, duration: 0.18, ease: EASE_FADE })
      .to(crow.position, { y: baseY, duration: 0.24, ease: EASE_MOVE });
    return () => {
      timeline.kill();
      crow.position.y = baseY;
    };
  }, [hopCount, root]);

  useFrame((state, delta) => {
    const crow = parts.current;
    if (!crow) return;
    const time = state.clock.elapsedTime;

    // Idle breathing.
    crow.body.scale.setScalar(1 + Math.sin(time * BREATH_SPEED) * BREATH_AMOUNT);

    // Now and then, tilt the head like it's curious, then level out again.
    if (time > tilt.current.nextChange) {
      const isLevel = tilt.current.target === 0;
      tilt.current.target = isLevel ? CURIOUS_TILT * (Math.random() < 0.5 ? -1 : 1) : 0;
      tilt.current.nextChange = time + (isLevel ? 1.4 : 4 + Math.random() * 5);
    }

    // The head follows the cursor with a lag. state.pointer runs -1..1 across the canvas.
    const yaw = MathUtils.clamp(state.pointer.x * MAX_YAW, -MAX_YAW, MAX_YAW);
    const pitch = MathUtils.clamp(-state.pointer.y * MAX_PITCH, -MAX_PITCH, MAX_PITCH);
    const follow = smoothing(3, delta);
    crow.head.rotation.y += (yaw - crow.head.rotation.y) * follow;
    crow.head.rotation.x += (pitch - crow.head.rotation.x) * follow;
    crow.head.rotation.z += (tilt.current.target - crow.head.rotation.z) * smoothing(5, delta);

    // Beak chatters while a subtitle types out. Read the store directly: no re-render needed.
    const talking = useFilm.getState().talking;
    const open = talking ? Math.abs(Math.sin(time * 13)) * 0.45 : 0;
    const snap = smoothing(25, delta);
    crow.beakLower.rotation.x += (open - crow.beakLower.rotation.x) * snap;
    crow.beakUpper.rotation.x += (-open * 0.3 - crow.beakUpper.rotation.x) * snap;
  });
}
