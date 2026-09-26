import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import {
  AdditiveBlending,
  DoubleSide,
  Object3D,
  Quaternion,
  Vector3,
  type MeshBasicMaterial,
  type PointLight,
  type SpotLight,
} from 'three';
import { EASE_FADE } from '../lib/transitions';
import { useFilm } from '../state/store';
import { LENS_POSITION, SHEET_POSITION, SHEET_SIZE } from './layout';
import { palette } from './palette';

const [SHEET_WIDTH, SHEET_HEIGHT] = SHEET_SIZE;
const BEAM_ASPECT = SHEET_WIDTH / SHEET_HEIGHT;
// Corner radius that makes the beam land just inside the sheet's top and bottom edges.
const BEAM_RADIUS = (SHEET_HEIGHT / 2) * 0.85 * Math.SQRT2;

// Full-brightness values. `level` (0 = off, 1 = on) scales all of them.
const BEAM_OPACITY = 0.05;
const SPOT_INTENSITY = 30;
const GLOW_INTENSITY = 0.4;

// Brightness steps for transition 5, the projector flicker: stutter, then settle on.
const FLICKER_STEPS = [0.6, 0.1, 0.8, 0.25, 1, 0.55, 1];

// The lens glow, the light beam and the spotlight that lights the sheet.
export default function ProjectorLight() {
  const flickerCount = useFilm((state) => state.flickerCount);
  // Starts off (dark) until the field scene flickers it on.
  const level = useRef({ value: 0 });
  const beamMaterial = useRef<MeshBasicMaterial>(null);
  const lensMaterial = useRef<MeshBasicMaterial>(null);
  const spot = useRef<SpotLight>(null);
  const glow = useRef<PointLight>(null);

  // The beam is a cone stretched from the lens to the middle of the sheet.
  const beam = useMemo(() => {
    const lens = new Vector3(...LENS_POSITION);
    const direction = new Vector3(...SHEET_POSITION).sub(lens);
    const length = direction.length();
    direction.normalize();
    return {
      length,
      middle: lens.clone().addScaledVector(direction, length / 2),
      // Turn the cone (which points up +y by default) to point along the beam.
      rotation: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction),
    };
  }, []);

  // The spotlight aims at this invisible point on the sheet.
  const target = useMemo(() => {
    const object = new Object3D();
    object.position.set(...SHEET_POSITION);
    return object;
  }, []);

  useEffect(() => {
    if (flickerCount === 0) return;
    const timeline = gsap.timeline();
    FLICKER_STEPS.forEach((value) => {
      timeline.to(level.current, { value, duration: 0.05 + Math.random() * 0.1, ease: EASE_FADE });
    });
    return () => {
      timeline.kill();
    };
  }, [flickerCount]);

  // Apply the current brightness every frame by mutating the objects directly (no React state).
  useFrame(() => {
    const value = level.current.value;
    if (beamMaterial.current) beamMaterial.current.opacity = BEAM_OPACITY * value;
    if (lensMaterial.current) lensMaterial.current.opacity = value;
    if (spot.current) spot.current.intensity = SPOT_INTENSITY * value;
    if (glow.current) glow.current.intensity = GLOW_INTENSITY * value;
  });

  return (
    <>
      {/* Turned to face -z, toward the sheet. */}
      <mesh
        position={[LENS_POSITION[0], LENS_POSITION[1], LENS_POSITION[2] - 0.002]}
        rotation-y={Math.PI}
      >
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial ref={lensMaterial} color={palette.lamp} transparent opacity={0} />
      </mesh>

      {/* A 4-sided cone turned 45° is a square pyramid; the group's x-scale stretches it to the sheet's shape. */}
      <group position={beam.middle} quaternion={beam.rotation} scale={[BEAM_ASPECT, 1, 1]}>
        <mesh rotation-y={Math.PI / 4}>
          {/* Wide end (top) at the sheet, narrow end at the lens. */}
          <cylinderGeometry args={[BEAM_RADIUS, 0.04, beam.length, 4, 1, true]} />
          <meshBasicMaterial
            ref={beamMaterial}
            color={palette.lamp}
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      </group>

      <primitive object={target} />
      <spotLight
        ref={spot}
        position={LENS_POSITION}
        target={target}
        color={palette.lamp}
        intensity={0}
        angle={0.32}
        penumbra={0.5}
      />
      <pointLight
        ref={glow}
        position={LENS_POSITION}
        color={palette.lamp}
        intensity={0}
        distance={1.5}
      />
    </>
  );
}
