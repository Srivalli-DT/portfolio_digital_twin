import { CanvasTexture, SRGBColorSpace } from 'three';
import { palette } from './palette';

const WIDTH = 1024;
const HEIGHT = 576;
const STAR_SPOKES = 36;

// Draws Puzzle I's image: a camera focus chart (a "Siemens star" + rings) with the clue
// number small in the corner. Fine detail like this blurs obviously when out of focus.
export function createFocusChart(clue: number): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is not available');

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  ctx.fillStyle = palette.bone;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = palette.ink;
  ctx.strokeStyle = palette.ink;

  // Siemens star: alternating black wedges meeting in the middle.
  for (let i = 0; i < STAR_SPOKES; i += 2) {
    const a1 = (i / STAR_SPOKES) * Math.PI * 2;
    const a2 = ((i + 1) / STAR_SPOKES) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 170, a1, a2);
    ctx.closePath();
    ctx.fill();
  }

  ctx.lineWidth = 4;
  for (const radius of [200, 230]) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Crosshair and a frame line, like a projectionist's test reel.
  ctx.beginPath();
  ctx.moveTo(cx - 260, cy);
  ctx.lineTo(cx + 260, cy);
  ctx.moveTo(cx, cy - 260);
  ctx.lineTo(cx, cy + 260);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, WIDTH - 56, HEIGHT - 56);

  // The clue, small in the bottom-right corner. Only readable once it's sharp.
  ctx.font = '500 44px "IBM Plex Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(String(clue), WIDTH - 56, HEIGHT - 48);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
