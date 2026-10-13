"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { PROFILE } from "@/lib/portfolio/data";
import { autocomplete, runCommand } from "@/lib/terminal/commands";
import { useWindows } from "@/lib/os/window-store";
import { useTodd } from "@/lib/todd/todd-store";
import { ToddCharacter } from "@/components/todd/ToddCharacter";

type Line = { type: "in" | "out" | "sys" | "dim" | "accent"; text: string };

const BOOT: Line[] = [
  { type: "sys", text: `MOOSA.OS v${PROFILE.osVersion}` },
  { type: "accent", text: PROFILE.fullName },
  { type: "dim", text: "CS @ Guelph · Systems · Cloud · Security" },
  { type: "dim", text: `${PROFILE.location} · ${PROFILE.status}` },
  { type: "dim", text: "" },
  { type: "dim", text: "try: help · todd dance · open about" },
];

const QUICK = [
  { label: "whoami", cmd: "whoami" },
  { label: "projects", cmd: "projects" },
  { label: "todd dance", cmd: "todd dance" },
  { label: "resume", cmd: "resume" },
] as const;

export function TerminalApp() {
  const { openApp } = useWindows();
  const { runCommand: toddCommand, say, bumpClick, trySetState, state } =
    useTodd();
  const [lines, setLines] = useState<Line[]>([]);
  const [booting, setBooting] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [look, setLook] = useState({ x: -0.2, y: 0.05 });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    setLines([]);
    setBooting(true);
    const tick = () => {
      if (cancelled) return;
      if (i >= BOOT.length) {
        setBooting(false);
        queueMicrotask(() => inputRef.current?.focus());
        return;
      }
      const line = BOOT[i++];
      setLines((prev) => [...prev, line]);
      window.setTimeout(tick, line.text === "" ? 30 : 55);
    };
    const start = window.setTimeout(tick, 120);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width * 0.72;
      const cy = r.top + r.height * 0.45;
      setLook({
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / 140)),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / 100)),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || booting) return;

      setLines((prev) => [
        ...prev,
        { type: "in", text: `todd@moosa:~$ ${trimmed}` },
      ]);
      setHistory((h) => [...h, trimmed]);
      setHistIdx(-1);

      const result = runCommand(
        trimmed,
        { openApp, toddCommand },
        [...history, trimmed]
      );

      if (result.clear) {
        setLines([
          { type: "sys", text: `MOOSA.OS v${PROFILE.osVersion}` },
          { type: "dim", text: "cleared · type help" },
        ]);
      } else if (result.lines.length) {
        setLines((prev) => [
          ...prev,
          ...result.lines.map((text) => ({ type: "out" as const, text })),
        ]);
      }
      setInput("");
    },
    [openApp, toddCommand, history, booting]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(inputRef.current?.value ?? input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next] ?? "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completed = autocomplete(input, history);
      if (completed) setInput(completed);
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const heroClip =
    state === "dance"
      ? "dance"
      : state === "sleep"
        ? "sleep"
        : state === "startled"
          ? "startled"
          : "look";

  const showInlineTodd =
    state !== "walk" &&
    state !== "hop" &&
    state !== "commanded" &&
    state !== "dragged" &&
    state !== "fall";

  return (
    <div
      className="relative flex h-full min-h-0 flex-col font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={heroRef}
        className="mb-5 flex items-center gap-4 border-b border-white/[0.06] pb-5"
      >
        {showInlineTodd && (
          <button
            type="button"
            data-todd-safe
            aria-label="Todd the frog. Click to startle, or try todd dance in the terminal."
            className="pointer-events-auto -ml-1 shrink-0 cursor-pointer appearance-none border-0 bg-transparent p-0"
            style={{ filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.65))" }}
            onClick={(e) => {
              e.stopPropagation();
              const n = bumpClick();
              trySetState("startled", true);
              say(n > 3 ? "ok that tickled" : "boop.");
            }}
          >
            <ToddCharacter clip={heroClip} look={look} facing={1} size={120} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[12px] tracking-[0.18em] text-[var(--os-lime)]/80">
            MASCOT ONLINE
          </p>
          <p className="mt-1 font-sans text-[22px] font-semibold tracking-[-0.04em] text-white sm:text-[26px]">
            Todd lives here.
          </p>
          <p className="mt-1 max-w-[28ch] font-sans text-[13px] leading-snug text-white/45">
            Click him. Or type{" "}
            <span className="text-[var(--os-lime)]/80">todd dance</span>.
          </p>
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="space-y-[4px] text-[14.5px] leading-[1.7] tracking-[-0.02em] sm:text-[15.5px]">
          {lines.map((l, i) => (
            <pre
              key={i}
              className={`whitespace-pre-wrap break-words ${
                l.type === "in" || l.type === "sys"
                  ? "text-[var(--os-lime)]"
                  : l.type === "accent"
                    ? "font-sans text-[18px] font-semibold tracking-[-0.03em] text-white sm:text-[20px]"
                    : l.type === "dim"
                      ? "text-white/40"
                      : "text-[var(--os-lime)]/85"
              }`}
            >
              {l.text || " "}
            </pre>
          ))}

          {!booting && (
            <form onSubmit={onSubmit} className="flex items-center gap-2 pt-2">
              <span className="shrink-0 text-[var(--os-lime)]" aria-hidden>
                todd@moosa:~$
              </span>
              <label htmlFor="moosa-terminal-input" className="sr-only">
                Terminal command
              </label>
              <input
                id="moosa-terminal-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                spellCheck={false}
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-[var(--os-lime)] caret-transparent outline-none"
                aria-label="Terminal command input"
              />
              {!input && (
                <span
                  className="animate-cursor-blink -ml-2 h-[1.1em] w-[0.5em] shrink-0 rounded-[1px] bg-white"
                  aria-hidden
                />
              )}
            </form>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {!booting && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
          {QUICK.map((q) => (
            <button
              key={q.cmd}
              type="button"
              data-todd-safe
              onClick={(e) => {
                e.stopPropagation();
                submit(q.cmd);
              }}
              className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/40 transition hover:border-[var(--os-lime)]/35 hover:text-[var(--os-lime)]"
            >
              {q.label}
            </button>
          ))}
          <button
            type="button"
            data-todd-safe
            onClick={(e) => {
              e.stopPropagation();
              say("that's me!!");
              toddCommand("come");
            }}
            className="ml-auto rounded-full px-2 py-1 font-sans text-[11px] text-white/25 transition hover:text-[var(--os-lime)]"
          >
            yeet todd →
          </button>
        </div>
      )}
    </div>
  );
}
