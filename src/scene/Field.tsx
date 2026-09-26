import Grass from './Grass';
import Sky from './Sky';
import { palette } from './palette';

// The ground, sky and the soft dusk light that fills the whole field.
export default function Field() {
  return (
    <>
      <Sky />
      <hemisphereLight args={[palette.fog, palette.moss, 0.9]} />
      {/* Low light from behind the sheet, like the last of the sun. */}
      <directionalLight position={[-4, 5, -12]} intensity={0.5} color={palette.bone} />

      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={palette.moss} roughness={1} />
      </mesh>
      <Grass />
    </>
  );
}
