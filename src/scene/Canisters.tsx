import { CANISTER_POSITIONS } from './layout';
import { palette } from './palette';

// Three flat film canisters. The lid of each carries 1, 2 or 3 bone strips: I, II, III.
// Hover and click arrive in later phases.
export default function Canisters() {
  return (
    <>
      {CANISTER_POSITIONS.map((position, index) => (
        <group key={index} name={`Canister_${index + 1}`} position={position}>
          <mesh position-y={0.03}>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 28]} />
            <meshStandardMaterial color={palette.fog} roughness={0.45} metalness={0.6} />
          </mesh>
          {/* Roman-numeral strips: one per reel number. */}
          {Array.from({ length: index + 1 }, (_, strip) => (
            <mesh key={strip} position={[(strip - index / 2) * 0.04, 0.062, 0]}>
              <boxGeometry args={[0.014, 0.004, 0.12]} />
              <meshStandardMaterial color={palette.bone} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}
