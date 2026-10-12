"use client";

import { useState } from "react";
import Image from "next/image";
import { useTodd } from "@/lib/todd/todd-store";

export function ToddExe() {
  const { statusLabel, mood, energy, chaos, paused } = useTodd();
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const chaosPct = chaos ? 72 : paused ? 6 : 24;

  return (
    <aside
      className="absolute left-5 top-5 z-[80] hidden w-[210px] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0e0b]/95 shadow-[0_28px_70px_rgba(0,0,0,0.6)] sm:block"
      data-todd-landmark="todd-exe"
      aria-label="Todd status"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-white/65">
          <Image
            src="/todd/todd-original.png"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
          todd.exe
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[13px] leading-none text-white/30 transition hover:text-white/70"
          aria-label="Close todd.exe"
          data-todd-safe
        >
          ×
        </button>
      </div>
      <div className="space-y-3.5 px-3.5 py-3.5 font-mono text-[11px]">
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
      <span className="text-white/30">{label}</span>
      <span className="truncate text-[var(--os-lime)]">{value}</span>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 text-white/30">{label}</div>
      <div className="h-[4px] overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-[var(--os-lime)] transition-all duration-500"
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
