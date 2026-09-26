import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import { useFilm } from '../state/store';
import { PROJECTOR_POSITION } from './layout';
import { palette } from './palette';

// How much the focus value changes per pixel dragged.
const FOCUS_PER_PIXEL = 0.2;
// On the projector's right side, near the lens, where the puzzle camera can see it.
const KNOB_POSITION: [number, number, number] = [
  PROJECTOR_POSITION[0] + 0.19,
  PROJECTOR_POSITION[1] + 0.15,
  PROJECTOR_POSITION[2] - 0.17,
];

// Puzzle I's focus knob. Drag it left/right to pull focus. The HTML slider is its twin:
// both change the same `focus` value in the store.
export default function FocusKnob() {
  const active = useFilm(
    (state) => state.scene === 'puzzle' && state.activeReel === 'I' && !state.solved.includes('I'),
  );
  const setFocus = useFilm((state) => state.setFocus);
  const knob = useRef<Group>(null);
  const drag = useRef<{ startX: number; startFocus: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  // Turn the knob to match the focus value, whichever control changed it.
  useFrame(() => {
    if (knob.current) knob.current.rotation.x = (useFilm.getState().focus / 100) * Math.PI * 1.5;
  });

  // Pointer capture keeps the drag going even when the pointer slides off the small knob.
  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!active) return;
    event.stopPropagation();
    (event.target as unknown as Element).setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startFocus: useFilm.getState().focus };
  };
  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return;
    setFocus(drag.current.startFocus + (event.clientX - drag.current.startX) * FOCUS_PER_PIXEL);
  };
  const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return;
    (event.target as unknown as Element).releasePointerCapture(event.pointerId);
    drag.current = null;
  };
  const hover = (on: boolean) => () => {
    setHovered(on && active);
    document.body.style.cursor = on && active ? 'ew-resize' : 'auto';
  };

  const glow = active ? (hovered ? 0.8 : 0.35) : 0;

  return (
    <group position={KNOB_POSITION}>
      <group ref={knob}>
        {/* A disc facing sideways (+x), with a notch so you can see it turn. */}
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
          <meshStandardMaterial
            color={palette.fog}
            emissive={palette.lamp}
            emissiveIntensity={glow}
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0.017, 0.04, 0]}>
          <boxGeometry args={[0.006, 0.03, 0.008]} />
          <meshStandardMaterial color={palette.bone} />
        </mesh>
      </group>
      {/* Invisible, bigger sphere: an easier target to grab. */}
      <mesh
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerOver={hover(true)}
        onPointerOut={hover(false)}
      >
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
