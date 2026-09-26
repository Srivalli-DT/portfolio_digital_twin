import { useLayoutEffect, useRef } from 'react';
import { Object3D, type InstancedMesh } from 'three';
import { palette } from './palette';

const COUNT = 700;
const BLADE_HEIGHT = 0.35;

// Tiny seeded random, so the grass lands in the same place on every load.
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

// Sparse grass tufts drawn as ONE instanced mesh (one draw call for all 700).
export default function Grass() {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const random = seededRandom(7);
    const dummy = new Object3D();
    for (let i = 0; i < COUNT; i++) {
      // Start 2m out so the stool area stays clear.
      const angle = random() * Math.PI * 2;
      const radius = 2 + random() * 22;
      const scale = 0.6 + random() * 0.9;
      dummy.position.set(
        Math.cos(angle) * radius,
        (BLADE_HEIGHT / 2) * scale,
        Math.sin(angle) * radius,
      );
      dummy.rotation.set((random() - 0.5) * 0.5, random() * Math.PI, (random() - 0.5) * 0.5);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <coneGeometry args={[0.035, BLADE_HEIGHT, 3]} />
      <meshStandardMaterial color={palette.moss} roughness={1} />
    </instancedMesh>
  );
}
