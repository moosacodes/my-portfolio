"use client";

import { useState } from "react";
import { APP_META, DOCK_ORDER, type AppId } from "@/lib/portfolio/data";
import { useWindows } from "@/lib/os/window-store";
import { DockIcon } from "@/components/os/DockIcons";

export function Dock({ layout }: { layout: "desktop" | "mobile" }) {
  const { windows, openApp, focused } = useWindows();
  const [hovered, setHovered] = useState<AppId | null>(null);

  return (
    <nav
      data-todd-landmark="dock"
      aria-label="Application dock"
      className={`z-50 flex shrink-0 items-end justify-center gap-1.5 ${
        layout === "desktop"
          ? "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/45 px-3 py-2.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
          : "border-t border-white/10 bg-black/60 px-2 py-2 backdrop-blur-xl"
      }`}
    >
      {DOCK_ORDER.map((id: AppId) => {
        const meta = APP_META[id];
        const w = windows[id];
        const active = focused === id;
        const running = w.open && !w.minimized;
        const showTip = hovered === id && layout === "desktop";

        return (
          <div key={id} className="relative flex flex-col items-center">
            {showTip && (
              <span className="pointer-events-none absolute -top-9 rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[11px] text-white shadow-lg backdrop-blur">
                {meta.dockLabel}
              </span>
            )}
            <button
              type="button"
              onClick={() => openApp(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              title={meta.title}
              aria-label={`Open ${meta.title}`}
              aria-current={active ? "true" : undefined}
              data-todd-safe
              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                active
                  ? "border-white/20 bg-white/15 text-white lime-glow"
                  : "border-transparent bg-white/[0.04] text-zinc-300 hover:border-white/15 hover:bg-white/10 hover:text-white"
              }`}
            >
              <DockIcon id={id} />
              {running && (
                <span
                  className={`absolute -bottom-1 h-1 w-1 rounded-full ${
                    active
                      ? "bg-[var(--os-lime)] shadow-[0_0_8px_var(--os-lime)]"
                      : "bg-white/45"
                  }`}
                />
              )}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
