"use client";

import { APP_META, DOCK_ORDER, type AppId } from "@/lib/portfolio/data";
import { useWindows } from "@/lib/os/window-store";

export function Dock({ layout }: { layout: "desktop" | "mobile" }) {
  const { windows, openApp, focused, mobileActive } = useWindows();

  return (
    <nav
      data-todd-landmark="dock"
      aria-label="Application dock"
      className={`z-50 flex shrink-0 items-center justify-center gap-1 border-white/10 bg-black/55 backdrop-blur-md ${
        layout === "desktop"
          ? "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl border px-2 py-2 shadow-2xl shadow-black/40"
          : "border-t px-2 py-2"
      }`}
    >
      {DOCK_ORDER.map((id: AppId) => {
        const meta = APP_META[id];
        const w = windows[id];
        const active =
          layout === "mobile" ? mobileActive === id : focused === id;
        const running = w.open && !w.minimized;

        return (
          <button
            key={id}
            type="button"
            onClick={() => openApp(id)}
            title={meta.title}
            aria-label={`Open ${meta.title}`}
            aria-current={active ? "true" : undefined}
            data-todd-safe
            className={`group relative flex h-12 w-12 flex-col items-center justify-center rounded-xl transition ${
              active
                ? "bg-white/15 text-white"
                : "text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-sm font-semibold leading-none tracking-tight">
              {meta.icon}
            </span>
            <span className="mt-0.5 max-w-[44px] truncate text-[9px] opacity-80">
              {meta.dockLabel}
            </span>
            {running && layout === "desktop" && (
              <span
                className={`absolute bottom-0.5 h-1 w-1 rounded-full ${
                  active ? "bg-[var(--os-lime)]" : "bg-white/40"
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
