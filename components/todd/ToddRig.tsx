"use client";

import type { ToddState } from "@/lib/todd/types";
import type { ToddAnimClip } from "@/lib/todd/layout";
import { ToddCharacter } from "@/components/todd/ToddCharacter";

type Props = {
  state: ToddState;
  facing: 1 | -1;
  /** -1..1 look direction in character space */
  look: { x: number; y: number };
  /** 0..1 walk cycle */
  gaitPhase: number;
  /** 0..1 dance cycle */
  dancePhase: number;
  /** vertical squash amount 0.75..1.25 — folded into character deform */
  squashY: number;
  reducedMotion: boolean;
  size?: number;
};

function clipForState(state: ToddState): ToddAnimClip {
  switch (state) {
    case "walk":
    case "commanded":
      return "walk";
    case "hop":
    case "fall":
      return "hop";
    case "startled":
      return "startled";
    case "dance":
      return "dance";
    case "sleep":
      return "sleep";
    case "look":
      return "look";
    case "blink":
      return "blink";
    case "dragged":
      return "startled";
    case "hide":
      return "idle";
    default:
      return "idle";
  }
}

/**
 * Desktop adapter around ToddCharacter (layered rig + pose sheets).
 * Appearance/animation logic lives in ToddCharacter — verified in /todd-lab.
 */
export function ToddRig({
  state,
  facing,
  look,
  gaitPhase,
  dancePhase,
  squashY,
  reducedMotion,
  size = 148,
}: Props) {
  const clip = clipForState(state);
  const phase =
    clip === "dance" ? dancePhase : clip === "walk" || clip === "run" || clip === "hop" ? gaitPhase : undefined;

  // Map external squash into a slight hop/land bias when physics drives squashY
  const landish = squashY < 0.92;
  const activeClip: ToddAnimClip =
    landish && (clip === "idle" || clip === "hop") ? "land" : clip;

  return (
    <ToddCharacter
      clip={activeClip}
      facing={facing}
      look={look}
      size={size}
      reducedMotion={reducedMotion}
      gaitPhase={phase}
    />
  );
}

export type { ToddAnimClip as ToddPose };
