"use client";

import { APP_META, DOCK_ORDER, type AppId } from "@/lib/portfolio/data";
import { useWindows } from "@/lib/os/window-store";

const SHORTCUTS: AppId[] = ["about", "projects", "terminal", "resume", "contact"];

export function DesktopIcons() {
  const { openApp } = useWindows();

  return (
    <div
      className="absolute left-4 top-14 z-10 flex flex-col gap-3"
      data-todd-landmark="desktop-corner"
    >
      {SHORTCUTS.map((id) => {
        const meta = APP_META[id];
        return (
          <button
            key={id}
            type="button"
            onDoubleClick={() => openApp(id)}
            onClick={() => openApp(id)}
            className="group flex w-[76px] flex-col items-center gap-1 rounded-lg p-2 text-center transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--os-lime)]/60"
            data-todd-safe
            aria-label={`Open ${meta.title}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-lg text-zinc-200 shadow-lg group-hover:border-[var(--os-lime)]/35">
              {meta.icon}
            </span>
            <span className="text-[11px] font-medium leading-tight text-zinc-200 drop-shadow">
              {meta.dockLabel}
            </span>
          </button>
        );
      })}
      <p className="mt-2 hidden max-w-[76px] text-center text-[10px] text-zinc-600 sm:block">
        {DOCK_ORDER.length} apps
      </p>
    </div>
  );
}
