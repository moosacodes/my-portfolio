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
import { ALL_APPS, type AppId } from "@/lib/portfolio/data";
import {
  clamp,
  dist,
  integrate,
  jumpImpulse,
  jumpPowerForHeight,
  pickLandmark,
  readLandmarks,
  readPlatforms,
  steerX,
  type Landmark,
  type PhysicsBody,
} from "@/lib/todd/physics";

type Props = {
  layout: "desktop" | "mobile";
  viewport: { width: number; height: number };
};

type Mode =
  | "idle"
  | "travel"
  | "startled"
  | "flee"
  | "hide"
  | "sleep"
  | "dance"
  | "drag"
  | "fall";

const SIZE_DESKTOP = 168;
const SIZE_MOBILE = 96;
const STATUS = 44;
const DOCK = 108;

const QUIPS = [
  "boop.",
  "hey!!",
  "don't poke the frog",
  "ok that tickled",
  "again??",
  "type todd dance",
  "i saw that cursor",
  "nice try",
  "catch me!!",
];

const SURPRISES = [
  "psst",
  "did you see that?",
  "i live here now",
  "moosa said i could",
  "beep boop",
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
  const [hidePeek, setHidePeek] = useState(0);
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
  const modeRef = useRef<Mode>("idle");
  const targetRef = useRef<Landmark | null>(null);
  const lastLandmarkId = useRef<string | null>(null);
  const lastDecision = useRef(0);
  const nextDecisionAt = useRef(0);
  const startledUntil = useRef(0);
  const modeUntil = useRef(0);
  const idleSince = useRef(0);
  const gaitDist = useRef(0);
  const danceT = useRef(0);
  const landHold = useRef(0);
  const hopCooldown = useRef(0);
  const travelPhase = useRef<"run" | "jump" | "leap">("run");
  const leapRef = useRef<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    t: number;
    dur: number;
  } | null>(null);
  const dragRef = useRef<{
    px: number;
    py: number;
    ox: number;
    oy: number;
    samples: { t: number; x: number; y: number }[];
  } | null>(null);
  const clickReset = useRef<number | null>(null);
  const prevFocused = useRef(focused);
  const pointerDownAt = useRef(0);
  const dragged = useRef(false);
  const cursorRef = useRef({ x: 0, y: 0 });
  const bootedRef = useRef(false);

  const bounds = useCallback(() => {
    // floorY = Todd top-left when standing; keep full sprite above the dock
    const floorY = Math.max(STATUS + 8, viewport.height - DOCK - size + 6);
    return {
      minX: 8,
      maxX: Math.max(8, viewport.width - size - 8),
      minY: STATUS + 4,
      maxY: floorY,
      floorY,
    };
  }, [viewport.width, viewport.height, size]);

  const terminalPerch = useCallback((): Landmark | null => {
    const marks = readLandmarks(viewport.width, viewport.height, size);
    return (
      marks.find((m) => m.id === "perch-terminal") ||
      marks.find((m) => m.kind === "perch") ||
      null
    );
  }, [viewport.width, viewport.height, size]);

  const beginTravel = useCallback(
    (mark: Landmark, mode: Mode = "travel", quip?: string) => {
      if (modeRef.current === "drag") return;
      targetRef.current = mark;
      lastLandmarkId.current = mark.id;
      modeRef.current = mode;
      travelPhase.current = "run";
      hopCooldown.current = 0;
      leapRef.current = null;
      modeUntil.current = 0;
      if (quip) say(quip);
      trySetState(
        mode === "flee"
          ? "startled"
          : mark.kind === "hide"
            ? "hide"
            : "walk",
        true
      );
    },
    [say, trySetState]
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

  // Boot on terminal perch
  useEffect(() => {
    const p = terminalPerch();
    if (!p) return;
    bodyRef.current = {
      pos: { x: p.x, y: p.y },
      vel: { x: 0, y: 0 },
      grounded: true,
      platformId: p.platformId ?? "window-terminal",
    };
    setRenderPos({ x: p.x, y: p.y });
    modeRef.current = "idle";
    setFacing(-1);
    idleSince.current = performance.now();
    // Hold the hero perch hard — roaming waits for chaos or a long idle
    lastLandmarkId.current = p.id;
    nextDecisionAt.current = performance.now() + 45000;
    bootedRef.current = true;
  }, [terminalPerch]);

  const prevOpenRef = useRef<Partial<Record<AppId, boolean>>>({});

  // Window open / close / focus — same Todd instance reacts to desktop chrome
  useEffect(() => {
    if (paused || reducedMotion) return;

    for (const id of ALL_APPS) {
      const w = windows[id];
      const isOpen = Boolean(w?.open && !w?.minimized);
      const wasOpen = Boolean(prevOpenRef.current[id]);

      // Closed or minimized under him → fall off
      if (wasOpen && !isOpen) {
        if (bodyRef.current.platformId === `window-${id}`) {
          leapRef.current = null;
          targetRef.current = null;
          modeRef.current = "fall";
          bodyRef.current = {
            ...bodyRef.current,
            grounded: false,
            platformId: null,
            vel: {
              x: bodyRef.current.vel.x * 0.4,
              y: Math.max(120, bodyRef.current.vel.y),
            },
          };
          setState("fall");
          say("hey— my perch!!");
          nextDecisionAt.current = performance.now() + 3500;
        }
      }

      // Freshly opened (non-terminal) → investigate
      if (!wasOpen && isOpen && id !== "terminal") {
        if (
          modeRef.current !== "drag" &&
          modeRef.current !== "startled" &&
          modeRef.current !== "dance" &&
          Math.random() < (chaos ? 0.92 : 0.8)
        ) {
          const marks = readLandmarks(viewport.width, viewport.height, size);
          const perch = marks.find((m) => m.id === `perch-${id}`);
          if (perch) {
            beginTravel(perch, "travel", "oooh new window");
            nextDecisionAt.current = performance.now() + 10000;
          }
        }
      }

      prevOpenRef.current[id] = isOpen;
    }
  }, [
    windows,
    paused,
    reducedMotion,
    chaos,
    viewport.width,
    viewport.height,
    size,
    beginTravel,
    setState,
    say,
  ]);

  // Focus change (already-open window brought forward)
  useEffect(() => {
    if (prevFocused.current === focused) return;
    const prev = prevFocused.current;
    prevFocused.current = focused;
    if (!focused || focused === "terminal" || focused === prev) return;
    if (paused || reducedMotion) return;
    if (
      modeRef.current === "drag" ||
      modeRef.current === "startled" ||
      modeRef.current === "dance"
    ) {
      return;
    }
    // Skip if open-effect already sent him there this tick
    if (targetRef.current?.id === `perch-${focused}`) return;
    if (Math.random() > (chaos ? 0.7 : 0.45)) return;

    const marks = readLandmarks(viewport.width, viewport.height, size);
    const perch = marks.find((m) => m.id === `perch-${focused}`);
    if (perch) {
      beginTravel(perch, "travel", "what's this?");
      nextDecisionAt.current = performance.now() + 9000;
    }
  }, [
    focused,
    paused,
    reducedMotion,
    chaos,
    viewport.width,
    viewport.height,
    size,
    beginTravel,
  ]);

  // Cursor tracking (eyes + idle facing)
  useEffect(() => {
    if (reducedMotion || paused || hiddenTab) return;
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      const b = bodyRef.current.pos;
      const cx = b.x + size / 2;
      const cy = b.y + size * 0.28;
      setLook({
        x: clamp((e.clientX - cx) / 100, -1, 1),
        y: clamp((e.clientY - cy) / 100, -1, 1),
      });
      if (
        modeRef.current === "idle" ||
        modeRef.current === "sleep" ||
        modeRef.current === "hide"
      ) {
        setFacing(e.clientX >= cx ? 1 : -1);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, paused, hiddenTab, size]);

  const decide = useCallback(
    (now: number) => {
      if (now < nextDecisionAt.current) return;
      // Don't interrupt commanded sleep/dance/travel — only idle or peeking
      if (modeRef.current !== "idle" && modeRef.current !== "hide") {
        return;
      }

      const marks = readLandmarks(viewport.width, viewport.height, size);
      const from = bodyRef.current.pos;
      const roll = Math.random();
      const chaosBoost = chaos ? 0.22 : 0;
      const cool = (base: number) => now + (chaos ? base * 0.55 : base);

      // Hero lock: without chaos, Todd never leaves the terminal perch
      if (!chaos) {
        const home = terminalPerch();
        if (home && dist(from, home) > 24) {
          beginTravel(home, "travel");
        } else if (roll < 0.55) {
          trySetState("look", true);
        } else if (roll < 0.7) {
          say(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]);
        }
        nextDecisionAt.current = cool(14000);
        return;
      }

      // Chaos mode — roam / hide / nap
      if (roll < 0.35) {
        const mark = pickLandmark(marks, {
          prefer: ["hide", "dock", "wander", "floor"],
          avoidId: lastLandmarkId.current,
          from,
          minDist: 100,
        });
        if (mark) {
          beginTravel(
            mark,
            "travel",
            mark.kind === "hide" ? "you'll never find me" : undefined
          );
          nextDecisionAt.current = cool(9000);
          return;
        }
      }

      if (roll < 0.55) {
        modeRef.current = "sleep";
        modeUntil.current = now + 4000 + Math.random() * 5000;
        trySetState("sleep", true);
        say("power nap…");
        nextDecisionAt.current = cool(14000);
        return;
      }

      if (roll < 0.8) {
        const mark = pickLandmark(marks, {
          prefer: ["perch"],
          avoidId: lastLandmarkId.current,
          from,
          minDist: 60,
        });
        if (mark) {
          beginTravel(mark, "travel");
          nextDecisionAt.current = cool(10000);
          return;
        }
      }

      trySetState("look", true);
      nextDecisionAt.current = cool(8000);
    },
    [
      viewport.width,
      viewport.height,
      size,
      chaos,
      beginTravel,
      trySetState,
      say,
      terminalPerch,
    ]
  );

  // Main simulation
  useEffect(() => {
    if (hiddenTab) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const b = bounds();
      const platforms = readPlatforms(viewport.width, viewport.height, size);

      if (paused || reducedMotion) {
        setRenderPos({ ...bodyRef.current.pos });
        setHidePeek(0);
        raf = requestAnimationFrame(tick);
        return;
      }

      // Drag: position set by pointer handlers
      if (modeRef.current === "drag") {
        const wiggle = Math.sin(now / 40) * 3;
        setSquashY(1.12);
        setRenderPos({
          x: bodyRef.current.pos.x + wiggle,
          y: bodyRef.current.pos.y,
        });
        trySetState("dragged", true);
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "startled") {
        setSquashY(0.78);
        trySetState("startled", true);
        if (now >= startledUntil.current) {
          modeRef.current = "flee";
          trySetState("hop", true);
          bodyRef.current = jumpImpulse(bodyRef.current, 740);
          hopCooldown.current = 0.25;
        }
        setRenderPos({ ...bodyRef.current.pos });
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "dance") {
        danceT.current += dt;
        setDancePhase((danceT.current % 0.65) / 0.65);
        const bob = Math.sin(danceT.current * 14) * 9;
        setSquashY(0.9 + Math.sin(danceT.current * 12) * 0.1);
        trySetState("dance", true);
        setRenderPos({
          x: bodyRef.current.pos.x,
          y: bodyRef.current.pos.y + bob,
        });
        if (now > modeUntil.current) {
          modeRef.current = "idle";
          trySetState("idle", true);
          idleSince.current = now;
          nextDecisionAt.current = now + 6000;
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "sleep") {
        setSquashY(1.06);
        setGaitPhase(0);
        setHidePeek(0);
        trySetState("sleep", true);
        // Soft stick to current support; slight settle
        let body = {
          ...bodyRef.current,
          vel: { x: bodyRef.current.vel.x * 0.9, y: bodyRef.current.vel.y },
        };
        body = integrate(body, dt, b, platforms, { size });
        bodyRef.current = body;
        setRenderPos({ ...body.pos });
        if (now > modeUntil.current) {
          modeRef.current = "idle";
          trySetState("idle", true);
          say("…huh?");
          idleSince.current = now;
          nextDecisionAt.current = now + 5000;
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      // Autonomous decisions while idle/hiding
      if (
        modeRef.current === "idle" ||
        modeRef.current === "hide"
      ) {
        decide(now);
      }

      let body = bodyRef.current;
      hopCooldown.current = Math.max(0, hopCooldown.current - dt);

      // Hero pin: idle Todd sticks to the terminal perch (chaos can leave)
      if (modeRef.current === "idle") {
        const home =
          (!chaos && terminalPerch()) ||
          (body.platformId?.startsWith("window-")
            ? readLandmarks(viewport.width, viewport.height, size).find(
                (m) => m.id === `perch-${body.platformId!.replace("window-", "")}`
              )
            : null);
        if (home) {
          const follow = Math.min(1, dt * 10);
          body = {
            ...body,
            pos: {
              x: body.pos.x + (home.x - body.pos.x) * follow,
              y: body.pos.y + (home.y - body.pos.y) * follow,
            },
            vel: { x: 0, y: 0 },
            grounded: true,
            platformId: home.platformId ?? body.platformId,
          };
          if (landHold.current > 0) {
            landHold.current -= dt;
            setSquashY(1.12);
          } else {
            setSquashY(1);
          }
          if (Math.random() < dt * 0.12) trySetState("look");
          else trySetState("idle");
          setHidePeek(0);
          bodyRef.current = body;
          setRenderPos({ ...body.pos });
          // Still allow rare look/say decisions while locked
          if (!chaos) decide(now);
          raf = requestAnimationFrame(tick);
          return;
        }
      }

      if (modeRef.current === "hide" && !targetRef.current) {
        // Peek cycle while hiding
        setHidePeek(0.35 + Math.sin(now / 700) * 0.15);
        setSquashY(1.04);
        trySetState("hide");
        bodyRef.current = body;
        setRenderPos({ ...body.pos });
        if (now > modeUntil.current) {
          modeRef.current = "idle";
          setHidePeek(0);
          trySetState("idle", true);
          idleSince.current = now;
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      // Travel / flee toward landmark
      if (
        targetRef.current &&
        (modeRef.current === "travel" || modeRef.current === "flee")
      ) {
        const target = targetRef.current;
        const speed =
          modeRef.current === "flee" ? 460 : chaos ? 300 : 220;
        const d = dist(body.pos, { x: target.x, y: target.y });
        const dx = target.x - body.pos.x;
        const dy = target.y - body.pos.y;

        // Guided leap arc for tall perches (physics alone can't clear ~500px)
        if (leapRef.current) {
          const leap = leapRef.current;
          leap.t = Math.min(1, leap.t + dt / leap.dur);
          const u = leap.t;
          const ease = u * u * (3 - 2 * u);
          const lift = Math.sin(Math.PI * u) * Math.min(140, Math.abs(leap.from.y - leap.to.y) * 0.35);
          body = {
            pos: {
              x: leap.from.x + (leap.to.x - leap.from.x) * ease,
              y: leap.from.y + (leap.to.y - leap.from.y) * ease - lift,
            },
            vel: { x: 0, y: 0 },
            grounded: false,
            platformId: null,
          };
          trySetState("hop", true);
          setSquashY(u < 0.15 ? 0.82 : u > 0.85 ? 1.12 : 0.9);
          setFacing(leap.to.x >= leap.from.x ? 1 : -1);
          if (u >= 1) {
            body = {
              pos: { x: leap.to.x, y: leap.to.y },
              vel: { x: 0, y: 0 },
              grounded: true,
              platformId: target.platformId ?? null,
            };
            leapRef.current = null;
            landHold.current = 0.3;
            setSquashY(1.14);
            if (target.kind === "hide") {
              modeRef.current = "hide";
              modeUntil.current = now + 4000 + Math.random() * 4000;
              trySetState("hide", true);
            } else {
              modeRef.current = "idle";
              trySetState("idle", true);
              idleSince.current = now;
            }
            targetRef.current = null;
            nextDecisionAt.current = now + (chaos ? 4500 : 7500);
          }
          setHidePeek(0);
          bodyRef.current = body;
          setRenderPos({ ...body.pos });
          raf = requestAnimationFrame(tick);
          return;
        }

        // Soft arrival — no teleport
        if (
          d < 22 &&
          Math.abs(body.vel.x) < 50 &&
          (body.grounded || Math.abs(dy) < 24)
        ) {
          body = {
            pos: {
              x: body.pos.x + (target.x - body.pos.x) * 0.35,
              y: body.pos.y + (target.y - body.pos.y) * 0.35,
            },
            vel: { x: body.vel.x * 0.4, y: 0 },
            grounded: true,
            platformId: target.platformId ?? body.platformId,
          };
          if (d < 10) {
            body.pos = { x: target.x, y: target.y };
            body.vel = { x: 0, y: 0 };
            landHold.current = 0.28;
            setSquashY(1.14);
            if (target.kind === "hide") {
              modeRef.current = "hide";
              modeUntil.current = now + 4000 + Math.random() * 4000;
              trySetState("hide", true);
            } else {
              modeRef.current = "idle";
              trySetState("idle", true);
              idleSince.current = now;
            }
            targetRef.current = null;
            nextDecisionAt.current = now + (chaos ? 4500 : 7500);
          }
        } else {
          body = steerX(
            body,
            target.x,
            speed,
            dt,
            modeRef.current === "flee" ? 14 : 9
          );

          const needHeight = dy < -40;
          const tallLeap = dy < -160;
          const aligned = Math.abs(dx) < (tallLeap ? 120 : 100);

          if (
            body.grounded &&
            hopCooldown.current <= 0 &&
            needHeight &&
            aligned &&
            tallLeap
          ) {
            // Parabolic leap onto high window edges
            leapRef.current = {
              from: { ...body.pos },
              to: { x: target.x, y: target.y },
              t: 0,
              dur: clamp(0.45 + Math.abs(dy) / 900, 0.5, 0.85),
            };
            travelPhase.current = "leap";
            trySetState("hop", true);
            setSquashY(0.8);
          } else {
            const canHop =
              body.grounded &&
              hopCooldown.current <= 0 &&
              ((needHeight && aligned && !tallLeap) ||
                (modeRef.current === "flee" &&
                  !needHeight &&
                  Math.abs(dx) > 60 &&
                  Math.random() < dt * 0.8));

            if (canHop) {
              const power = needHeight
                ? jumpPowerForHeight(dy)
                : modeRef.current === "flee"
                  ? 680
                  : 560;
              body = jumpImpulse(body, power);
              body.vel.x = clamp(
                body.vel.x + Math.sign(dx || 1) * 50,
                -speed,
                speed
              );
              hopCooldown.current = 0.55;
              travelPhase.current = "jump";
              trySetState("hop", true);
              setSquashY(0.84);
            } else if (!body.grounded) {
              body = steerX(body, target.x, speed * 0.9, dt, 5);
              trySetState("hop");
              setSquashY(0.88);
              travelPhase.current = "jump";
            } else {
              trySetState("walk", true);
              setSquashY(0.94 + Math.sin(gaitDist.current * 0.2) * 0.03);
              travelPhase.current = "run";
            }
          }

          if (Math.abs(body.vel.x) > 12) {
            setFacing(body.vel.x >= 0 ? 1 : -1);
          }
          gaitDist.current += Math.abs(body.vel.x) * dt;
          setGaitPhase((gaitDist.current % 42) / 42);
        }

        if (!leapRef.current) {
          body = integrate(body, dt, b, platforms, { size });
        }
        if (body.grounded && landHold.current > 0) {
          landHold.current -= dt;
          setSquashY(1.12);
        }
        setHidePeek(0);
        bodyRef.current = body;
        setRenderPos({ ...body.pos });
        raf = requestAnimationFrame(tick);
        return;
      }

      // Fall / idle floor physics
      if (modeRef.current === "fall" || modeRef.current === "idle") {
        body = integrate(body, dt, b, platforms, { size });
        if (modeRef.current === "fall") {
          trySetState("fall");
          setSquashY(body.grounded ? 1.16 : 0.86);
          if (body.grounded) {
            modeRef.current = "idle";
            landHold.current = 0.3;
            trySetState("idle", true);
            idleSince.current = now;
            nextDecisionAt.current = now + 4000;
          }
        } else {
          trySetState("idle");
          if (landHold.current > 0) {
            landHold.current -= dt;
            setSquashY(1.1);
          } else setSquashY(1);
        }
        setHidePeek(0);
        bodyRef.current = body;
        setRenderPos({ ...body.pos });
      }

      lastDecision.current = now;
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
    decide,
    trySetState,
    say,
    terminalPerch,
    // Window geometry — perch follow reads live DOM; deps keep sim aware of moves
    windows,
  ]);

  // Terminal commands → same FSM (request counters bump from todd-store.runCommand)
  useEffect(() => {
    if (!requestCome) return;
    leapRef.current = null;
    const p = terminalPerch() || {
      id: "come-terminal",
      kind: "perch" as const,
      x: viewport.width * 0.45,
      y: Math.max(80, viewport.height * 0.22),
      platformId: "window-terminal",
    };
    // Speech already set by store ("coming!!")
    beginTravel(p, "travel");
    nextDecisionAt.current = performance.now() + 12000;
  }, [requestCome, terminalPerch, viewport, beginTravel]);

  useEffect(() => {
    if (!requestDance) return;
    leapRef.current = null;
    targetRef.current = null;
    modeRef.current = "dance";
    danceT.current = 0;
    modeUntil.current = performance.now() + 4500;
    setState("dance");
    nextDecisionAt.current = performance.now() + 8000;
  }, [requestDance, setState]);

  useEffect(() => {
    if (!requestSleep) return;
    leapRef.current = null;
    targetRef.current = null;
    modeRef.current = "sleep";
    modeUntil.current = performance.now() + 8500;
    setState("sleep");
    nextDecisionAt.current = performance.now() + 12000;
  }, [requestSleep, setState]);

  // Chaos toggle: kick the decision clock so mischief starts promptly
  useEffect(() => {
    if (!chaos) return;
    nextDecisionAt.current = Math.min(
      nextDecisionAt.current,
      performance.now() + 700
    );
  }, [chaos]);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownAt.current = performance.now();
    dragged.current = false;
    dragRef.current = {
      px: e.clientX,
      py: e.clientY,
      ox: bodyRef.current.pos.x,
      oy: bodyRef.current.pos.y,
      samples: [{ t: performance.now(), x: e.clientX, y: e.clientY }],
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const moved = Math.hypot(
      e.clientX - dragRef.current.px,
      e.clientY - dragRef.current.py
    );
    if (moved > 8 && !dragged.current) {
      dragged.current = true;
      modeRef.current = "drag";
      setState("dragged");
      say("weee!!");
    }
    if (!dragged.current) return;

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
    const samples = dragRef.current.samples;
    samples.push({ t: performance.now(), x: e.clientX, y: e.clientY });
    if (samples.length > 6) samples.shift();
    bodyRef.current = {
      pos: { x: nx, y: ny },
      vel: { x: 0, y: 0 },
      grounded: false,
      platformId: null,
    };
    setRenderPos({ x: nx, y: ny });
    setSquashY(1.12);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const samples = dragRef.current.samples;
    const wasDrag = dragged.current;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (!wasDrag) return; // click handler will startle

    let vx = 0;
    let vy = 280;
    if (samples.length >= 2) {
      const a = samples[0];
      const c = samples[samples.length - 1];
      const span = Math.max(0.016, (c.t - a.t) / 1000);
      vx = clamp(((c.x - a.x) / span) * 0.65, -900, 900);
      vy = clamp(((c.y - a.y) / span) * 0.65, -200, 1100);
    }

    modeRef.current = "fall";
    setState("fall");
    say("oof—");
    bodyRef.current = {
      ...bodyRef.current,
      grounded: false,
      platformId: null,
      vel: { x: vx, y: Math.max(180, vy) },
    };
    landHold.current = 0.35;
    nextDecisionAt.current = performance.now() + 3500;
  };

  const onClick = () => {
    if (dragged.current) return;

    const n = bumpClick();
    if (clickReset.current) clearTimeout(clickReset.current);
    clickReset.current = window.setTimeout(() => resetClicks(), 2600);

    // Visible startle beat, then flee
    modeRef.current = "startled";
    startledUntil.current = performance.now() + 240 + Math.random() * 140;
    setState("startled");
    say(QUIPS[Math.min(n - 1, QUIPS.length - 1)]);
    setSquashY(0.76);

    const marks = readLandmarks(viewport.width, viewport.height, size);
    const escape = pickLandmark(marks, {
      prefer: ["floor", "hide", "wander"],
      avoidId: lastLandmarkId.current,
      from: bodyRef.current.pos,
      minDist: 160,
    });
    targetRef.current =
      escape ||
      ({
        id: "escape",
        kind: "floor",
        x: clamp(
          bodyRef.current.pos.x + (Math.random() > 0.5 ? 260 : -260),
          8,
          viewport.width - size - 8
        ),
        y: bounds().floorY,
        platformId: "floor",
      } satisfies Landmark);
    lastLandmarkId.current = targetRef.current.id;

    if (n >= 4) {
      modeRef.current = "dance";
      modeUntil.current = performance.now() + 2800;
      say("OK FINE I'LL DANCE");
      setState("dance");
      window.setTimeout(() => resetClicks(), 2800);
    }
  };

  if (hiddenTab) return null;
  if (layout === "mobile") {
    // Simplified: no autonomous roaming covering the sheet
    return null;
  }

  // Hero lock: TerminalTodd on the window owns the mascot look;
  // stage Todd only appears for chaos / locomotion / dance.
  const stageActive =
    chaos ||
    state === "dance" ||
    state === "walk" ||
    state === "hop" ||
    state === "commanded" ||
    state === "dragged" ||
    state === "fall";
  const heroLock =
    !stageActive &&
    Boolean(windows.terminal?.open && !windows.terminal?.minimized);
  if (heroLock) return null;

  const bubbleW = 220;
  const bubbleH = 56;
  const preferLeft = renderPos.x + size * 0.55 + bubbleW > viewport.width - 20;
  const preferBelow = renderPos.y < STATUS + 64;
  const bubbleLeft = clamp(
    preferLeft
      ? renderPos.x + size * 0.2 - bubbleW
      : renderPos.x + size * 0.55,
    12,
    viewport.width - bubbleW - 12
  );
  const bubbleTop = clamp(
    preferBelow
      ? renderPos.y + size * 0.72
      : renderPos.y - bubbleH - 8,
    STATUS + 8,
    viewport.height - DOCK - bubbleH - 8
  );
  const opacity = modeRef.current === "hide" ? 0.55 + hidePeek * 0.35 : 1;
  const zBoost = modeRef.current === "hide" ? 40 : 70;

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-visible"
      style={{ zIndex: 200 }}
    >
      <AnimatePresence>
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, y: preferBelow ? -6 : 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: preferBelow ? -4 : 4 }}
            transition={{ duration: 0.2 }}
            className="speech-bubble pointer-events-none absolute z-20"
            data-side={preferLeft ? "left" : "right"}
            data-v={preferBelow ? "below" : "above"}
            style={{
              left: bubbleLeft,
              top: bubbleTop,
              color: "#f7faf5",
            }}
          >
            {speech.split("**").map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-[var(--os-lime)]">
                  {part}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="pointer-events-auto absolute will-change-transform"
        style={{
          transform: `translate3d(${renderPos.x}px, ${renderPos.y}px, 0)`,
          width: size,
          height: size,
          opacity,
          transition: modeRef.current === "hide" ? "opacity 0.35s ease" : undefined,
        }}
      >
        <button
          type="button"
          aria-label="Todd the frog. Click to startle, drag to move, or try todd dance in the terminal."
          className="relative touch-none cursor-grab appearance-none border-0 bg-transparent p-0 shadow-none outline-none ring-0 [-webkit-tap-highlight-color:transparent] active:cursor-grabbing focus:outline-none focus-visible:outline-none"
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
