import { Canvas } from '@react-three/fiber';
import './App.css';

export default function App() {
  return (
    <div className="app">
      {/* Empty 3D canvas for now; the field arrives in Phase 1. */}
      <Canvas dpr={[1, 2]} className="app__canvas">
        {/* 3D can't read CSS variables, so this is --ink written out. */}
        <color attach="background" args={['#0d0c0a']} />
      </Canvas>
      <p className="app__hello">hello</p>
    </div>
  );
}
