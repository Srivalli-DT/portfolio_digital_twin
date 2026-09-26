// Preset camera shots. The camera only ever moves between these (SPEC section 9).
type Vec3 = [number, number, number];

export type ShotName = 'wide' | 'field' | 'projector' | 'sheet' | 'sky';

export const shots: Record<ShotName, { position: Vec3; target: Vec3 }> = {
  wide: { position: [0, 2.2, 11], target: [0, 1.1, -1.5] },
  // Framed so the canisters stay above the bottom letterbox bar.
  field: { position: [2.1, 1.55, 5.4], target: [-0.1, 0.9, -1.2] },
  // Behind and above the projector: focus knob low-left, sheet left of the puzzle panel (puzzles).
  projector: { position: [0.9, 1.7, 2.4], target: [0.15, 1.0, -4.5] },
  // Facing the sheet, aimed right of it so the reel panel doesn't cover the picture.
  sheet: { position: [0.9, 1.5, 0.9], target: [0.9, 1.45, -4.5] },
  sky: { position: [0, 1.2, 4.5], target: [0, 6, -10] },
};

export function isShotName(value: string | null): value is ShotName {
  return value !== null && value in shots;
}
