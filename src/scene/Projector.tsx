import { useMemo } from 'react';
import { AdditiveBlending, DoubleSide, Object3D, Quaternion, Vector3 } from 'three';
import { LENS_POSITION, PROJECTOR_POSITION, SHEET_POSITION, SHEET_SIZE } from './layout';
import { palette } from './palette';
import Stool from './Stool';

const [SHEET_WIDTH, SHEET_HEIGHT] = SHEET_SIZE;
const BEAM_ASPECT = SHEET_WIDTH / SHEET_HEIGHT;
// Corner radius that makes the beam land just inside the sheet's top and bottom edges.
const BEAM_RADIUS = (SHEET_HEIGHT / 2) * 0.85 * Math.SQRT2;

// Placeholder projector + light beam. Swapped for a GLB in Phase 7.
export default function Projector() {
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

  return (
    <>
      <Stool />
      <group position={PROJECTOR_POSITION}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.55]} />
          <meshStandardMaterial color={palette.ink} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Lens barrel with a warm glowing glass. */}
        <mesh position={[0, 0.15, -0.31]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
          <meshStandardMaterial color={palette.ink} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, -0.362]} rotation-y={Math.PI}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={palette.lamp} />
        </mesh>
        {/* Two reels standing on top. The crow sits on the rear one. */}
        {[-0.16, 0.15].map((z) => (
          <mesh key={z} position={[0, 0.52, z]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.2, 0.2, 0.035, 24]} />
            <meshStandardMaterial color={palette.fog} roughness={0.6} metalness={0.5} />
          </mesh>
        ))}
        {/* Arms holding the reels. */}
        {[-0.16, 0.15].map((z) => (
          <mesh key={z} position={[0, 0.41, z]}>
            <boxGeometry args={[0.02, 0.22, 0.02]} />
            <meshStandardMaterial color={palette.ink} />
          </mesh>
        ))}
      </group>

      {/* A 4-sided cone turned 45° is a square pyramid; the group's x-scale stretches it to the sheet's shape. */}
      <group position={beam.middle} quaternion={beam.rotation} scale={[BEAM_ASPECT, 1, 1]}>
        <mesh rotation-y={Math.PI / 4}>
          {/* Wide end (top) at the sheet, narrow end at the lens. */}
          <cylinderGeometry args={[BEAM_RADIUS, 0.04, beam.length, 4, 1, true]} />
          <meshBasicMaterial
            color={palette.lamp}
            transparent
            opacity={0.05}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      </group>

      <primitive object={target} />
      <spotLight
        position={LENS_POSITION}
        target={target}
        color={palette.lamp}
        intensity={30}
        angle={0.32}
        penumbra={0.5}
      />
      <pointLight position={LENS_POSITION} color={palette.lamp} intensity={0.4} distance={1.5} />
    </>
  );
}
