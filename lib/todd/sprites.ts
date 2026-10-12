import type { ToddState } from "@/lib/todd/types";

export type ToddPose =
  | "idle"
  | "walkA"
  | "walkB"
  | "jump"
  | "startled"
  | "dance"
  | "sleep";

/** Canonical resting art is always todd-original.png (exact supplied asset). */
export const TODD_CANONICAL = "/todd/todd-original.png";

export const TODD_SPRITES: Record<ToddPose, string> = {
  idle: TODD_CANONICAL,
  walkA: "/todd/todd-walk-a.png",
  walkB: "/todd/todd-walk-b.png",
  jump: "/todd/todd-jump.png",
  // Missing pose sheets fall back to the canonical PNG — never invent a redraw
  startled: TODD_CANONICAL,
  dance: TODD_CANONICAL,
  sleep: TODD_CANONICAL,
};

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
