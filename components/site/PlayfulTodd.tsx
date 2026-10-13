"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue } from "framer-motion";

const SIZE = 96;
const IDLE_MIN = 14000;
const IDLE_MAX = 28000;
const SPEECH_CHANCE = 0.22;

const QUIPS = [
  "boop!",
  "hey!!",
  "ribbit",
  "i live here",
  "psst",
  "nice code",
  "hi hi",
  "zzz…",
  "👀",
] as const;

const CLICK_QUIPS = [
  "boop!",
  "hey!!",
  "catch me~",
  "wee!",
  "ouch!",
  "again??",
  "ok ok!",
  "zoom!",
  "friend!",
] as const;

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
    if (r.top >= 56 && r.bottom <= window.innerHeight - 8) {
      return { x: r.left, y: r.top };
    }
  }
  return { x: 28, y: 88 };
}

/** Prefer viewport edges so Todd stays out of reading / click paths. */
function edgePoint(): Pt {
  const padX = 16;
  const padTop = 72;
  const padBottom = 20;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(padX + 8, vw - SIZE - padX);
  const maxY = Math.max(padTop + 8, vh - SIZE - padBottom);
  const side = pick(["top", "bottom", "left", "right"] as const);

  switch (side) {
    case "top":
      return { x: rand(padX, maxX), y: padTop };
    case "bottom":
      return { x: rand(padX, maxX), y: maxY };
    case "left":
      return { x: padX, y: rand(padTop, maxY) };
    case "right":
      return { x: maxX, y: rand(padTop, maxY) };
  }
}

export function PlayfulTodd() {
  const x = useMotionValue(72);
  const y = useMotionValue(200);
  const spin = useMotionValue(0);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [speech, setSpeech] = useState<string | null>(null);
  const [hopping, setHopping] = useState(false);
  const [mood, setMood] = useState<"idle" | "happy" | "dizzy">("idle");
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const busy = useRef(false);
  const reduced = useRef(false);
  const alive = useRef(true);
  const speechTimer = useRef<number | null>(null);
  const waitTimer = useRef<number | null>(null);
  const moodTimer = useRef<number | null>(null);
  const clickStreak = useRef(0);
  const streakReset = useRef<number | null>(null);

  const say = useCallback((text: string, ms = 1600) => {
    setSpeech(text);
    if (speechTimer.current) window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech(null), ms);
  }, []);

  const setMoodBrief = useCallback((next: "happy" | "dizzy", ms = 900) => {
    setMood(next);
    if (moodTimer.current) window.clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms);
  }, []);

  const hopTo = useCallback(
    async (target: Pt, opts?: { speak?: boolean }) => {
      if (busy.current || !alive.current) return;
      busy.current = true;
      setHopping(true);

      const fromX = x.get();
      const fromY = y.get();
      const dx = target.x - fromX;
      if (Math.abs(dx) > 2) setFacing(dx >= 0 ? 1 : -1);

      const dist = Math.hypot(dx, target.y - fromY);
      const duration = clamp(0.36 + dist / 1100, 0.4, 0.95);
      const peak = rand(28, 56);

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
      if (opts?.speak ?? Math.random() < SPEECH_CHANCE) say(pick(QUIPS));
    },
    [say, x, y]
  );

  const bounceInPlace = useCallback(async () => {
    if (busy.current || !alive.current) return;
    busy.current = true;
    setHopping(true);
    const fromY = y.get();
    await animate(
      y,
      [fromY, fromY - 28, fromY],
      {
        duration: 0.45,
        times: [0, 0.4, 1],
        ease: [0.22, 1, 0.36, 1],
      }
    ).finished;
    if (!alive.current) return;
    setHopping(false);
    busy.current = false;
  }, [y]);

  const twirl = useCallback(async () => {
    if (busy.current || !alive.current) return;
    busy.current = true;
    setMoodBrief("dizzy", 1200);
    await animate(spin, [0, 360], {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    }).finished;
    spin.set(0);
    if (!alive.current) return;
    busy.current = false;
  }, [setMoodBrief, spin]);

  const schedule = useCallback(
    (delay: number) => {
      if (waitTimer.current) window.clearTimeout(waitTimer.current);
      if (reduced.current || !alive.current) return;
      waitTimer.current = window.setTimeout(() => {
        void (async () => {
          // Mostly hang at home; occasionally peek from an edge
          const next = Math.random() < 0.65 ? homePoint() : edgePoint();
          await hopTo(next);
          schedule(rand(IDLE_MIN, IDLE_MAX));
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

    // First wander is delayed — let the page settle
    if (!reduced.current) schedule(rand(18000, 26000));

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
      if (moodTimer.current) window.clearTimeout(moodTimer.current);
      if (streakReset.current) window.clearTimeout(streakReset.current);
    };
  }, [schedule, x, y]);

  const onHoverStart = () => {
    if (hopping || busy.current) return;
    setMoodBrief("happy", 700);
    if (Math.random() < 0.55) say(pick(["hi!", "oh?", "👀", "hey"]));
  };

  const onClick = () => {
    if (streakReset.current) window.clearTimeout(streakReset.current);
    clickStreak.current += 1;
    streakReset.current = window.setTimeout(() => {
      clickStreak.current = 0;
    }, 2200);

    const streak = clickStreak.current;
    say(pick(CLICK_QUIPS));
    setMoodBrief(streak >= 4 ? "dizzy" : "happy", 900);

    if (reduced.current || busy.current) return;
    if (waitTimer.current) window.clearTimeout(waitTimer.current);

    void (async () => {
      if (streak >= 5) {
        await twirl();
        await hopTo(homePoint(), { speak: false });
        say("ok i live here");
      } else if (streak === 3) {
        await twirl();
      } else if (streak % 2 === 0) {
        await hopTo(edgePoint(), { speak: false });
      } else {
        await bounceInPlace();
      }
      // Longer chill after play so he doesn't keep interrupting
      schedule(rand(IDLE_MIN + 4000, IDLE_MAX + 8000));
    })();
  };

  if (!ready || !mounted) return null;

  return createPortal(
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[60]"
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
        onMouseEnter={onHoverStart}
        className="pointer-events-auto relative cursor-pointer appearance-none border-0 bg-transparent p-0"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg
          className={`pointer-events-none absolute -right-0.5 top-0 text-white transition-opacity duration-300 ${
            hopping || mood !== "idle" ? "opacity-100" : "opacity-50"
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
          style={{ scaleX: facing, rotate: spin }}
          animate={
            hopping
              ? { y: 0, scale: [1, 1.04, 0.96, 1] }
              : mood === "happy"
                ? { y: [0, -6, 0], scale: [1, 1.06, 1] }
                : { y: [0, -3, 0], scale: 1 }
          }
          transition={
            hopping
              ? { duration: 0.42, ease: "easeOut" }
              : mood === "happy"
                ? { duration: 0.45, ease: "easeOut" }
                : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </button>
    </motion.div>,
    document.body
  );
}
