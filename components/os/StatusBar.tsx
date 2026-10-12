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
        d
          .toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      data-todd-landmark="status"
      className="glass-bar relative z-50 flex h-11 shrink-0 items-center justify-between border-b px-4 sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-7 lg:gap-9">
        <button
          type="button"
          onClick={() => openApp("terminal")}
          className="flex items-center gap-2.5 font-display text-[14px] font-semibold tracking-[-0.03em] text-white"
          data-todd-safe
        >
          <Image
            src="/todd/todd-original.png"
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] object-contain"
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
              className={`rounded-md px-2.5 py-[6px] text-[12.5px] font-medium tracking-[-0.01em] transition ${
                focused === id
                  ? "bg-white/[0.12] text-white"
                  : "text-white/40 hover:bg-white/[0.05] hover:text-white/80"
              }`}
            >
              {APP_META[id].menuLabel}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3.5 text-white/45">
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className={`hidden rounded-md p-1.5 transition hover:bg-white/10 hover:text-white/85 md:inline-flex ${
            paused ? "text-[var(--os-lime)]" : ""
          }`}
          aria-pressed={paused}
          data-todd-safe
          title={paused ? "Resume Todd" : "Pause Todd"}
        >
          {paused ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => openApp("terminal")}
          className="rounded-md p-1.5 hover:bg-white/10 hover:text-white/85"
          aria-label="Search / open terminal"
          data-todd-safe
          title="Open Terminal"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="tabular-nums text-[12.5px] tracking-[-0.01em] text-white/55">
          {time}
        </span>
      </div>
    </header>
  );
}
