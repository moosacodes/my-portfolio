"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import type { ToddState } from "@/lib/todd/types";

type Props = {
  state: ToddState;
  facing: 1 | -1;
  pupilTarget: { x: number; y: number };
  reducedMotion: boolean;
  size?: number;
};

/**
 * Layered Todd rig over the canonical transparent PNG.
 * Pupils, blink lids, bow bob, and body squash are independent layers.
 * Limitation: single source pose — articulation is overlay-based, not multi-pose.
 */
export function ToddRig({
  state,
  facing,
  pupilTarget,
  reducedMotion,
  size = 88,
}: Props) {
  const blink = useMotionValue(0);
  const squash = useSpring(1, { stiffness: 280, damping: 18 });
  const bowRot = useSpring(0, { stiffness: 120, damping: 10 });
  const bodyY = useSpring(0, { stiffness: 200, damping: 16 });
  const wiggle = useSpring(0, { stiffness: 400, damping: 12 });

  const pupilX = useSpring(0, { stiffness: 180, damping: 20 });
  const pupilY = useSpring(0, { stiffness: 180, damping: 20 });
  const pupilXRight = useTransform(pupilX, (v) => v * 0.9);

  const lidHeight = useTransform(blink, [0, 1], ["0%", "55%"]);
  const scaleY = squash;
  const scaleX = useTransform(squash, (v) => 2 - v);

  const danceRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      pupilX.set(0);
      pupilY.set(0);
      return;
    }
    pupilX.set(Math.max(-4, Math.min(4, pupilTarget.x)));
    pupilY.set(Math.max(-3, Math.min(3, pupilTarget.y)));
  }, [pupilTarget.x, pupilTarget.y, pupilX, pupilY, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    if (state === "blink") {
      blink.set(1);
      const t = window.setTimeout(() => blink.set(0), 120);
      return () => clearTimeout(t);
    }
    if (state !== "sleep") blink.set(0);
  }, [state, blink, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      squash.set(1);
      bodyY.set(0);
      bowRot.set(0);
      wiggle.set(0);
      return;
    }

    if (danceRef.current) {
      cancelAnimationFrame(danceRef.current);
      danceRef.current = null;
    }

    switch (state) {
      case "hop":
      case "walk":
      case "commanded":
        squash.set(0.88);
        bodyY.set(-10);
        bowRot.set(8);
        break;
      case "fall":
        squash.set(1.15);
        bodyY.set(6);
        break;
      case "startled":
        squash.set(0.8);
        bodyY.set(-14);
        wiggle.set(8);
        bowRot.set(-12);
        break;
      case "dragged":
        squash.set(1.08);
        wiggle.set(14);
        bowRot.set(18);
        break;
      case "dance": {
        let frame = 0;
        const loop = () => {
          frame++;
          squash.set(0.92 + Math.sin(frame / 4) * 0.1);
          bodyY.set(Math.sin(frame / 3) * -12);
          bowRot.set(Math.sin(frame / 2) * 22);
          wiggle.set(Math.sin(frame / 2.5) * 10);
          danceRef.current = requestAnimationFrame(loop);
        };
        danceRef.current = requestAnimationFrame(loop);
        break;
      }
      case "sleep":
        squash.set(1.06);
        bodyY.set(4);
        bowRot.set(-4);
        blink.set(1);
        break;
      case "hide":
        bodyY.set(8);
        squash.set(0.95);
        break;
      default:
        squash.set(1);
        bodyY.set(0);
        bowRot.set(0);
        wiggle.set(0);
    }

    return () => {
      if (danceRef.current) cancelAnimationFrame(danceRef.current);
    };
  }, [state, reducedMotion, squash, bodyY, bowRot, wiggle, blink]);

  useEffect(() => {
    if (reducedMotion || state === "sleep" || state === "dragged") return;
    let cancelled = false;
    let timeout: number;

    const schedule = () => {
      timeout = window.setTimeout(
        () => {
          if (cancelled) return;
          blink.set(1);
          window.setTimeout(() => {
            if (!cancelled) blink.set(0);
            schedule();
          }, 140);
        },
        2800 + Math.random() * 3200
      );
    };
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [state, blink, reducedMotion]);

  const sleeping = state === "sleep";

  return (
    <motion.div
      className="relative select-none"
      style={{
        width: size,
        height: size,
        scaleX: facing,
        y: bodyY,
        rotate: wiggle,
      }}
      aria-hidden
    >
      <motion.div
        className="relative h-full w-full"
        style={{ scaleX, scaleY, transformOrigin: "50% 90%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/todd/todd-original.png"
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full object-contain"
        />

        {!sleeping && (
          <>
            <EyeOverlay
              left="28%"
              pupilX={pupilX}
              pupilY={pupilY}
              lidHeight={lidHeight}
            />
            <EyeOverlay
              left="54%"
              pupilX={pupilXRight}
              pupilY={pupilY}
              lidHeight={lidHeight}
            />
          </>
        )}

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[62%] h-[10%] w-[22%] -translate-x-1/2"
          style={{ rotate: bowRot }}
        >
          <div className="h-full w-full rounded-sm bg-black/90 shadow-sm" />
        </motion.div>
      </motion.div>

      {sleeping && (
        <span className="absolute -right-1 top-0 text-xs text-zinc-400">
          zzz
        </span>
      )}
    </motion.div>
  );
}

function EyeOverlay({
  left,
  pupilX,
  pupilY,
  lidHeight,
}: {
  left: string;
  pupilX: MotionValue<number>;
  pupilY: MotionValue<number>;
  lidHeight: MotionValue<string>;
}) {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden rounded-full"
      style={{ left, top: "16%", width: "20%", height: "20%" }}
    >
      {/* Replace baked-in pupils with a live eyeball layer */}
      <div className="absolute inset-0 rounded-full bg-white shadow-inner" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
        style={{ x: pupilX, y: pupilY }}
      >
        <span className="absolute right-[16%] top-[12%] h-[30%] w-[30%] rounded-full bg-white" />
      </motion.div>
      <motion.div
        className="absolute inset-x-0 top-0 bg-[#7CFC00]"
        style={{ height: lidHeight }}
      />
    </div>
  );
}
