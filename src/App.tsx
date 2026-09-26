import { lazy, Suspense } from 'react';
import { site } from './content/site';
import Stage from './scene/Stage';
import { useFilm } from './state/store';
import CutOverlay from './ui/CutOverlay';
import Header from './ui/Header';
import Letterbox from './ui/Letterbox';
import Slate from './ui/Slate';
import TitleCard from './ui/TitleCard';
import './App.css';

// Loaded only when first opened, to keep the first download small.
const Credits = lazy(() => import('./ui/Credits'));
const PlainCut = lazy(() => import('./ui/PlainCut'));

const TITLE_LINES = [site.filmTitle, site.titleCard.byline];
const SCENES_WITH_HEADER = ['field', 'puzzle', 'reel', 'credits'];

// Layers, back to front: 3D stage, letterbox bars, header, panels, slate/title, black cut layer.
export default function App() {
  const scene = useFilm((state) => state.scene);
  const startField = useFilm((state) => state.startField);

  return (
    <div className="app">
      <Stage />
      <Letterbox />
      {SCENES_WITH_HEADER.includes(scene) && <Header />}
      <Suspense fallback={null}>
        {scene === 'credits' && <Credits />}
        {scene === 'plain' && <PlainCut />}
      </Suspense>
      {scene === 'slate' && <Slate />}
      {scene === 'title' && <TitleCard lines={TITLE_LINES} onDone={startField} />}
      <CutOverlay />
    </div>
  );
}
