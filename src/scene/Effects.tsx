import {
  BrightnessContrast,
  EffectComposer,
  HueSaturation,
  Noise,
  Vignette,
} from '@react-three/postprocessing';

// Film look (SPEC section 9): grain, vignette, a slightly faded grade. Nothing else.
// `premultiply` scales the grain by the image brightness, so it needs a higher opacity to show.
const GRAIN_OPACITY = 0.3;

type EffectsProps = {
  // Turned off first when the PerformanceMonitor sees slow frames.
  grain: boolean;
};

export default function Effects({ grain }: EffectsProps) {
  return (
    <EffectComposer multisampling={0}>
      <HueSaturation saturation={-0.2} />
      {/* Negative contrast lifts the blacks, like old film stock. */}
      <BrightnessContrast brightness={0.01} contrast={-0.08} />
      <Vignette offset={0.3} darkness={0.6} />
      <Noise premultiply opacity={grain ? GRAIN_OPACITY : 0} />
    </EffectComposer>
  );
}
