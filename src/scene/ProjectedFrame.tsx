import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Color, SRGBColorSpace, type ShaderMaterial, type Texture } from 'three';
import { projects } from '../content/projects';
import { focusPuzzle } from '../content/puzzles';
import { asset } from '../lib/asset';
import { prefersReducedMotion } from '../lib/transitions';
import { useFilm, type ReelId } from '../state/store';
import { createFocusChart } from './focusChart';
import { SHEET_POSITION } from './layout';
import { palette } from './palette';

// Largest blur, in texture-space units (0.03 ≈ 3% of the image width).
const MAX_BLUR = 0.03;
// How far off (on the 0–100 focus scale) until the blur is at its largest.
const BLUR_RANGE = 40;
// Ongoing projector flicker on the image: up to 4% darker, every frame.
const FLICKER = 0.04;

const POSTER_URLS = projects.map((project) => asset(project.media.poster));

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Averages 24 samples spread in a disc (golden-angle spiral) = a soft lens blur.
const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float blur;
  uniform float opacity;
  uniform float brightness;
  uniform vec3 tint;
  varying vec2 vUv;
  void main() {
    vec3 sum = texture2D(map, vUv).rgb;
    for (int i = 1; i < 24; i++) {
      float angle = float(i) * 2.39996;
      float radius = sqrt(float(i) / 24.0) * blur;
      sum += texture2D(map, vUv + vec2(cos(angle), sin(angle) * 1.78) * radius).rgb;
    }
    gl_FragColor = vec4(sum / 24.0 * tint * brightness, opacity);
    #include <colorspace_fragment>
  }
`;

// The image the projector throws on the sheet: during Puzzle I, the focus chart (blurred by how far
// the lens is from the right setting); during a reel, that project's poster, with a slight flicker.
export default function ProjectedFrame() {
  const texture = useMemo(() => createFocusChart(focusPuzzle.clue), []);
  // Posters load once, up front (the Suspense around this component waits for them).
  const posters = useTexture(POSTER_URLS, (loaded) => {
    for (const poster of loaded) poster.colorSpace = SRGBColorSpace;
  });
  const posterFor = useMemo(() => {
    const byReel = new Map<ReelId, Texture>();
    projects.forEach((project, i) => byReel.set(project.reel, posters[i]));
    return byReel;
  }, [posters]);
  const flicker = useMemo(() => !prefersReducedMotion(), []);
  // Uniforms are the values the shader reads. They are changed every frame through `material`.
  const uniforms = useMemo(
    () => ({
      map: { value: texture },
      blur: { value: MAX_BLUR },
      opacity: { value: 0 },
      brightness: { value: 1 },
      // Warm the image toward the lamp colour, like light through old film.
      tint: { value: new Color('#ffffff').lerp(new Color(palette.lamp), 0.35) },
    }),
    [texture],
  );
  const material = useRef<ShaderMaterial>(null);

  useEffect(() => () => texture.dispose(), [texture]);

  // Ease blur and visibility toward their targets each frame (reads the store directly).
  useFrame((_, delta) => {
    if (!material.current) return;
    const { scene, activeReel, focus, solved } = useFilm.getState();
    const playingReel = scene === 'reel' && activeReel !== null;
    const focusing = scene === 'puzzle' && activeReel === 'I';
    const off = Math.min(1, Math.abs(focus - focusPuzzle.target) / BLUR_RANGE);
    const targetBlur = playingReel || solved.includes('I') ? 0 : off * MAX_BLUR;
    const showing = playingReel || focusing;

    const { map, blur, opacity, brightness } = material.current.uniforms;
    // Only swap the picture while it's visible, so it doesn't change mid-fade-out.
    if (playingReel) map.value = posterFor.get(activeReel) ?? texture;
    else if (focusing) map.value = texture;
    brightness.value = flicker && playingReel ? 1 - Math.random() * FLICKER : 1;
    blur.value += (targetBlur - blur.value) * (1 - Math.exp(-10 * delta));
    opacity.value += ((showing ? 1 : 0) - opacity.value) * (1 - Math.exp(-4 * delta));
  });

  return (
    <mesh position={[SHEET_POSITION[0], SHEET_POSITION[1], SHEET_POSITION[2] + 0.07]}>
      <planeGeometry args={[2.6, 1.46]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
