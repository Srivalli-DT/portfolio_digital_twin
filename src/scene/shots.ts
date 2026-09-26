// Preset camera shots. The camera only ever moves between these (SPEC section 9).
type Vec3 = [number, number, number];

export type ShotName = 'wide' | 'field' | 'projector' | 'sheet' | 'sky';

export const shots: Record<ShotName, { position: Vec3; target: Vec3 }> = {
  wide: { position: [0, 2.2, 11], target: [0, 1.1, -1.5] },
  // Framed so the canisters stay above the bottom letterbox bar.
  field: { position: [2.1, 1.55, 5.4], target: [-0.1, 0.9, -1.2] },
  projector: { position: [1.3, 1.65, 2.1], target: [0, 1.15, 0] },
  sheet: { position: [0, 1.5, 0.8], target: [0, 1.45, -4.5] },
  sky: { position: [0, 1.2, 4.5], target: [0, 6, -10] },
};

export function isShotName(value: string | null): value is ShotName {
  return value !== null && value in shots;
}
