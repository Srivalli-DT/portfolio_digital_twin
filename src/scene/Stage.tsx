import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Stats } from '@react-three/drei';
import CameraRig from './CameraRig';
import Canisters from './Canisters';
import Crow from './Crow';
import Effects from './Effects';
import Field from './Field';
import FocusKnob from './FocusKnob';
import ProjectedFrame from './ProjectedFrame';
import Projector from './Projector';
import Sheet from './Sheet';
import { useFilm } from '../state/store';
import { palette } from './palette';
import { shots } from './shots';

// Add ?stats to the URL to see an FPS counter.
const showStats = new URLSearchParams(window.location.search).has('stats');

// The whole 3D film set.
export default function Stage() {
  // 2 = full quality, 1 = no grain, 0 = no grain + 1x resolution. Only ever goes down.
  const [quality, setQuality] = useState(2);

  return (
    // `flat` turns off tone mapping, so the palette colours render exactly as written.
    <Canvas
      flat
      dpr={quality >= 1 ? [1, 2] : 1}
      camera={{ fov: 35, near: 0.1, far: 100, position: shots.field.position }}
      // A click on the field (not on the crow or a canister) closes an open reel (SPEC section 7).
      onPointerMissed={() => {
        if (useFilm.getState().scene === 'reel') useFilm.getState().closeReel();
      }}
    >
      <PerformanceMonitor onDecline={() => setQuality((q) => Math.max(0, q - 1))} />
      <color attach="background" args={[palette.ink]} />
      <fog attach="fog" args={[palette.fog, 5, 26]} />

      <CameraRig />
      <Field />
      <Projector />
      <FocusKnob />
      <Sheet />
      {/* Waits for the reel posters to load; the rest of the scene draws meanwhile. */}
      <Suspense fallback={null}>
        <ProjectedFrame />
      </Suspense>
      <Canisters />
      <Crow />
      <Effects grain={quality >= 2} />
      {showStats && <Stats />}
    </Canvas>
  );
}
