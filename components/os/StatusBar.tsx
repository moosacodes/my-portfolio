"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/portfolio/data";
import { useTodd } from "@/lib/todd/todd-store";

export function StatusBar() {
  const [time, setTime] = useState("");
  const { paused, chaos, setPaused, statusLine } = useTodd();

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      data-todd-landmark="status"
      className="relative z-50 flex h-10 shrink-0 items-center justify-between border-b border-white/10 bg-black/50 px-3 backdrop-blur-md sm:px-4"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="font-display text-sm font-bold tracking-tight text-white">
          MOOSA<span className="text-[var(--os-lime)]">.OS</span>
        </span>
        <span className="hidden truncate text-xs text-zinc-500 sm:inline">
          {PROFILE.fullName}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className="hidden max-w-[200px] truncate text-[11px] text-zinc-500 md:inline"
          title={statusLine}
        >
          {statusLine}
        </span>
        {chaos && (
          <span className="rounded bg-[var(--os-lime)]/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--os-lime)]">
            chaos
          </span>
        )}
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-zinc-300 transition hover:border-white/30 hover:text-white"
          aria-pressed={paused}
          data-todd-safe
        >
          {paused ? "Todd: paused" : "Pause Todd"}
        </button>
        <span className="tabular-nums text-xs text-zinc-400">{time}</span>
      </div>
    </header>
  );
}
