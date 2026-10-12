import type { ToddState } from "@/lib/todd/types";

export type ToddPose =
  | "idle"
  | "walkA"
  | "walkB"
  | "jump"
  | "startled"
  | "dance"
  | "sleep";

export const TODD_SPRITES: Record<ToddPose, string> = {
  idle: "/todd/todd-original.png",
  walkA: "/todd/todd-walk-a.png",
  walkB: "/todd/todd-walk-b.png",
  jump: "/todd/todd-jump.png",
  startled: "/todd/todd-startled.png",
  dance: "/todd/todd-dance.png",
  sleep: "/todd/todd-original.png", // sleep uses lids on idle art (generated sleep drifted)
};

/** Eye socket landmarks as % of the square sprite (tuned to todd-original). */
export const EYE_LAYOUT = {
  left: { x: 28, y: 16, w: 20, h: 20 },
  right: { x: 52, y: 16, w: 20, h: 20 },
  maxPupil: 3.2,
} as const;

export const BOW_LAYOUT = {
  x: 39,
  y: 58,
  w: 22,
  h: 12,
} as const;

export function poseForState(
  state: ToddState,
  gaitPhase: number,
  dancePhase: number
): ToddPose {
  switch (state) {
    case "walk":
    case "commanded":
      return gaitPhase < 0.5 ? "walkA" : "walkB";
    case "hop":
      return gaitPhase < 0.35 ? "jump" : gaitPhase < 0.7 ? "walkA" : "walkB";
    case "fall":
      return "jump";
    case "startled":
      return "startled";
    case "dance":
      // Cycle locomotion poses — AI dance frame drifted (added a mouth); avoid it.
      if (dancePhase < 0.33) return "walkA";
      if (dancePhase < 0.66) return "jump";
      return "walkB";
    case "sleep":
      return "sleep";
    case "dragged":
      return "jump";
    case "hide":
      return "idle";
    default:
      return "idle";
  }
}
