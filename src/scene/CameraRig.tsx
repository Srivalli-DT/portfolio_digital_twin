import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { isShotName, shots } from './shots';

// Phase 1: jump straight to a shot. Preview another with ?shot=wide (or projector, sheet, sky).
// Phase 2 replaces the jump with a gsap dolly driven by the store.
export default function CameraRig() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('shot');
    const shot = shots[isShotName(param) ? param : 'field'];
    camera.position.set(...shot.position);
    camera.lookAt(...shot.target);
  }, [camera]);

  return null;
}
