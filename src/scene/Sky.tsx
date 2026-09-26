import { useMemo } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';
import { palette } from './palette';

const vertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 horizon;
  uniform vec3 zenith;
  varying vec3 vDirection;
  void main() {
    float t = smoothstep(0.0, 0.5, vDirection.y);
    gl_FragColor = vec4(mix(horizon, zenith, t), 1.0);
    #include <colorspace_fragment>
  }
`;

// A big inside-out sphere: fog colour at the horizon (so the ground melts into it), ink overhead.
export default function Sky() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          horizon: { value: new Color(palette.fog) },
          zenith: { value: new Color(palette.ink) },
        },
        vertexShader,
        fragmentShader,
      }),
    [],
  );

  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[60, 32, 16]} />
    </mesh>
  );
}
