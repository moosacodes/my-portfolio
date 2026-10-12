"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ToddCommand, ToddState } from "@/lib/todd/types";

type ToddStore = {
  state: ToddState;
  chaos: boolean;
  paused: boolean;
  clickCount: number;
  statusLine: string;
  setState: (s: ToddState) => void;
  trySetState: (s: ToddState, force?: boolean) => boolean;
  setChaos: (v: boolean) => void;
  setPaused: (v: boolean) => void;
  bumpClick: () => number;
  resetClicks: () => void;
  runCommand: (cmd: ToddCommand) => string;
  requestCome: number;
  requestDance: number;
  requestSleep: number;
};

const ToddContext = createContext<ToddStore | null>(null);

const PRIORITY: Record<ToddState, number> = {
  dragged: 5,
  startled: 4,
  dance: 3,
  sleep: 3,
  commanded: 3,
  fall: 3,
  walk: 2,
  hop: 2,
  hide: 2,
  look: 2,
  blink: 1,
  idle: 1,
};

export function ToddProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<ToddState>("idle");
  const [chaos, setChaos] = useState(false);
  const [paused, setPaused] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [statusLine, setStatusLine] = useState("Todd is idle.");
  const [requestCome, setRequestCome] = useState(0);
  const [requestDance, setRequestDance] = useState(0);
  const [requestSleep, setRequestSleep] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setState = useCallback((s: ToddState) => {
    stateRef.current = s;
    setStateRaw(s);
    setStatusLine(`Todd is ${s}.`);
  }, []);

  const trySetState = useCallback(
    (s: ToddState, force = false) => {
      if (paused && !force && s !== "idle") return false;
      const cur = stateRef.current;
      if (!force && PRIORITY[s] < PRIORITY[cur] && cur !== "idle") return false;
      setState(s);
      return true;
    },
    [paused, setState]
  );

  const bumpClick = useCallback(() => {
    let next = 0;
    setClickCount((c) => {
      next = c + 1;
      return next;
    });
    return next;
  }, []);

  const resetClicks = useCallback(() => setClickCount(0), []);

  const runCommand = useCallback(
    (cmd: ToddCommand) => {
      switch (cmd) {
        case "help":
          return [
            "Todd commands:",
            "  todd dance   — celebrate",
            "  todd sleep   — take a nap",
            "  todd come    — hop toward you",
            "  todd status  — current mood",
            "  todd chaos   — toggle rare mischief",
            "  todd pause   — freeze autonomous chaos",
            "  todd resume  — unfreeze",
            "  todd help    — this list",
          ].join("\n");
        case "status":
          return `Todd · state=${stateRef.current} · chaos=${chaos ? "on" : "off"} · paused=${paused ? "yes" : "no"} · clicks=${clickCount}`;
        case "chaos": {
          const next = !chaos;
          setChaos(next);
          return next
            ? "Chaos mode ON. Todd will occasionally wander and hide (rate-limited)."
            : "Chaos mode OFF. Todd settles down.";
        }
        case "pause":
          setPaused(true);
          setState("idle");
          return "Todd paused. Autonomous motion disabled.";
        case "resume":
          setPaused(false);
          return "Todd resumed.";
        case "dance":
          setPaused(false);
          setState("dance");
          setRequestDance((n) => n + 1);
          return "Todd is dancing.";
        case "sleep":
          setPaused(false);
          setState("sleep");
          setRequestSleep((n) => n + 1);
          return "Todd is napping. zzz";
        case "come":
          setPaused(false);
          setState("commanded");
          setRequestCome((n) => n + 1);
          return "Todd is hopping over.";
        default:
          return "Unknown Todd command. Try todd help.";
      }
    },
    [chaos, paused, clickCount, setState]
  );

  const value = useMemo(
    () => ({
      state,
      chaos,
      paused,
      clickCount,
      statusLine,
      setState,
      trySetState,
      setChaos,
      setPaused,
      bumpClick,
      resetClicks,
      runCommand,
      requestCome,
      requestDance,
      requestSleep,
    }),
    [
      state,
      chaos,
      paused,
      clickCount,
      statusLine,
      setState,
      trySetState,
      bumpClick,
      resetClicks,
      runCommand,
      requestCome,
      requestDance,
      requestSleep,
    ]
  );

  return (
    <ToddContext.Provider value={value}>{children}</ToddContext.Provider>
  );
}

export function useTodd() {
  const ctx = useContext(ToddContext);
  if (!ctx) throw new Error("useTodd must be used within ToddProvider");
  return ctx;
}
