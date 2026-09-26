import { useEffect, useRef, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import type { Group } from 'three';
import { projectFor } from '../content/projects';
import { puzzleText } from '../content/puzzles';
import { EASE_FADE } from '../lib/transitions';
import { useFilm, type ReelId } from '../state/store';
import { palette } from './palette';
import styles from './Canister.module.css';

type CanisterProps = {
  reel: ReelId;
  // 1, 2 or 3: how many bone strips mark the lid (I, II, III).
  number: number;
  position: [number, number, number];
};

// One film canister. Hover: it tilts and shows the project's title. Click: opens its puzzle.
// Keyboard equivalent: the ○ marks in the header.
export default function Canister({ reel, number, position }: CanisterProps) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const clickable = useFilm((state) => state.scene === 'field');
  const startPuzzle = useFilm((state) => state.startPuzzle);
  const showLabel = hovered && clickable;

  useEffect(() => {
    if (!group.current) return;
    const tween = gsap.to(group.current.rotation, {
      x: showLabel ? -0.12 : 0,
      z: showLabel ? 0.08 : 0,
      duration: 0.4,
      ease: EASE_FADE,
    });
    return () => {
      tween.kill();
    };
  }, [showLabel]);

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    if (!clickable) return;
    event.stopPropagation();
    document.body.style.cursor = 'auto';
    startPuzzle(reel);
  };
  const hover = (on: boolean) => () => {
    setHovered(on);
    document.body.style.cursor = on && clickable ? 'pointer' : 'auto';
  };

  return (
    <group
      ref={group}
      name={`Canister_${number}`}
      position={position}
      onClick={onClick}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
    >
      <mesh position-y={0.03}>
        <cylinderGeometry args={[0.16, 0.16, 0.06, 28]} />
        <meshStandardMaterial color={palette.fog} roughness={0.45} metalness={0.6} />
      </mesh>
      {/* Roman-numeral strips: one per reel number. */}
      {Array.from({ length: number }, (_, strip) => (
        <mesh key={strip} position={[(strip - (number - 1) / 2) * 0.04, 0.062, 0]}>
          <boxGeometry args={[0.014, 0.004, 0.12]} />
          <meshStandardMaterial color={palette.bone} roughness={0.8} />
        </mesh>
      ))}
      {showLabel && (
        // zIndexRange keeps the label under the letterbox, header and cuts.
        <Html center position={[0, 0.22, 0]} zIndexRange={[5, 0]} className={styles.label}>
          {puzzleText.reelLabel.replace('{reel}', reel)} · {projectFor(reel).title}
        </Html>
      )}
    </group>
  );
}
