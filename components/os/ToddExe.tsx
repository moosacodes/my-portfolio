"use client";

import { useState } from "react";
import { useTodd } from "@/lib/todd/todd-store";

export function ToddExe() {
  const { statusLabel, mood, energy, chaos, paused } = useTodd();
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const chaosPct = chaos ? 68 : paused ? 8 : 28;

  return (
    <aside
      className="glass-panel absolute left-5 top-5 z-40 hidden w-[240px] overflow-hidden rounded-xl sm:block"
      data-todd-landmark="todd-exe"
      aria-label="Todd status"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--os-lime)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--os-lime)]" />
          </span>
          todd.exe
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-zinc-500 transition hover:text-white"
          aria-label="Close todd.exe"
          data-todd-safe
        >
          ×
        </button>
      </div>
      <div className="space-y-2.5 px-3.5 py-3.5 font-mono text-[12px]">
        <Row label="status" value={statusLabel} />
        <Row label="mood" value={mood} />
        <Bar label="energy" value={energy} />
        <Bar label="chaos" value={chaosPct} />
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      <span className="truncate text-[var(--os-lime)]">{value}</span>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-600">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[var(--os-lime)] shadow-[0_0_10px_var(--os-lime-glow)] transition-all duration-500"
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
