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

type Line = { type: "in" | "out" | "sys" | "dim"; text: string };

export function TerminalApp() {
  const { openApp } = useWindows();
  const { runCommand: toddCommand, say } = useTodd();
  const [lines, setLines] = useState<Line[]>([
    { type: "sys", text: `Welcome to MOOSA.OS v${PROFILE.osVersion}` },
    { type: "dim", text: "An interactive developer portfolio." },
    { type: "dim", text: "Type 'help' to get started." },
    { type: "dim", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

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
          { type: "sys", text: `Welcome to MOOSA.OS v${PROFILE.osVersion}` },
          { type: "dim", text: "Terminal cleared. Type help for commands." },
        ]);
      } else if (result.lines.length) {
        setLines((prev) => [
          ...prev,
          ...result.lines.map((text) => ({ type: "out" as const, text })),
        ]);
      }
      setInput("");
    },
    [openApp, toddCommand, history]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(input);
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

  return (
    <div
      className="relative flex h-full min-h-[320px] flex-col font-mono text-[15px] leading-relaxed sm:text-[16px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {lines.map((l, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap break-words ${
              l.type === "in"
                ? "text-[var(--os-lime)]"
                : l.type === "sys"
                  ? "text-[var(--os-lime)] text-[17px] font-medium sm:text-[18px]"
                  : l.type === "dim"
                    ? "text-zinc-500"
                    : "text-[#c6ef6a]"
            }`}
          >
            {l.text}
          </pre>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-4"
      >
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
          className="min-w-0 flex-1 bg-transparent text-[var(--os-lime)] outline-none caret-[var(--os-lime)] placeholder:text-zinc-600"
          aria-label="Terminal command input"
        />
        <span
          className="animate-cursor-blink h-[1.1em] w-2.5 bg-[var(--os-lime)]"
          aria-hidden
        />
      </form>

      <button
        type="button"
        onClick={() => {
          say("that's me!! click · drag · todd dance");
          toddCommand("come");
        }}
        className="absolute bottom-2 right-2 text-sm text-zinc-500 transition hover:text-[var(--os-lime)]"
        data-todd-safe
      >
        meet todd →
      </button>
    </div>
  );
}
