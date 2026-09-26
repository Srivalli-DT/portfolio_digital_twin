import { useMemo, useRef } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { MeshStandardMaterial, type Group } from 'three';
import { useFilm } from '../state/store';
import { CROW_POSITION } from './layout';
import { palette } from './palette';
import { useCrowBehaviour } from './useCrowBehaviour';

// The crow faces +z, so its left wing is on the +x side.
const WINGS = [
  { name: 'Wing_L', x: 0.055 },
  { name: 'Wing_R', x: -0.055 },
];

// Placeholder crow built from primitives. The part NAMES matter: later phases animate
// Body, Head, Beak_Upper, Beak_Lower, Wing_L and Wing_R by name. Keep them for the real GLB.
// Each named part is a group placed at its pivot (e.g. the beak hinge), with the mesh inside.
export default function Crow() {
  const root = useRef<Group>(null);
  useCrowBehaviour(root);
  const openDialogue = useFilm((state) => state.openDialogue);

  // Clicking the crow opens the questions (the `talk to` button is the keyboard equivalent).
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    openDialogue();
  };
  const setCursor = (cursor: string) => () => {
    document.body.style.cursor = cursor;
  };

  // Matte blue-black with a faint sheen, shared by every feathered part.
  const feathers = useMemo(
    () => new MeshStandardMaterial({ color: palette.ink, roughness: 0.55, metalness: 0.25 }),
    [],
  );

  return (
    // Turned a little toward the field camera.
    <group
      ref={root}
      name="Crow"
      position={CROW_POSITION}
      rotation-y={0.35}
      scale={1.2}
      onClick={onClick}
      onPointerOver={setCursor('pointer')}
      onPointerOut={setCursor('auto')}
    >
      {/* Invisible, bigger click target: the real crow is small on screen. */}
      <mesh position-y={0.13}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Legs stay outside Body, so breathing doesn't stretch them. */}
      {[-0.025, 0.025].map((x) => (
        <mesh key={x} position={[x, 0.025, 0.01]} material={feathers}>
          <cylinderGeometry args={[0.005, 0.005, 0.05, 4]} />
        </mesh>
      ))}

      <group name="Body" position={[0, 0.1, 0]}>
        <mesh rotation-x={-0.5} scale={[0.9, 0.85, 1.5]} material={feathers}>
          <sphereGeometry args={[0.07, 12, 10]} />
        </mesh>
        {/* Tail: a wedge that widens away from the body. */}
        <mesh position={[0, -0.04, -0.15]} rotation-x={Math.PI / 2 - 0.4} material={feathers}>
          <coneGeometry args={[0.035, 0.14, 4]} />
        </mesh>
        {WINGS.map(({ name, x }) => (
          <group key={name} name={name} position={[x, 0.015, 0]}>
            <mesh
              position-z={-0.03}
              rotation-x={-0.4}
              scale={[0.25, 0.65, 1.6]}
              material={feathers}
            >
              <sphereGeometry args={[0.065, 10, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      <group name="Head" position={[0, 0.2, 0.07]}>
        <mesh material={feathers}>
          <sphereGeometry args={[0.048, 12, 10]} />
        </mesh>
        {/* The one warm catchlight in each eye. */}
        {[-0.034, 0.034].map((x) => (
          <mesh key={x} position={[x, 0.012, 0.026]}>
            <sphereGeometry args={[0.005, 6, 6]} />
            <meshBasicMaterial color={palette.lamp} />
          </mesh>
        ))}
        <group name="Beak_Upper" position={[0, 0.002, 0.038]}>
          <mesh position-z={0.035} rotation-x={Math.PI / 2} scale={[1, 1, 0.7]} material={feathers}>
            <coneGeometry args={[0.016, 0.075, 6]} />
          </mesh>
        </group>
        <group name="Beak_Lower" position={[0, -0.01, 0.036]}>
          <mesh position-z={0.028} rotation-x={Math.PI / 2} scale={[1, 1, 0.5]} material={feathers}>
            <coneGeometry args={[0.012, 0.058, 6]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
