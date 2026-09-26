import { PROJECTOR_POSITION } from './layout';
import { palette } from './palette';
import ProjectorLight from './ProjectorLight';
import Stool from './Stool';

const REEL_Z = [-0.16, 0.15];

// Placeholder stool + projector. Swapped for a GLB in Phase 7. The light lives in ProjectorLight.
export default function Projector() {
  return (
    <>
      <Stool />
      <group position={PROJECTOR_POSITION}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.55]} />
          <meshStandardMaterial color={palette.ink} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Lens barrel. Its glowing glass is in ProjectorLight, so it can flicker. */}
        <mesh position={[0, 0.15, -0.31]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
          <meshStandardMaterial color={palette.ink} roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Two reels standing on top. The crow sits on the rear one. */}
        {REEL_Z.map((z) => (
          <mesh key={z} position={[0, 0.52, z]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.2, 0.2, 0.035, 24]} />
            <meshStandardMaterial color={palette.fog} roughness={0.6} metalness={0.5} />
          </mesh>
        ))}
        {/* Arms holding the reels. */}
        {REEL_Z.map((z) => (
          <mesh key={z} position={[0, 0.41, z]}>
            <boxGeometry args={[0.02, 0.22, 0.02]} />
            <meshStandardMaterial color={palette.ink} />
          </mesh>
        ))}
      </group>
      <ProjectorLight />
    </>
  );
}
