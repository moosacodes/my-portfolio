"use client";

import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ToddState } from "@/lib/todd/types";

type Props = {
  state: ToddState;
  facing: 1 | -1;
  lookTilt: { x: number; y: number };
  reducedMotion: boolean;
  size?: number;
};

/**
 * Fun Todd over the canonical transparent PNG.
 * Keeps the artwork intact — personality from bounce, lean, squash, spin, sparkles.
 */
export function ToddRig({
  state,
  facing,
  lookTilt,
  reducedMotion,
  size = 120,
}: Props) {
  const squash = useSpring(1, { stiffness: 260, damping: 16 });
  const [scaleX, setScaleX] = useState(1);
  const bodyY = useSpring(0, { stiffness: 180, damping: 14 });
  const rot = useSpring(0, { stiffness: 160, damping: 12 });
  const bob = useSpring(0, { stiffness: 80, damping: 10 });
  const danceRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);

  useMotionValueEvent(squash, "change", (v) => setScaleX(2 - v));

  useEffect(() => {
    if (reducedMotion) {
      rot.set(0);
      return;
    }
    rot.set(lookTilt.x * 5);
  }, [lookTilt.x, rot, reducedMotion]);

  useEffect(() => {
    if (danceRef.current) cancelAnimationFrame(danceRef.current);
    if (idleRef.current) cancelAnimationFrame(idleRef.current);
    danceRef.current = null;
    idleRef.current = null;

    if (reducedMotion) {
      squash.set(1);
      bodyY.set(0);
      bob.set(0);
      return;
    }

    switch (state) {
      case "hop":
      case "walk":
      case "commanded":
        squash.set(0.9);
        bodyY.set(-16);
        break;
      case "fall":
        squash.set(1.12);
        bodyY.set(8);
        break;
      case "startled":
        squash.set(0.82);
        bodyY.set(-22);
        break;
      case "dragged":
        squash.set(1.06);
        break;
      case "dance": {
        let frame = 0;
        const loop = () => {
          frame++;
          squash.set(0.9 + Math.sin(frame / 3.5) * 0.12);
          bodyY.set(Math.sin(frame / 2.8) * -16);
          rot.set(Math.sin(frame / 2.2) * 18);
          danceRef.current = requestAnimationFrame(loop);
        };
        danceRef.current = requestAnimationFrame(loop);
        break;
      }
      case "sleep":
        squash.set(1.05);
        bodyY.set(6);
        rot.set(-8);
        break;
      case "hide":
        bodyY.set(14);
        squash.set(0.92);
        break;
      default: {
        squash.set(1);
        bodyY.set(0);
        let frame = 0;
        const loop = () => {
          frame++;
          bob.set(Math.sin(frame / 28) * 5);
          idleRef.current = requestAnimationFrame(loop);
        };
        idleRef.current = requestAnimationFrame(loop);
      }
    }

    return () => {
      if (danceRef.current) cancelAnimationFrame(danceRef.current);
      if (idleRef.current) cancelAnimationFrame(idleRef.current);
    };
  }, [state, reducedMotion, squash, bodyY, rot, bob]);

  const sleeping = state === "sleep";
  const hype =
    state === "dance" || state === "startled" || state === "hop";

  return (
    <motion.div
      className="relative select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      style={{
        width: size,
        height: size,
        scaleX: facing,
        y: bodyY,
        rotate: rot,
      }}
      aria-hidden
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          scaleY: squash,
          scaleX,
          y: bob,
          transformOrigin: "50% 92%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/todd/todd-original.png"
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full object-contain"
        />
      </motion.div>

      {hype && !reducedMotion && (
        <>
          <span
            className="absolute -top-1 left-[20%] h-3 w-0.5 rotate-12 rounded-full bg-white/90"
            style={{ animation: "todd-sparkle 0.7s ease-in-out infinite" }}
          />
          <span
            className="absolute -top-2 left-1/2 h-4 w-0.5 rounded-full bg-white/90"
            style={{ animation: "todd-sparkle 0.7s ease-in-out 0.1s infinite" }}
          />
          <span
            className="absolute -top-1 right-[22%] h-3 w-0.5 -rotate-12 rounded-full bg-white/90"
            style={{ animation: "todd-sparkle 0.7s ease-in-out 0.2s infinite" }}
          />
        </>
      )}

      {sleeping && (
        <span className="absolute -right-2 top-0 font-mono text-xs text-zinc-400">
          zzz
        </span>
      )}
    </motion.div>
  );
}
