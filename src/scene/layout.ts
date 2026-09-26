// Where everything stands in the field (metres). The projector faces -z, toward the sheet.
type Vec3 = [number, number, number];

export const STOOL_HEIGHT = 0.7;
export const PROJECTOR_POSITION: Vec3 = [0, STOOL_HEIGHT, 0];
export const LENS_POSITION: Vec3 = [0, STOOL_HEIGHT + 0.15, -0.36];

export const SHEET_POSITION: Vec3 = [0, 1.45, -4.5];
export const SHEET_SIZE: [number, number] = [3.2, 1.8];

// The crow perches on top of the rear reel.
export const CROW_POSITION: Vec3 = [0, STOOL_HEIGHT + 0.72, 0.15];

export const CANISTER_POSITIONS: Vec3[] = [
  [-0.55, 0, 0.45],
  [0, 0, 0.62],
  [0.55, 0, 0.45],
];
