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
      className={`z-50 flex shrink-0 items-end justify-center ${
        layout === "desktop"
          ? "absolute bottom-6 left-1/2 -translate-x-1/2 gap-1 rounded-[28px] border border-white/[0.1] bg-black/55 px-3 py-2.5 shadow-[0_28px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          : "gap-1 border-t border-white/10 bg-black/70 px-2 py-2 backdrop-blur-xl"
      }`}
    >
      {DOCK_ORDER.map((id: AppId) => {
        const meta = APP_META[id];
        const w = windows[id];
        const active = focused === id;
        const running = w.open && !w.minimized;
        const showTip = hovered === id && layout === "desktop";
        const lift = hovered === id && layout === "desktop";

        return (
          <div key={id} className="relative flex flex-col items-center">
            {showTip && (
              <span className="pointer-events-none absolute -top-10 rounded-lg border border-white/10 bg-black/90 px-2.5 py-1 text-[11px] font-medium text-white/90 shadow-lg">
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
              className={`group relative flex h-[52px] w-[52px] items-center justify-center transition-transform duration-200 ease-out ${
                active
                  ? "rounded-2xl bg-[rgba(157,255,114,0.16)] text-white"
                  : "rounded-2xl text-white/50 hover:bg-white/[0.07] hover:text-white/90"
              }`}
              style={lift ? { transform: "translateY(-6px) scale(1.08)" } : undefined}
            >
              <DockIcon id={id} />
              {running && (
                <span
                  className={`absolute bottom-[4px] h-[3px] w-[3px] rounded-full ${
                    active
                      ? "bg-[var(--os-lime)] shadow-[0_0_8px_var(--os-lime)]"
                      : "bg-white/35"
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
