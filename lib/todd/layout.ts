/**
 * Landmark layout derived from todd-original.png (see scripts/extract-todd-layers.mjs).
 * All values are percentages of the square canvas unless noted.
 */
export const TODD_LAYOUT = {
  canvas: 500,
  leftEye: { cx: 32.6, cy: 29.2, w: 14.4, h: 12.6 },
  rightEye: { cx: 66.4, cy: 28.8, w: 14.6, h: 12.2 },
  /** Max pupil travel as % of canvas */
  maxPupil: 2.8,
  assets: {
    canonical: "/todd/todd-original.png",
    body: "/todd/layers/body.png",
    eyeWhiteL: "/todd/layers/eye-white-l.png",
    eyeWhiteR: "/todd/layers/eye-white-r.png",
    pupilL: "/todd/layers/pupil-l.png",
    pupilR: "/todd/layers/pupil-r.png",
    lidL: "/todd/layers/lid-l.png",
    lidR: "/todd/layers/lid-r.png",
    walkA: "/todd/todd-walk-a.png",
    walkB: "/todd/todd-walk-b.png",
    jump: "/todd/todd-jump.png",
  },
} as const;

export type ToddAnimClip =
  | "idle"
  | "look"
  | "blink"
  | "walk"
  | "run"
  | "hop"
  | "land"
  | "startled"
  | "sleep"
  | "dance";
