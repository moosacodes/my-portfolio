"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MENU_ORDER, APP_META } from "@/lib/portfolio/data";
import { useWindows } from "@/lib/os/window-store";
import { useTodd } from "@/lib/todd/todd-store";

export function StatusBar() {
  const [time, setTime] = useState("");
  const { openApp, focused } = useWindows();
  const { paused, setPaused } = useTodd();

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
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
      className="glass-bar relative z-50 flex h-12 shrink-0 items-center justify-between border-b px-3 sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => openApp("terminal")}
          className="flex items-center gap-2.5 font-display text-[15px] font-bold tracking-tight text-white"
          data-todd-safe
        >
          <Image
            src="/todd/todd-original.png"
            alt=""
            width={22}
            height={22}
            className="h-[22px] w-[22px] object-contain"
          />
          <span>
            MOOSA<span className="text-[var(--os-lime)]">.OS</span>
          </span>
        </button>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Apps">
          {MENU_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => openApp(id)}
              data-todd-safe
              className={`rounded-md px-3 py-1.5 text-[13px] transition ${
                focused === id
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              {APP_META[id].menuLabel}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-zinc-400">
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className="hidden rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-zinc-300 transition hover:border-white/25 hover:text-white sm:inline"
          aria-pressed={paused}
          data-todd-safe
          title="Pause Todd"
        >
          {paused ? "Todd: paused" : "Pause Todd"}
        </button>
        <span className="hidden sm:inline" aria-hidden title="Signal">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 16h2v4H2zm4-3h2v7H6zm4-3h2v10h-2zm4-3h2v13h-2zm4-4h2v17h-2z" />
          </svg>
        </span>
        <button
          type="button"
          onClick={() => openApp("terminal")}
          className="rounded p-1 hover:bg-white/10 hover:text-white"
          aria-label="Search / open terminal"
          data-todd-safe
          title="Open Terminal"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="tabular-nums text-[13px] text-zinc-300">{time}</span>
      </div>
    </header>
  );
}
