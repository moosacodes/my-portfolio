"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToddRig } from "@/components/todd/ToddRig";
import { useTodd } from "@/lib/todd/todd-store";
import { useWindows } from "@/lib/os/window-store";
import {
  clamp,
  integrate,
  jumpImpulse,
  readLandmarks,
  runToward,
  type PhysicsBody,
} from "@/lib/todd/physics";

type Props = {
  layout: "desktop" | "mobile";
  viewport: { width: number; height: number };
};

const SIZE_DESKTOP = 152;
const SIZE_MOBILE = 88;
const STATUS = 48;
const DOCK = 108;

const QUIPS = [
  "boop.",
  "hey!!",
  "don't poke the frog",
  "ok that tickled",
  "again??",
  "type todd dance",
  "i saw that cursor",
];

export function ToddStage({ layout, viewport }: Props) {
  const todd = useTodd();
  const { windows, focused } = useWindows();
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
  const [facing, setFacing] = useState<1 | -1>(-1);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [gaitPhase, setGaitPhase] = useState(0);
  const [dancePhase, setDancePhase] = useState(0);
  const [squashY, setSquashY] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hiddenTab, setHiddenTab] = useState(false);
  const [renderPos, setRenderPos] = useState({
    x: viewport.width * 0.58,
    y: viewport.height * 0.22,
  });

  const bodyRef = useRef<PhysicsBody>({
    pos: { x: viewport.width * 0.58, y: viewport.height * 0.22 },
    vel: { x: 0, y: 0 },
    grounded: false,
  });
  const modeRef = useRef<
    "perch" | "wander" | "chase" | "flee" | "sleep" | "dance" | "drag"
  >("perch");
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{
    px: number;
    py: number;
    ox: number;
    oy: number;
  } | null>(null);
  const clickReset = useRef<number | null>(null);
  const lastDecision = useRef(0);
  const gaitDist = useRef(0);
  const danceT = useRef(0);
  const prevFocused = useRef(focused);
  const landHold = useRef(0);

  const bounds = useCallback(() => {
    const floorY = viewport.height - DOCK - size * 0.15;
    return {
      minX: 8,
      maxX: Math.max(8, viewport.width - size - 8),
      minY: STATUS + 4,
      maxY: floorY,
      floorY,
    };
  }, [viewport.width, viewport.height, size]);

  const perchOnTerminal = useCallback(() => {
    const marks = readLandmarks(viewport.width, viewport.height, size);
    const perch =
      marks.find((m) => m.id === "perch-terminal") ||
      marks.find((m) => m.kind === "perch");
    if (!perch) return null;
    return { x: perch.x, y: perch.y };
  }, [viewport.width, viewport.height, size]);

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

  // Boot onto terminal perch
  useEffect(() => {
    const p = perchOnTerminal();
    if (!p) return;
    bodyRef.current = {
      pos: p,
      vel: { x: 0, y: 0 },
      grounded: true,
    };
    setRenderPos(p);
    modeRef.current = "perch";
    setFacing(-1);
  }, [perchOnTerminal]);

  // React to newly focused windows
  useEffect(() => {
    if (prevFocused.current !== focused && focused && focused !== "terminal") {
      if (!paused && !reducedMotion && modeRef.current !== "drag") {
        const marks = readLandmarks(viewport.width, viewport.height, size);
        const perch = marks.find((m) => m.id === `perch-${focused}`);
        if (perch && Math.random() < 0.7) {
          modeRef.current = "chase";
          targetRef.current = { x: perch.x, y: perch.y };
          trySetState("walk");
          say("oooh new window");
        }
      }
    }
    prevFocused.current = focused;
  }, [focused, paused, reducedMotion, viewport, size, trySetState, say]);

  // Cursor look
  useEffect(() => {
    if (reducedMotion || paused || hiddenTab) return;
    const onMove = (e: MouseEvent) => {
      const b = bodyRef.current.pos;
      const cx = b.x + size / 2;
      const cy = b.y + size * 0.3;
      setLook({
        x: clamp((e.clientX - cx) / 90, -1, 1),
        y: clamp((e.clientY - cy) / 90, -1, 1),
      });
      if (modeRef.current === "perch" || modeRef.current === "sleep") {
        setFacing(e.clientX >= cx ? 1 : -1);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, paused, hiddenTab, size]);

  // Main simulation loop
  useEffect(() => {
    if (hiddenTab) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const b = bounds();

      if (paused || reducedMotion) {
        setRenderPos({ ...bodyRef.current.pos });
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "drag") {
        setSquashY(1.08);
        setRenderPos({ ...bodyRef.current.pos });
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "dance") {
        danceT.current += dt;
        setDancePhase((danceT.current % 0.7) / 0.7);
        const bob = Math.sin(danceT.current * 14) * 10;
        setSquashY(0.9 + Math.sin(danceT.current * 12) * 0.12);
        setRenderPos({
          x: bodyRef.current.pos.x,
          y: bodyRef.current.pos.y + bob,
        });
        trySetState("dance");
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "sleep") {
        setSquashY(1.05);
        setGaitPhase(0);
        trySetState("sleep");
        // soft settle onto perch/floor
        bodyRef.current = integrate(
          { ...bodyRef.current, vel: { x: 0, y: bodyRef.current.vel.y } },
          dt,
          b
        );
        setRenderPos({ ...bodyRef.current.pos });
        raf = requestAnimationFrame(tick);
        return;
      }

      // Autonomous decisions
      const gap = chaos ? 4200 : 8000;
      if (now - lastDecision.current > gap && modeRef.current !== "flee") {
        lastDecision.current = now;
        if (Math.random() < (chaos ? 0.55 : 0.32)) {
          const marks = readLandmarks(viewport.width, viewport.height, size);
          const roll = Math.random();
          if (roll < 0.35 && windows.terminal.open) {
            const p = perchOnTerminal();
            if (p) {
              modeRef.current = "chase";
              targetRef.current = p;
              trySetState("walk");
              say("back to my perch");
            }
          } else if (roll < 0.55) {
            const floor = marks.filter((m) => m.kind === "floor" || m.kind === "dock");
            const pick = floor[Math.floor(Math.random() * floor.length)];
            if (pick) {
              modeRef.current = "chase";
              targetRef.current = { x: pick.x, y: pick.y };
              trySetState("walk");
            }
          } else if (roll < 0.7) {
            const hide = marks.filter((m) => m.kind === "hide");
            const pick = hide[Math.floor(Math.random() * hide.length)];
            if (pick) {
              modeRef.current = "chase";
              targetRef.current = { x: pick.x, y: pick.y };
              trySetState("hide");
              say("you'll never find me");
            }
          } else if (roll < 0.85) {
            modeRef.current = "sleep";
            say("power nap…");
            trySetState("sleep");
          } else {
            say(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
          }
        }
      }

      let body = bodyRef.current;

      if (targetRef.current && (modeRef.current === "chase" || modeRef.current === "flee" || modeRef.current === "wander")) {
        const target = targetRef.current;
        const speed = modeRef.current === "flee" ? 420 : chaos ? 280 : 200;
        const dx = target.x - body.pos.x;
        const dy = target.y - body.pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 18) {
          body = {
            pos: { ...target },
            vel: { x: 0, y: 0 },
            grounded: true,
          };
          if (modeRef.current === "flee") {
            modeRef.current = "perch";
            trySetState("idle", true);
          } else if (target.y < b.floorY - 40) {
            modeRef.current = "perch";
            trySetState("idle", true);
          } else {
            modeRef.current = "wander";
            trySetState("idle", true);
          }
          targetRef.current = null;
          landHold.current = 0.2;
          setSquashY(1.12);
        } else {
          // hop when needing vertical change or for gait flavor
          const needHop =
            Math.abs(dy) > 30 ||
            (body.grounded && Math.random() < dt * 1.8);
          body = runToward(body, target, speed, dt);
          if (needHop && body.grounded) {
            body = jumpImpulse(body, 520 + Math.min(200, Math.abs(dy)));
            trySetState("hop");
            setSquashY(0.82);
            landHold.current = 0;
          } else if (!body.grounded) {
            trySetState("hop");
          } else {
            trySetState("walk");
          }
          setFacing(body.vel.x >= 0 ? 1 : -1);
          gaitDist.current += Math.abs(body.vel.x) * dt;
          setGaitPhase((gaitDist.current % 48) / 48);
        }
      } else if (modeRef.current === "perch") {
        const p = perchOnTerminal();
        if (p && windows.terminal.open && !windows.terminal.minimized) {
          // spring toward moving perch (window drag)
          body = {
            pos: {
              x: body.pos.x + (p.x - body.pos.x) * Math.min(1, dt * 10),
              y: body.pos.y + (p.y - body.pos.y) * Math.min(1, dt * 10),
            },
            vel: { x: 0, y: 0 },
            grounded: true,
          };
        }
        trySetState("idle");
        if (landHold.current > 0) {
          landHold.current -= dt;
          setSquashY(1.1);
        } else {
          setSquashY(1);
        }
      }

      if (modeRef.current !== "perch") {
        body = integrate(body, dt, b);
        if (body.grounded && landHold.current <= 0) {
          const speed = Math.abs(body.vel.x);
          if (speed > 40) setSquashY(0.92 + Math.sin(gaitDist.current) * 0.04);
          else setSquashY(1);
        } else if (!body.grounded) {
          setSquashY(0.88);
        }
        if (body.grounded && body.vel.y === 0 && landHold.current <= 0 && Math.abs(body.vel.y) < 1) {
          // landing recovery squash flash
        }
      }

      bodyRef.current = body;
      setRenderPos({ ...body.pos });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    hiddenTab,
    paused,
    reducedMotion,
    bounds,
    chaos,
    viewport.width,
    viewport.height,
    size,
    windows.terminal.open,
    windows.terminal.minimized,
    windows.terminal.x,
    windows.terminal.y,
    perchOnTerminal,
    trySetState,
    say,
  ]);

  // Terminal command hooks
  useEffect(() => {
    if (!requestCome) return;
    modeRef.current = "chase";
    const p = perchOnTerminal() || {
      x: viewport.width * 0.45,
      y: viewport.height * 0.4,
    };
    targetRef.current = p;
    trySetState("commanded");
  }, [requestCome, perchOnTerminal, viewport, trySetState]);

  useEffect(() => {
    if (!requestDance) return;
    modeRef.current = "dance";
    danceT.current = 0;
    setState("dance");
    const t = window.setTimeout(() => {
      modeRef.current = "perch";
      trySetState("idle", true);
      const p = perchOnTerminal();
      if (p) bodyRef.current.pos = p;
    }, 4200);
    return () => clearTimeout(t);
  }, [requestDance, setState, trySetState, perchOnTerminal]);

  useEffect(() => {
    if (!requestSleep) return;
    modeRef.current = "sleep";
    setState("sleep");
  }, [requestSleep, setState]);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    modeRef.current = "drag";
    setState("dragged");
    say("weee!!");
    dragRef.current = {
      px: e.clientX,
      py: e.clientY,
      ox: bodyRef.current.pos.x,
      oy: bodyRef.current.pos.y,
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
    bodyRef.current = {
      pos: { x: nx, y: ny },
      vel: { x: e.movementX * 40, y: e.movementY * 40 },
      grounded: false,
    };
    setRenderPos({ x: nx, y: ny });
    setSquashY(1.1);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    modeRef.current = "wander";
    setState("fall");
    say("oof—");
    bodyRef.current = {
      ...bodyRef.current,
      grounded: false,
      vel: {
        x: bodyRef.current.vel.x,
        y: Math.max(200, bodyRef.current.vel.y),
      },
    };
    landHold.current = 0.35;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    window.setTimeout(() => trySetState("idle", true), 400);
  };

  const onClick = () => {
    if (dragRef.current) return;
    const n = bumpClick();
    if (clickReset.current) clearTimeout(clickReset.current);
    clickReset.current = window.setTimeout(() => resetClicks(), 2400);

    setState("startled");
    say(QUIPS[Math.min(n - 1, QUIPS.length - 1)]);
    setSquashY(0.78);

    // anticipation then flee
    bodyRef.current = jumpImpulse(bodyRef.current, 680);
    modeRef.current = "flee";
    const marks = readLandmarks(viewport.width, viewport.height, size);
    const options = marks.filter((m) => m.kind === "floor" || m.kind === "hide");
    const pick = options[Math.floor(Math.random() * options.length)];
    targetRef.current = pick
      ? { x: pick.x, y: pick.y }
      : {
          x: clamp(
            bodyRef.current.pos.x + (Math.random() > 0.5 ? 220 : -220),
            8,
            viewport.width - size - 8
          ),
          y: bounds().floorY,
        };

    if (n >= 4) {
      modeRef.current = "dance";
      say("OK FINE I'LL DANCE");
      window.setTimeout(() => {
        modeRef.current = "perch";
        trySetState("idle", true);
        resetClicks();
      }, 2800);
    }
  };

  if (hiddenTab) return null;

  const bubbleLeft = renderPos.x > viewport.width * 0.55;

  return (
    <div className="pointer-events-none absolute inset-0 z-[70] overflow-hidden">
      <div
        className="pointer-events-auto absolute will-change-transform"
        style={{
          transform: `translate3d(${renderPos.x}px, ${renderPos.y}px, 0)`,
          width: size,
          height: size,
        }}
      >
        <AnimatePresence>
          {speech && (
            <motion.div
              key={speech}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              className={`absolute z-10 max-w-[200px] rounded-xl border border-white/20 bg-black/85 px-3.5 py-2.5 font-mono text-xs leading-snug text-zinc-100 shadow-2xl backdrop-blur-md ${
                bubbleLeft ? "right-[75%] top-1" : "left-[75%] top-1"
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
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label="Todd the frog. Click to startle, drag to move, or try todd dance in the terminal."
          className="touch-none cursor-grab border-0 bg-transparent p-0 outline-none ring-0 active:cursor-grabbing focus:outline-none focus-visible:outline-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={onClick}
        >
          <ToddRig
            state={paused ? "idle" : state}
            facing={facing}
            look={look}
            gaitPhase={gaitPhase}
            dancePhase={dancePhase}
            squashY={squashY}
            reducedMotion={reducedMotion || paused}
            size={size}
          />
        </button>
      </div>
    </div>
  );
}
