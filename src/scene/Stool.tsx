import { STOOL_HEIGHT } from './layout';
import { palette } from './palette';

const SEAT_THICKNESS = 0.06;
const LEG_HEIGHT = STOOL_HEIGHT - SEAT_THICKNESS;
const LEG_OFFSETS: [number, number][] = [
  [0.2, 0.12],
  [-0.2, 0.12],
  [0, -0.23],
];

// A plain wooden stool: round seat on three legs. The projector stands on it.
export default function Stool() {
  return (
    <>
      <mesh position-y={STOOL_HEIGHT - SEAT_THICKNESS / 2}>
        <cylinderGeometry args={[0.3, 0.3, SEAT_THICKNESS, 20]} />
        <meshStandardMaterial color={palette.fog} roughness={1} />
      </mesh>
      {LEG_OFFSETS.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, LEG_HEIGHT / 2, z]}>
          <cylinderGeometry args={[0.022, 0.028, LEG_HEIGHT, 6]} />
          <meshStandardMaterial color={palette.fog} roughness={1} />
        </mesh>
      ))}
    </>
  );
}
