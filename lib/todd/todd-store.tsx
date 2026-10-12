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
  speech: string | null;
  mood: string;
  energy: number;
  statusLabel: string;
  setState: (s: ToddState) => void;
  trySetState: (s: ToddState, force?: boolean) => boolean;
  setChaos: (v: boolean) => void;
  setPaused: (v: boolean) => void;
  say: (text: string, ms?: number) => void;
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

const MOODS: Record<string, string> = {
  idle: "curious",
  look: "curious",
  blink: "curious",
  walk: "adventurous",
  hop: "bouncy",
  startled: "spicy",
  dragged: "dizzy",
  dance: "hype",
  sleep: "sleepy",
  hide: "sneaky",
  fall: "whoops",
  commanded: "obedient",
};

const STATUS: Record<string, string> = {
  idle: "hanging out",
  look: "people-watching",
  walk: "exploring",
  hop: "hopping",
  startled: "startled!",
  dragged: "being yeeted",
  dance: "dancing",
  sleep: "napping",
  hide: "hiding",
  fall: "landing",
  commanded: "on a mission",
  blink: "hanging out",
};

export function ToddProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<ToddState>("idle");
  const [chaos, setChaos] = useState(false);
  const [paused, setPaused] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [speech, setSpeech] = useState<string | null>(
    "hey there! type **help** to begin."
  );
  const [energy, setEnergy] = useState(72);
  const stateRef = useRef(state);
  stateRef.current = state;
  const speechTimer = useRef<number | null>(null);
  const [requestCome, setRequestCome] = useState(0);
  const [requestDance, setRequestDance] = useState(0);
  const [requestSleep, setRequestSleep] = useState(0);

  const say = useCallback((text: string, ms = 4200) => {
    setSpeech(text);
    if (speechTimer.current) clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech(null), ms);
  }, []);

  const setState = useCallback((s: ToddState) => {
    stateRef.current = s;
    setStateRaw(s);
    setEnergy((e) => {
      if (s === "dance" || s === "hop" || s === "walk") return Math.max(12, e - 4);
      if (s === "sleep") return Math.min(100, e + 18);
      if (s === "idle") return Math.min(100, e + 1);
      return e;
    });
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
          say("i know tricks — try todd dance");
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
          return `Todd · state=${stateRef.current} · mood=${MOODS[stateRef.current]} · energy=${energy}% · chaos=${chaos ? "on" : "off"}`;
        case "chaos": {
          const next = !chaos;
          setChaos(next);
          say(next ? "chaos mode… hehe" : "okay okay, chilling");
          return next
            ? "Chaos mode ON. Todd will occasionally wander (rate-limited)."
            : "Chaos mode OFF. Todd settles down.";
        }
        case "pause":
          setPaused(true);
          setState("idle");
          say("brb freezing");
          return "Todd paused. Autonomous motion disabled.";
        case "resume":
          setPaused(false);
          say("we’re so back");
          return "Todd resumed.";
        case "dance":
          setPaused(false);
          setState("dance");
          setRequestDance((n) => n + 1);
          say("watch this!!");
          return "Todd is dancing.";
        case "sleep":
          setPaused(false);
          setState("sleep");
          setRequestSleep((n) => n + 1);
          say("zzz… five more minutes");
          return "Todd is napping. zzz";
        case "come":
          setPaused(false);
          setState("commanded");
          setRequestCome((n) => n + 1);
          say("coming!!");
          return "Todd is hopping over.";
        default:
          return "Unknown Todd command. Try todd help.";
      }
    },
    [chaos, energy, say, setState]
  );

  const value = useMemo(
    () => ({
      state,
      chaos,
      paused,
      clickCount,
      speech,
      mood: MOODS[state] || "curious",
      energy,
      statusLabel: STATUS[state] || "hanging out",
      setState,
      trySetState,
      setChaos,
      setPaused,
      say,
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
      speech,
      energy,
      setState,
      trySetState,
      say,
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
