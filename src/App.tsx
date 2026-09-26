import { lazy, Suspense, useEffect } from 'react';
import { dialogue } from './content/dialogue';
import { puzzleText } from './content/puzzles';
import { site } from './content/site';
import PuzzleOverlay from './puzzles/PuzzleOverlay';
import Stage from './scene/Stage';
import { useFilm, WEBGL } from './state/store';
import CutOverlay from './ui/CutOverlay';
import Dialogue from './ui/Dialogue';
import Header from './ui/Header';
import Letterbox from './ui/Letterbox';
import ReelPanel from './ui/ReelPanel';
import Slate from './ui/Slate';
import TalkButton from './ui/TalkButton';
import TitleCard from './ui/TitleCard';
import './App.css';

// Loaded only when first opened, to keep the first download small.
const Credits = lazy(() => import('./ui/Credits'));
const PlainCut = lazy(() => import('./ui/PlainCut'));

const TITLE_LINES = [site.filmTitle, site.titleCard.byline];
// "REEL I" etc. Built once, so the title card doesn't restart on every render.
const REEL_CARD_LINES = {
  I: [puzzleText.reelLabel.replace('{reel}', 'I')],
  II: [puzzleText.reelLabel.replace('{reel}', 'II')],
  III: [puzzleText.reelLabel.replace('{reel}', 'III')],
};
const SCENES_WITH_HEADER = ['field', 'puzzle', 'reel', 'credits'];

// Layers, back to front: 3D stage, letterbox bars, header, panels, slate/title, black cut layer.
export default function App() {
  const scene = useFilm((state) => state.scene);
  const startField = useFilm((state) => state.startField);
  const activeReel = useFilm((state) => state.activeReel);
  const reelCard = useFilm((state) => state.reelCard);
  const beginReel = useFilm((state) => state.beginReel);
  const escape = useFilm((state) => state.escape);
  const dialogueNode = useFilm((state) => state.dialogueNode);
  const node = dialogueNode ? dialogue[dialogueNode] : undefined;

  // One Esc handler for the whole site: the store decides what to close.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [escape]);

  return (
    <div className="app">
      {WEBGL && <Stage />}
      <Letterbox />
      {SCENES_WITH_HEADER.includes(scene) && <Header />}
      {scene === 'puzzle' && !reelCard && <PuzzleOverlay />}
      {scene === 'reel' && activeReel && <ReelPanel key={activeReel} reel={activeReel} />}
      {/* key: a new node remounts Dialogue, so it starts from its first line. */}
      {node && <Dialogue key={node.id} node={node} />}
      {scene === 'field' && !node && <TalkButton />}
      <Suspense fallback={null}>
        {scene === 'credits' && <Credits />}
        {scene === 'plain' && <PlainCut />}
      </Suspense>
      {scene === 'slate' && <Slate />}
      {scene === 'title' && <TitleCard lines={TITLE_LINES} onDone={startField} />}
      {reelCard && (
        <TitleCard key={reelCard} lines={REEL_CARD_LINES[reelCard]} onDone={beginReel} hold={1} />
      )}
      <CutOverlay />
    </div>
  );
}
