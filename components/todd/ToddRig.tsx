"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ToddState } from "@/lib/todd/types";
import {
  BOW_LAYOUT,
  EYE_LAYOUT,
  TODD_SPRITES,
  poseForState,
  type ToddPose,
} from "@/lib/todd/sprites";

type Props = {
  state: ToddState;
  facing: 1 | -1;
  /** -1..1 look direction in character space */
  look: { x: number; y: number };
  /** 0..1 walk cycle */
  gaitPhase: number;
  /** 0..1 dance cycle */
  dancePhase: number;
  /** vertical squash amount 0.75..1.25 */
  squashY: number;
  reducedMotion: boolean;
  size?: number;
};

/**
 * Layered Todd: pose sprites + clipped eye look + flocked lids + bow bob.
 * Idle/sleep/look use the canonical original PNG; locomotion uses pose frames.
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
  const pose = poseForState(state, gaitPhase, dancePhase);
  const src = TODD_SPRITES[pose];
  const [blink, setBlink] = useState(0);
  const bow = useSpring(0, { stiffness: 140, damping: 10 });
  const breath = useSpring(0, { stiffness: 40, damping: 12 });

  const useLiveEyes = pose === "idle" || pose === "sleep";
  const lidClose =
    state === "sleep" ? 1 : blink;

  // Natural randomized blink (not a fixed metronome)
  useEffect(() => {
    if (reducedMotion || state === "sleep" || state === "dragged") return;
    let cancelled = false;
    let t: number;
    const schedule = () => {
      const wait = 1800 + Math.random() * 4200 + (Math.random() < 0.15 ? 2000 : 0);
      t = window.setTimeout(() => {
        if (cancelled) return;
        setBlink(1);
        window.setTimeout(() => {
          if (!cancelled) setBlink(0);
          // occasional double-blink
          if (!cancelled && Math.random() < 0.18) {
            window.setTimeout(() => {
              if (cancelled) return;
              setBlink(1);
              window.setTimeout(() => {
                if (!cancelled) setBlink(0);
                schedule();
              }, 110);
            }, 160);
          } else {
            schedule();
          }
        }, 90 + Math.random() * 60);
      }, wait);
    };
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [state, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      bow.set(0);
      return;
    }
    if (state === "dance") bow.set(Math.sin(dancePhase * Math.PI * 4) * 18);
    else if (state === "walk" || state === "hop" || state === "commanded")
      bow.set(Math.sin(gaitPhase * Math.PI * 2) * 10);
    else if (state === "startled" || state === "dragged") bow.set(14);
    else bow.set(Math.sin(Date.now() / 400) * 2);
  }, [state, dancePhase, gaitPhase, bow, reducedMotion]);

  // Idle breathing
  useEffect(() => {
    if (reducedMotion || (state !== "idle" && state !== "look")) {
      breath.set(0);
      return;
    }
    let frame = 0;
    let id = 0;
    const loop = () => {
      frame++;
      breath.set(Math.sin(frame / 36) * 3);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [state, reducedMotion, breath]);

  const scaleY = squashY;
  const scaleX = useMemo(() => 2 - squashY, [squashY]);

  const pupil = {
    x: Math.max(-EYE_LAYOUT.maxPupil, Math.min(EYE_LAYOUT.maxPupil, look.x * EYE_LAYOUT.maxPupil)),
    y: Math.max(-EYE_LAYOUT.maxPupil, Math.min(EYE_LAYOUT.maxPupil, look.y * EYE_LAYOUT.maxPupil)),
  };

  const sparkles =
    !reducedMotion &&
    (state === "startled" || state === "dance" || state === "hop");

  return (
    <motion.div
      className="relative select-none"
      style={{
        width: size,
        height: size,
        scaleX: facing,
      }}
      aria-hidden
    >
      <motion.div
        className="relative h-full w-full drop-shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
        style={{
          scaleX,
          scaleY,
          y: breath,
          transformOrigin: "50% 92%",
        }}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={src}
            src={src}
            alt=""
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
        </AnimatePresence>

        {/* Live eyes only on canonical idle art (pose frames already have baked eyes) */}
        {useLiveEyes && (
          <>
            <Eye layout={EYE_LAYOUT.left} pupil={pupil} lid={lidClose} />
            <Eye layout={EYE_LAYOUT.right} pupil={pupil} lid={lidClose} />
          </>
        )}

        {/* Sleep lids even when using idle sprite */}
        {state === "sleep" && !useLiveEyes && (
          <>
            <Lid layout={EYE_LAYOUT.left} amount={1} />
            <Lid layout={EYE_LAYOUT.right} amount={1} />
          </>
        )}

        {/* Bow accent bob */}
        <motion.div
          className="pointer-events-none absolute"
          style={{
            left: `${BOW_LAYOUT.x}%`,
            top: `${BOW_LAYOUT.y}%`,
            width: `${BOW_LAYOUT.w}%`,
            height: `${BOW_LAYOUT.h}%`,
            rotate: bow,
          }}
        >
          <div className="mx-auto h-[70%] w-[90%] rounded-[3px] bg-black/85" />
        </motion.div>
      </motion.div>

      {sparkles && (
        <>
          <span className="absolute -top-1 left-[22%] h-3.5 w-0.5 rotate-12 rounded-full bg-white" style={{ animation: "todd-sparkle 0.55s ease-in-out infinite" }} />
          <span className="absolute -top-3 left-1/2 h-4 w-0.5 rounded-full bg-white" style={{ animation: "todd-sparkle 0.55s ease-in-out 0.08s infinite" }} />
          <span className="absolute -top-1 right-[22%] h-3.5 w-0.5 -rotate-12 rounded-full bg-white" style={{ animation: "todd-sparkle 0.55s ease-in-out 0.16s infinite" }} />
        </>
      )}

      {state === "sleep" && (
        <span className="absolute -right-1 top-1 font-mono text-xs text-zinc-400">
          zzz
        </span>
      )}
    </motion.div>
  );
}

function Eye({
  layout,
  pupil,
  lid,
}: {
  layout: { x: number; y: number; w: number; h: number };
  pupil: { x: number; y: number };
  lid: number;
}) {
  // Shift a clipped crop of the canonical art so the real painted pupils move.
  const imgLeft = `-${(layout.x / layout.w) * 100}%`;
  const imgTop = `-${(layout.y / layout.h) * 100}%`;
  const imgW = `${(100 / layout.w) * 100}%`;
  const imgH = `${(100 / layout.h) * 100}%`;

  return (
    <div
      className="pointer-events-none absolute overflow-hidden rounded-full"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.w}%`,
        height: `${layout.h}%`,
      }}
    >
      {/* Cover baked eye so the shifted crop is the only visible eye */}
      <div
        className="absolute inset-[-20%]"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, #b8f24c 0%, #8edc22 60%, #6fbf12 100%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={TODD_SPRITES.idle}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{
          left: imgLeft,
          top: imgTop,
          width: imgW,
          height: imgH,
          transform: `translate(${pupil.x}px, ${pupil.y}px)`,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 origin-top transition-[height] duration-75"
        style={{
          height: `${lid * 100}%`,
          background:
            "linear-gradient(180deg, #9ee824 0%, #7edc18 70%, #6bbb12 100%)",
        }}
      />
    </div>
  );
}

function Lid({
  layout,
  amount,
}: {
  layout: { x: number; y: number; w: number; h: number };
  amount: number;
}) {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden rounded-full"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.w}%`,
        height: `${layout.h}%`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 bg-[#8fdc1f]"
        style={{ height: `${amount * 100}%` }}
      />
    </div>
  );
}

export type { ToddPose };
