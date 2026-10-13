"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TODD_LAYOUT, type ToddAnimClip } from "@/lib/todd/layout";

type Props = {
  /** Active animation clip */
  clip?: ToddAnimClip;
  /** -1..1 look target in character space (overrides idle look wander when set) */
  look?: { x: number; y: number } | null;
  facing?: 1 | -1;
  size?: number;
  reducedMotion?: boolean;
  /** External phase 0..1 for syncing with locomotion distance */
  gaitPhase?: number;
  className?: string;
};

/**
 * Layered Todd rig built from the canonical PNG + extracted fuzzy layers.
 * Idle at rest shows the exact original asset; animated states use body + eyes + lids + pose sheets.
 */
export function ToddCharacter({
  clip = "idle",
  look: lookProp = null,
  facing = 1,
  size = 160,
  reducedMotion = false,
  gaitPhase: gaitProp,
  className = "",
}: Props) {
  const [t, setT] = useState(0);
  const [blink, setBlink] = useState(0);
  const [wanderLook, setWanderLook] = useState({ x: 0, y: 0 });
  const blinkTimer = useRef(0);
  const lookTimer = useRef(0);

  // Master clock
  useEffect(() => {
    if (reducedMotion) return;
    let id = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setT((v) => v + dt);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  // Randomized blink
  useEffect(() => {
    if (reducedMotion || clip === "sleep") {
      setBlink(clip === "sleep" ? 1 : 0);
      return;
    }
    let cancelled = false;
    let timeout = 0;
    const schedule = () => {
      const wait = 1600 + Math.random() * 3800 + (Math.random() < 0.12 ? 1800 : 0);
      timeout = window.setTimeout(() => {
        if (cancelled) return;
        setBlink(1);
        window.setTimeout(() => {
          if (cancelled) return;
          setBlink(0);
          if (Math.random() < 0.2) {
            window.setTimeout(() => {
              if (cancelled) return;
              setBlink(1);
              window.setTimeout(() => {
                if (!cancelled) setBlink(0);
                schedule();
              }, 100);
            }, 140);
          } else {
            schedule();
          }
        }, 90 + Math.random() * 50);
      }, wait);
    };
    if (clip === "blink") {
      setBlink(1);
      timeout = window.setTimeout(() => setBlink(0), 140);
    } else {
      schedule();
    }
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [clip, reducedMotion]);

  // Idle look wander
  useEffect(() => {
    if (reducedMotion || lookProp || clip === "sleep") {
      if (clip === "sleep") setWanderLook({ x: 0, y: 0.15 });
      return;
    }
    let cancelled = false;
    let timeout = 0;
    const schedule = () => {
      const wait = 900 + Math.random() * 2400;
      timeout = window.setTimeout(() => {
        if (cancelled) return;
        if (clip === "idle" || clip === "look") {
          setWanderLook({
            x: (Math.random() - 0.5) * 1.6,
            y: (Math.random() - 0.5) * 1.1,
          });
        }
        schedule();
      }, wait);
    };
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [clip, lookProp, reducedMotion]);

  const look = lookProp ?? wanderLook;
  const pupil = {
    x: Math.max(
      -TODD_LAYOUT.maxPupil,
      Math.min(TODD_LAYOUT.maxPupil, look.x * TODD_LAYOUT.maxPupil)
    ),
    y: Math.max(
      -TODD_LAYOUT.maxPupil,
      Math.min(TODD_LAYOUT.maxPupil, look.y * TODD_LAYOUT.maxPupil)
    ),
  };

  const gait = gaitProp ?? (clip === "walk" || clip === "run" || clip === "dance" ? (t * (clip === "run" ? 2.4 : clip === "dance" ? 1.8 : 1.5)) % 1 : 0);

  type Pose = "canonical" | "walkA" | "walkB" | "jump";
  type Deform = { sx: number; sy: number; rot: number; y: number; pose: Pose };

  // Body deformation by clip
  const deform: Deform = useMemo(() => {
    if (reducedMotion) {
      return { sx: 1, sy: 1, rot: 0, y: 0, pose: "canonical" };
    }

    switch (clip) {
      case "idle":
      case "look": {
        const breath = Math.sin(t * 2.1) * 0.018;
        const sway = Math.sin(t * 0.9) * 2.2;
        return {
          sx: 1 + breath * 0.35,
          sy: 1 - breath,
          rot: sway * 0.15,
          y: Math.sin(t * 2.1) * 1.2,
          pose: "canonical",
        };
      }
      case "blink":
        return { sx: 1.02, sy: 0.98, rot: 0, y: 0, pose: "canonical" };
      case "walk": {
        const bob = Math.abs(Math.sin(gait * Math.PI * 2));
        const lean = Math.sin(gait * Math.PI * 2) * 4;
        return {
          sx: 1 + bob * 0.06,
          sy: 1 - bob * 0.08,
          rot: lean,
          y: -bob * 5,
          // Prefer walkB/jump — walkA had checkerboard artifacts (cleaned, still secondary)
          pose: gait < 0.5 ? "walkB" : "jump",
        };
      }
      case "run": {
        const bob = Math.abs(Math.sin(gait * Math.PI * 2));
        const lean = Math.sin(gait * Math.PI * 2) * 7;
        return {
          sx: 1 + bob * 0.1,
          sy: 1 - bob * 0.14,
          rot: lean,
          y: -bob * 9,
          pose: gait < 0.5 ? "walkB" : "jump",
        };
      }
      case "hop": {
        const p = gaitProp ?? (t % 1.1) / 1.1;
        if (p < 0.18) {
          return { sx: 1.18, sy: 0.78, rot: 0, y: 4, pose: "canonical" };
        }
        if (p < 0.35) {
          return { sx: 0.86, sy: 1.22, rot: -4, y: -18, pose: "jump" };
        }
        if (p < 0.7) {
          return { sx: 0.9, sy: 1.14, rot: 3, y: -28, pose: "jump" };
        }
        return { sx: 1.16, sy: 0.82, rot: 0, y: 2, pose: "canonical" };
      }
      case "land":
        return { sx: 1.2, sy: 0.78, rot: 0, y: 3, pose: "canonical" };
      case "startled": {
        const jolt = Math.sin(Math.min(t * 14, Math.PI));
        return {
          sx: 0.88,
          sy: 1.2,
          rot: Math.sin(t * 28) * 6,
          y: -10 - jolt * 8,
          pose: "jump",
        };
      }
      case "sleep":
        return {
          sx: 1.08,
          sy: 0.9,
          rot: -6,
          y: 4,
          pose: "canonical",
        };
      case "dance": {
        const bounce = Math.abs(Math.sin(gait * Math.PI * 2));
        const dancePose: Pose =
          gait < 0.33 ? "walkB" : gait < 0.66 ? "jump" : "canonical";
        return {
          sx: 1 + Math.sin(gait * Math.PI * 4) * 0.08,
          sy: 1 - bounce * 0.12,
          rot: Math.sin(gait * Math.PI * 2) * 12,
          y: -bounce * 12,
          pose: dancePose,
        };
      }
      default:
        return { sx: 1, sy: 1, rot: 0, y: 0, pose: "canonical" };
    }
  }, [clip, t, gait, gaitProp, reducedMotion]);

  const isSleep = clip === "sleep";
  const lookActive =
    Math.abs(look.x) + Math.abs(look.y) > 0.08 ||
    blink > 0.05 ||
    isSleep ||
    clip === "look";

  // Use layered eyes when looking/blinking; pose sheets for locomotion
  const usePoseSheet = deform.pose !== "canonical";
  // Always prefer the exact canonical PNG at rest; pose sheets only for locomotion
  const bodySrc = usePoseSheet
    ? deform.pose === "walkA"
      ? TODD_LAYOUT.assets.walkA
      : deform.pose === "walkB"
        ? TODD_LAYOUT.assets.walkB
        : TODD_LAYOUT.assets.jump
    : TODD_LAYOUT.assets.canonical;

  const showLayers = lookActive;
  const lidAmount = isSleep ? 1 : blink;

  void blinkTimer;
  void lookTimer;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `scaleX(${facing})`,
      }}
      aria-hidden
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `translateY(${deform.y}px) rotate(${deform.rot}deg) scale(${deform.sx}, ${deform.sy})`,
          transformOrigin: "50% 90%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bodySrc}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />

        {showLayers && !usePoseSheet && (
          <>
            <Eye side="left" pupil={pupil} lid={lidAmount} size={size} />
            <Eye side="right" pupil={pupil} lid={lidAmount} size={size} />
          </>
        )}
      </div>

      {(clip === "startled" || clip === "hop" || clip === "dance") && !reducedMotion && (
        <>
          <span className="absolute -top-1 left-[22%] h-3.5 w-0.5 rotate-12 rounded-full bg-white/90" style={{ animation: "todd-sparkle 0.55s ease-in-out infinite" }} />
          <span className="absolute -top-3 left-1/2 h-4 w-0.5 rounded-full bg-white/90" style={{ animation: "todd-sparkle 0.55s ease-in-out 0.08s infinite" }} />
          <span className="absolute -top-1 right-[22%] h-3.5 w-0.5 -rotate-12 rounded-full bg-white/90" style={{ animation: "todd-sparkle 0.55s ease-in-out 0.16s infinite" }} />
        </>
      )}

      {clip === "sleep" && (
        <span className="absolute -right-0.5 top-0 font-mono text-[11px] text-white/45">
          zzz
        </span>
      )}
    </div>
  );
}

function Eye({
  side,
  pupil,
  lid,
  size,
}: {
  side: "left" | "right";
  pupil: { x: number; y: number };
  lid: number;
  size: number;
}) {
  const layout = side === "left" ? TODD_LAYOUT.leftEye : TODD_LAYOUT.rightEye;
  const whiteSrc =
    side === "left" ? TODD_LAYOUT.assets.eyeWhiteL : TODD_LAYOUT.assets.eyeWhiteR;
  const pupilSrc =
    side === "left" ? TODD_LAYOUT.assets.pupilL : TODD_LAYOUT.assets.pupilR;
  const lidSrc = side === "left" ? TODD_LAYOUT.assets.lidL : TODD_LAYOUT.assets.lidR;

  const eyeW = `${layout.w}%`;
  const eyeH = `${layout.h}%`;
  const left = `${layout.cx - layout.w / 2}%`;
  const top = `${layout.cy - layout.h / 2}%`;

  // Pupil travel in px relative to eye box
  const travel = (size * TODD_LAYOUT.maxPupil) / 100;

  return (
    <div
      className="pointer-events-none absolute overflow-hidden rounded-full"
      style={{ left, top, width: eyeW, height: eyeH }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={whiteSrc}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pupilSrc}
        alt=""
        draggable={false}
        className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
        style={{
          transform: `translate(calc(-50% + ${(pupil.x / TODD_LAYOUT.maxPupil) * travel}px), calc(-50% + ${(pupil.y / TODD_LAYOUT.maxPupil) * travel}px))`,
        }}
      />
      {/* Fuzzy lid — texture sampled from original body */}
      <div
        className="absolute inset-x-[-8%] top-0 origin-top overflow-hidden transition-[height] duration-75"
        style={{ height: `${Math.min(1, Math.max(0, lid)) * 108}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lidSrc}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
