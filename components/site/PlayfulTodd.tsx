"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue } from "framer-motion";

const SIZE = 96;
const QUIPS = [
  "boop!",
  "hey!!",
  "catch me~",
  "wee!",
  "i live here",
  "psst",
  "hop hop",
  "nice code",
  "hi hi",
  "zoom!",
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

type Pt = { x: number; y: number };

function homePoint(): Pt {
  const el = document.querySelector("[data-todd-home]");
  if (el) {
    const r = el.getBoundingClientRect();
    // Only perch when the hero marker is on-screen
    if (r.top >= 56 && r.bottom <= window.innerHeight - 8) {
      return { x: r.left, y: r.top };
    }
  }
  // Cozy top-left when hero scrolled away
  return { x: 28, y: 88 };
}

function roamPoint(): Pt {
  const padX = 20;
  const padTop = 70;
  const padBottom = 24;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: rand(padX, Math.max(padX + 8, vw - SIZE - padX)),
    y: rand(padTop, Math.max(padTop + 8, vh - SIZE - padBottom)),
  };
}

export function PlayfulTodd() {
  const x = useMotionValue(72);
  const y = useMotionValue(200);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [speech, setSpeech] = useState<string | null>(null);
  const [hopping, setHopping] = useState(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const busy = useRef(false);
  const reduced = useRef(false);
  const alive = useRef(true);
  const speechTimer = useRef<number | null>(null);
  const waitTimer = useRef<number | null>(null);

  const say = useCallback((text: string, ms = 1700) => {
    setSpeech(text);
    if (speechTimer.current) window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech(null), ms);
  }, []);

  const hopTo = useCallback(
    async (target: Pt) => {
      if (busy.current || !alive.current) return;
      busy.current = true;
      setHopping(true);

      const fromX = x.get();
      const fromY = y.get();
      const dx = target.x - fromX;
      if (Math.abs(dx) > 2) setFacing(dx >= 0 ? 1 : -1);

      const dist = Math.hypot(dx, target.y - fromY);
      const duration = clamp(0.32 + dist / 950, 0.38, 0.9);
      const peak = rand(32, 72);

      await Promise.all([
        animate(x, target.x, {
          duration,
          ease: [0.22, 1, 0.36, 1],
        }).finished,
        animate(
          y,
          [fromY, Math.min(fromY, target.y) - peak, target.y],
          {
            duration,
            times: [0, 0.42, 1],
            ease: [0.22, 1, 0.36, 1],
          }
        ).finished,
      ]);

      if (!alive.current) return;
      setHopping(false);
      busy.current = false;
      if (Math.random() < 0.5) say(pick(QUIPS));
    },
    [say, x, y]
  );

  const schedule = useCallback(
    (delay: number) => {
      if (waitTimer.current) window.clearTimeout(waitTimer.current);
      if (reduced.current || !alive.current) return;
      waitTimer.current = window.setTimeout(() => {
        void (async () => {
          const next = Math.random() < 0.3 ? homePoint() : roamPoint();
          await hopTo(next);
          // sometimes a double-hop burst
          if (alive.current && !reduced.current && Math.random() < 0.35) {
            await new Promise((r) => window.setTimeout(r, rand(120, 320)));
            await hopTo(roamPoint());
          }
          schedule(rand(650, 2600));
        })();
      }, delay);
    },
    [hopTo]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    alive.current = true;
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const home = homePoint();
    x.set(home.x);
    y.set(home.y);
    setReady(true);

    if (!reduced.current) schedule(1200);

    const onResize = () => {
      x.set(clamp(x.get(), 12, window.innerWidth - SIZE - 12));
      y.set(clamp(y.get(), 60, window.innerHeight - SIZE - 12));
    };
    window.addEventListener("resize", onResize);

    return () => {
      alive.current = false;
      window.removeEventListener("resize", onResize);
      if (waitTimer.current) window.clearTimeout(waitTimer.current);
      if (speechTimer.current) window.clearTimeout(speechTimer.current);
    };
  }, [schedule, x, y]);

  const onClick = () => {
    say(pick(["boop!", "hey!!", "catch me~", "wee!", "zoom!"]));
    if (reduced.current || busy.current) return;
    // Interrupt wait → flee hop burst, then resume schedule
    if (waitTimer.current) window.clearTimeout(waitTimer.current);
    void (async () => {
      await hopTo(roamPoint());
      if (alive.current) await hopTo(roamPoint());
      schedule(rand(500, 1400));
    })();
  };

  if (!ready || !mounted) return null;

  return createPortal(
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[80]"
      style={{ x, y, width: SIZE, height: SIZE }}
    >
      {speech && (
        <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#141414] px-2.5 py-1 font-sans text-[12px] text-white/90 shadow-lg">
          {speech}
        </div>
      )}

      <button
        type="button"
        aria-label="Todd the frog. Click to play."
        onClick={onClick}
        className="pointer-events-auto relative cursor-pointer appearance-none border-0 bg-transparent p-0"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg
          className={`pointer-events-none absolute -right-0.5 top-0 text-white transition-opacity ${
            hopping ? "opacity-100" : "opacity-80"
          }`}
          width="18"
          height="24"
          viewBox="0 0 22 28"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 8l6-5M7 14l7-4M9 20l6-3"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/todd/todd-original.png"
          alt=""
          draggable={false}
          width={SIZE}
          height={SIZE}
          className="h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)]"
          style={{ scaleX: facing }}
          animate={
            hopping
              ? { rotate: [0, facing * -10, facing * 5, 0] }
              : { y: [0, -3, 0] }
          }
          transition={
            hopping
              ? { duration: 0.42, ease: "easeOut" }
              : { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </button>
    </motion.div>,
    document.body
  );
}
