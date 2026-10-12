"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ToddRig } from "@/components/todd/ToddRig";
import { useTodd } from "@/lib/todd/todd-store";
import { useWindows } from "@/lib/os/window-store";

type Props = {
  layout: "desktop" | "mobile";
  viewport: { width: number; height: number };
};

const SIZE_DESKTOP = 118;
const SIZE_MOBILE = 72;
const STATUS = 44;
const DOCK = 100;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function terminalPerch(vw: number, vh: number) {
  const el = document.querySelector<HTMLElement>('[data-todd-window="terminal"]');
  if (el) {
    const r = el.getBoundingClientRect();
    return {
      x: clamp(r.right - SIZE_DESKTOP * 0.62, 8, vw - SIZE_DESKTOP - 8),
      y: clamp(r.top - SIZE_DESKTOP * 0.62, STATUS, vh - DOCK - SIZE_DESKTOP),
    };
  }
  return {
    x: vw * 0.5 + 180,
    y: vh * 0.28,
  };
}

const QUIPS = [
  "boop",
  "hey!!",
  "don't poke the frog",
  "ok that tickled",
  "again??",
  "i'm fragile (emotionally)",
  "type todd dance 👀",
];

export function ToddStage({ layout, viewport }: Props) {
  const todd = useTodd();
  const { windows } = useWindows();
  const {
    state,
    paused,
    chaos,
    speech,
    trySetState,
    setState,
    say,
    bumpClick,
    resetClicks,
    requestCome,
    requestDance,
    requestSleep,
  } = todd;

  const size = layout === "mobile" ? SIZE_MOBILE : SIZE_DESKTOP;
  const [facing, setFacing] = useState<1 | -1>(1);
  const [lookTilt, setLookTilt] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hiddenTab, setHiddenTab] = useState(false);
  const [perching, setPerching] = useState(true);

  const x = useMotionValue(viewport.width * 0.62);
  const y = useMotionValue(viewport.height * 0.28);
  const sx = useSpring(x, { stiffness: 110, damping: 18 });
  const sy = useSpring(y, { stiffness: 110, damping: 18 });

  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const timers = useRef<number[]>([]);
  const lastChaos = useRef(0);
  const clickResetTimer = useRef<number | null>(null);
  const posRef = useRef({ x: viewport.width * 0.62, y: viewport.height * 0.28 });
  const draggedAway = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const bounds = useCallback(() => {
    return {
      minX: 8,
      maxX: Math.max(8, viewport.width - size - 8),
      minY: STATUS + 4,
      maxY: Math.max(STATUS, viewport.height - DOCK - size),
    };
  }, [viewport.width, viewport.height, size]);

  const moveTo = useCallback(
    (nx: number, ny: number, mode: "walk" | "hop" | "commanded" = "hop") => {
      if (paused || reducedMotion || hiddenTab) return;
      const b = bounds();
      const tx = clamp(nx, b.minX, b.maxX);
      const ty = clamp(ny, b.minY, b.maxY);
      setFacing(tx >= posRef.current.x ? 1 : -1);
      trySetState(mode);
      x.set(tx);
      y.set(ty);
      posRef.current = { x: tx, y: ty };
      const t = window.setTimeout(() => {
        if (!["dance", "sleep", "dragged"].includes(state)) {
          trySetState("idle", true);
        }
      }, 650);
      timers.current.push(t);
    },
    [paused, reducedMotion, hiddenTab, bounds, trySetState, x, y, state]
  );

  const snapToPerch = useCallback(() => {
    const p = terminalPerch(viewport.width, viewport.height);
    x.set(p.x);
    y.set(p.y);
    posRef.current = p;
    setPerching(true);
    setFacing(-1);
  }, [viewport.width, viewport.height, x, y]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVis = () => setHiddenTab(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Follow terminal window while perching
  useEffect(() => {
    if (!perching || draggedAway.current || paused) return;
    if (!windows.terminal.open || windows.terminal.minimized) return;

    const follow = () => {
      const p = terminalPerch(viewport.width, viewport.height);
      x.set(p.x);
      y.set(p.y);
      posRef.current = p;
    };
    follow();
    const id = window.setInterval(follow, 120);
    return () => clearInterval(id);
  }, [
    perching,
    paused,
    windows.terminal.open,
    windows.terminal.minimized,
    windows.terminal.x,
    windows.terminal.y,
    windows.terminal.width,
    windows.terminal.maximized,
    viewport.width,
    viewport.height,
    x,
    y,
  ]);

  useEffect(() => {
    if (!draggedAway.current) snapToPerch();
  }, [snapToPerch]);

  useEffect(() => {
    if (reducedMotion || paused || hiddenTab) return;
    const onMove = (e: MouseEvent) => {
      const cx = posRef.current.x + size / 2;
      const cy = posRef.current.y + size * 0.35;
      setLookTilt({
        x: clamp((e.clientX - cx) / 80, -1, 1),
        y: clamp((e.clientY - cy) / 80, -1, 1),
      });
      setFacing(e.clientX >= cx ? 1 : -1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, paused, hiddenTab, size]);

  // Playful autonomous antics
  useEffect(() => {
    if (paused || reducedMotion || hiddenTab) return;
    if (["dragged", "dance", "sleep"].includes(state)) return;

    const id = window.setInterval(() => {
      const now = Date.now();
      const gap = chaos ? 5000 : 9000;
      if (now - lastChaos.current < gap) return;
      if (Math.random() > (chaos ? 0.5 : 0.28)) return;
      lastChaos.current = now;

      const roll = Math.random();
      if (roll < 0.35 && windows.terminal.open) {
        draggedAway.current = false;
        snapToPerch();
        trySetState("idle", true);
        say("back on my perch");
      } else if (roll < 0.55) {
        draggedAway.current = true;
        setPerching(false);
        moveTo(
          Math.random() * (viewport.width - size),
          STATUS + 40 + Math.random() * 120,
          "hop"
        );
        say("zoomies");
      } else if (roll < 0.7) {
        trySetState("sleep");
        say("power nap…");
      } else {
        say(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
      }
    }, 3500);

    return () => {
      clearInterval(id);
      clearTimers();
    };
  }, [
    paused,
    reducedMotion,
    hiddenTab,
    chaos,
    state,
    windows.terminal.open,
    viewport.width,
    size,
    moveTo,
    snapToPerch,
    trySetState,
    say,
  ]);

  useEffect(() => {
    if (!requestCome) return;
    draggedAway.current = true;
    setPerching(false);
    moveTo(viewport.width * 0.45, viewport.height * 0.42, "commanded");
  }, [requestCome, moveTo, viewport.width, viewport.height]);

  useEffect(() => {
    if (!requestDance) return;
    setState("dance");
    const t = window.setTimeout(() => {
      trySetState("idle", true);
      if (!draggedAway.current) snapToPerch();
    }, 3800);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [requestDance, setState, trySetState, snapToPerch]);

  useEffect(() => {
    if (!requestSleep) return;
    setState("sleep");
  }, [requestSleep, setState]);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setState("dragged");
    setPerching(false);
    draggedAway.current = true;
    say("weee!!");
    dragRef.current = {
      px: e.clientX,
      py: e.clientY,
      ox: posRef.current.x,
      oy: posRef.current.y,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const b = bounds();
    const nx = clamp(
      dragRef.current.ox + (e.clientX - dragRef.current.px),
      b.minX,
      b.maxX
    );
    const ny = clamp(
      dragRef.current.oy + (e.clientY - dragRef.current.py),
      b.minY,
      b.maxY
    );
    x.set(nx);
    y.set(ny);
    posRef.current = { x: nx, y: ny };
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setState("fall");
    say("oof—");
    const t = window.setTimeout(() => trySetState("idle", true), 320);
    timers.current.push(t);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onClick = () => {
    if (dragRef.current) return;
    const n = bumpClick();
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    clickResetTimer.current = window.setTimeout(() => resetClicks(), 2400);

    setState("startled");
    say(QUIPS[Math.min(n - 1, QUIPS.length - 1)]);
    setPerching(false);
    draggedAway.current = true;

    moveTo(
      posRef.current.x + (Math.random() > 0.5 ? 1 : -1) * (70 + n * 18),
      posRef.current.y - 24 - n * 6,
      "hop"
    );

    if (n >= 4) {
      setState("dance");
      say("OK FINE I'LL DANCE");
      const t = window.setTimeout(() => {
        trySetState("idle", true);
        resetClicks();
      }, 2400);
      timers.current.push(t);
    } else {
      const t = window.setTimeout(() => trySetState("idle", true), 550);
      timers.current.push(t);
    }
  };

  if (hiddenTab) return null;

  const bubbleSide = posRef.current.x > viewport.width * 0.55 ? "left" : "right";

  return (
    <div className="pointer-events-none absolute inset-0 z-[70] overflow-hidden">
      <motion.div
        className="pointer-events-auto absolute"
        style={{ x: sx, y: sy, width: size, height: size }}
      >
        <AnimatePresence>
          {speech && (
            <motion.div
              key={speech}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              className={`absolute z-10 max-w-[190px] rounded-xl border border-white/20 bg-black/80 px-3 py-2.5 font-mono text-[11px] leading-snug text-zinc-100 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md ${
                bubbleSide === "left" ? "right-[78%] top-2" : "left-[78%] top-2"
              }`}
              style={{ translateY: "-100%" }}
            >
              {speech.split("**").map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="text-[var(--os-lime)]">
                    {part}
                  </strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
              <span
                className={`absolute top-full h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-black/70 ${
                  bubbleSide === "left" ? "right-4" : "left-4"
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label="Todd the frog. Click to play, drag to move, or try todd dance in the terminal."
          className="touch-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--os-lime)]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={onClick}
        >
          <ToddRig
            state={paused ? "idle" : state}
            facing={facing}
            lookTilt={lookTilt}
            reducedMotion={reducedMotion || paused}
            size={size}
          />
        </button>
      </motion.div>
    </div>
  );
}
