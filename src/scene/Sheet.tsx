import { useMemo } from 'react';
import { DoubleSide, PlaneGeometry } from 'three';
import { SHEET_POSITION, SHEET_SIZE } from './layout';
import { palette } from './palette';

const [WIDTH, HEIGHT] = SHEET_SIZE;
const POLE_X = WIDTH / 2 + 0.3;
const LINE_Y = SHEET_POSITION[1] + HEIGHT / 2 + 0.08;

// A bedsheet hanging from a line between two poles. The reels play on it in Phase 5.
export default function Sheet() {
  // A flat plane with a gentle ripple, so it reads as cloth instead of a screen.
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(WIDTH, HEIGHT, 24, 12);
    const positions = plane.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Ripple grows toward the bottom edge, where the cloth hangs free.
      const looseness = 0.5 - y / HEIGHT;
      positions.setZ(i, Math.sin(x * 2.4) * 0.05 * looseness);
    }
    plane.computeVertexNormals();
    return plane;
  }, []);

  return (
    <group position={[0, 0, SHEET_POSITION[2]]}>
      <mesh geometry={geometry} position-y={SHEET_POSITION[1]}>
        <meshStandardMaterial color={palette.bone} roughness={0.95} side={DoubleSide} />
      </mesh>
      {[-POLE_X, POLE_X].map((x) => (
        <mesh key={x} position={[x, LINE_Y / 2 + 0.05, 0]}>
          <cylinderGeometry args={[0.025, 0.03, LINE_Y + 0.1, 6]} />
          <meshStandardMaterial color={palette.fog} roughness={1} />
        </mesh>
      ))}
      <mesh position-y={LINE_Y} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.004, 0.004, POLE_X * 2, 4]} />
        <meshStandardMaterial color={palette.ink} />
      </mesh>
    </group>
  );
}
