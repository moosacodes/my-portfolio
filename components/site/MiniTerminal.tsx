"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PROFILE } from "@/lib/portfolio/data";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MiniTerminal({ open, onClose }: Props) {
  const [lines, setLines] = useState<string[]>([
    `moosa@portfolio:~$ welcome`,
    `type help · whoami · projects · exit`,
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: string[] = [`$ ${raw}`];
    if (!cmd) return;
    if (cmd === "help") {
      out.push("commands: help, whoami, projects, email, resume, clear, exit");
    } else if (cmd === "whoami") {
      out.push(`${PROFILE.fullName} — CS @ Guelph · systems · infra · security`);
    } else if (cmd === "projects") {
      out.push("→ Virtualized Network Home Lab");
      out.push("→ User-Space VPN Tunnel");
    } else if (cmd === "email") {
      out.push(PROFILE.email);
    } else if (cmd === "resume") {
      out.push(PROFILE.resumePdf);
      window.open(PROFILE.resumePdf, "_blank");
    } else if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    } else if (cmd === "exit" || cmd === "q") {
      onClose();
      return;
    } else {
      out.push(`command not found: ${cmd}`);
    }
    setLines((prev) => [...prev, ...out]);
    setInput("");
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="Terminal"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <button
            type="button"
            aria-label="Close terminal"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57]"
          />
          <span className="ml-2 font-mono text-[12px] text-white/40">
            todd@moosa —
          </span>
        </div>
        <div className="max-h-[50vh] space-y-1 overflow-y-auto px-4 py-3 font-mono text-[13px] text-[#a3e635]">
          {lines.map((l, i) => (
            <pre key={i} className="whitespace-pre-wrap text-white/75">
              {l}
            </pre>
          ))}
          <form
            className="flex items-center gap-2 pt-1"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              run(input);
            }}
          >
            <span className="text-[#a3e635]">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-white outline-none"
              aria-label="Terminal input"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
