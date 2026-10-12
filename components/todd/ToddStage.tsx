"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ToddRig } from "@/components/todd/ToddRig";
import { useTodd } from "@/lib/todd/todd-store";

type Props = {
  layout: "desktop" | "mobile";
  viewport: { width: number; height: number };
};

const SIZE = 88;
const STATUS = 40;
const DOCK = 96;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function readLandmarks(vw: number, vh: number) {
  const points: { x: number; y: number; id: string }[] = [
    { id: "desktop-corner", x: vw - SIZE - 24, y: vh - DOCK - SIZE - 16 },
    { id: "status", x: vw * 0.5 - SIZE / 2, y: STATUS + 12 },
    { id: "dock", x: 24, y: vh - DOCK - SIZE - 8 },
    { id: "hide-spot", x: 16, y: STATUS + 48 },
  ];

  document.querySelectorAll<HTMLElement>("[data-todd-landmark]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    points.push({
      id: el.dataset.toddLandmark || "mark",
      x: clamp(r.left + r.width * 0.5 - SIZE / 2, 8, vw - SIZE - 8),
      y: clamp(r.top - SIZE + 8, STATUS, vh - DOCK - SIZE),
    });
  });

  return points;
}

export function ToddStage({ layout, viewport }: Props) {
  const todd = useTodd();
  const {
    state,
    paused,
    chaos,
    trySetState,
    setState,
    bumpClick,
    resetClicks,
    requestCome,
    requestDance,
    requestSleep,
  } = todd;

  const [facing, setFacing] = useState<1 | -1>(1);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hiddenTab, setHiddenTab] = useState(false);
  const [announcement, setAnnouncement] = useState("Todd, the portfolio mascot");

  const x = useMotionValue(viewport.width - SIZE - 32);
  const y = useMotionValue(viewport.height - DOCK - SIZE - 24);
  const sx = useSpring(x, { stiffness: 90, damping: 18 });
  const sy = useSpring(y, { stiffness: 90, damping: 18 });

  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(
    null
  );
  const timers = useRef<number[]>([]);
  const lastChaos = useRef(0);
  const clickResetTimer = useRef<number | null>(null);
  const posRef = useRef({ x: viewport.width - SIZE - 32, y: viewport.height - DOCK - SIZE - 24 });

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const bounds = useCallback(() => {
    const maxX = Math.max(8, viewport.width - SIZE - 8);
    const maxY = Math.max(STATUS, viewport.height - DOCK - SIZE);
    return { minX: 8, maxX, minY: STATUS + 4, maxY };
  }, [viewport.width, viewport.height]);

  const moveTo = useCallback(
    (nx: number, ny: number, mode: "walk" | "hop" | "commanded" = "walk") => {
      if (paused || reducedMotion || hiddenTab) return;
      const b = bounds();
      const tx = clamp(nx, b.minX, b.maxX);
      const ty = clamp(ny, b.minY, b.maxY);
      const cur = posRef.current;
      setFacing(tx >= cur.x ? 1 : -1);
      trySetState(mode);
      x.set(tx);
      y.set(ty);
      posRef.current = { x: tx, y: ty };
      const t = window.setTimeout(() => {
        if (state !== "dance" && state !== "sleep" && state !== "dragged") {
          trySetState("idle", true);
        }
      }, 700);
      timers.current.push(t);
    },
    [paused, reducedMotion, hiddenTab, bounds, trySetState, x, y, state]
  );

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

  // Keep in bounds on resize
  useEffect(() => {
    const b = bounds();
    const nx = clamp(posRef.current.x, b.minX, b.maxX);
    const ny = clamp(posRef.current.y, b.minY, b.maxY);
    posRef.current = { x: nx, y: ny };
    x.set(nx);
    y.set(ny);
  }, [bounds, x, y]);

  // Pointer tracking for pupils
  useEffect(() => {
    if (reducedMotion || paused || hiddenTab) return;
    const onMove = (e: MouseEvent) => {
      const cx = posRef.current.x + SIZE / 2;
      const cy = posRef.current.y + SIZE * 0.28;
      setPupil({
        x: (e.clientX - cx) / 28,
        y: (e.clientY - cy) / 28,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, paused, hiddenTab]);

  // Autonomous / chaos exploration
  useEffect(() => {
    if (paused || reducedMotion || hiddenTab || layout === "mobile") return;
    if (state === "dragged" || state === "dance" || state === "sleep") return;

    const id = window.setInterval(() => {
      if (paused) return;
      const now = Date.now();
      if (!chaos && now - lastChaos.current < 12000) return;
      if (chaos && now - lastChaos.current < 6000) return;
      if (Math.random() > (chaos ? 0.55 : 0.22)) return;

      lastChaos.current = now;
      const marks = readLandmarks(viewport.width, viewport.height);
      const pick = marks[Math.floor(Math.random() * marks.length)];
      if (!pick) return;

      if (chaos && Math.random() < 0.25) {
        trySetState("hide");
        setAnnouncement("Todd is hiding");
        moveTo(pick.x, pick.y, "hop");
        const t = window.setTimeout(() => trySetState("idle", true), 2500);
        timers.current.push(t);
      } else if (Math.random() < 0.2) {
        trySetState("sleep");
        setAnnouncement("Todd is sleeping");
      } else {
        moveTo(pick.x, pick.y, Math.random() < 0.5 ? "hop" : "walk");
        setAnnouncement("Todd is exploring");
      }
    }, 4000);

    return () => {
      clearInterval(id);
      clearTimers();
    };
  }, [
    paused,
    reducedMotion,
    hiddenTab,
    layout,
    chaos,
    state,
    viewport.width,
    viewport.height,
    moveTo,
    trySetState,
  ]);

  // Terminal command hooks
  useEffect(() => {
    if (!requestCome) return;
    moveTo(viewport.width * 0.45, viewport.height * 0.4, "commanded");
    setAnnouncement("Todd is coming");
  }, [requestCome, moveTo, viewport.width, viewport.height]);

  useEffect(() => {
    if (!requestDance) return;
    setState("dance");
    setAnnouncement("Todd is dancing");
    const t = window.setTimeout(() => trySetState("idle", true), 4000);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [requestDance, setState, trySetState]);

  useEffect(() => {
    if (!requestSleep) return;
    setState("sleep");
    setAnnouncement("Todd is sleeping");
  }, [requestSleep, setState]);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setState("dragged");
    setAnnouncement("Todd is being dragged");
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
    if (dragRef.current) {
      dragRef.current = null;
      setState("fall");
      const t = window.setTimeout(() => trySetState("idle", true), 350);
      timers.current.push(t);
      setAnnouncement("Todd landed");
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      return;
    }
  };

  const onClick = () => {
    if (dragRef.current) return;
    const n = bumpClick();
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    clickResetTimer.current = window.setTimeout(() => resetClicks(), 2200);

    setState("startled");
    setAnnouncement("Todd is startled");

    const b = bounds();
    const scrambleX =
      posRef.current.x + (Math.random() > 0.5 ? 1 : -1) * (80 + n * 20);
    const scrambleY = posRef.current.y - 20 - n * 8;
    moveTo(scrambleX, scrambleY, "hop");

    if (n >= 4) {
      setState("dance");
      setAnnouncement("Todd is spinning from all the clicks");
      const t = window.setTimeout(() => {
        trySetState("idle", true);
        resetClicks();
      }, 2200);
      timers.current.push(t);
    } else {
      const t = window.setTimeout(() => trySetState("idle", true), 600);
      timers.current.push(t);
    }
    void b;
  };

  if (hiddenTab) return null;

  const mobileSize = layout === "mobile" ? 64 : SIZE;

  return (
    <div className="pointer-events-none absolute inset-0 z-[60] overflow-hidden">
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
      <motion.button
        type="button"
        aria-label="Todd the frog mascot. Click to startle, drag to move."
        className="pointer-events-auto absolute touch-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--os-lime)]"
        style={{
          x: sx,
          y: sy,
          width: mobileSize,
          height: mobileSize,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onClick}
      >
        <ToddRig
          state={paused ? "idle" : state}
          facing={facing}
          pupilTarget={pupil}
          reducedMotion={reducedMotion || paused}
          size={mobileSize}
        />
      </motion.button>
    </div>
  );
}
