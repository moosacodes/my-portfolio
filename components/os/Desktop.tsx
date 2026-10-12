"use client";

import { useEffect, useState } from "react";
import { ALL_APPS, PROFILE, type AppId } from "@/lib/portfolio/data";
import { WindowProvider, useWindows } from "@/lib/os/window-store";
import { ToddProvider } from "@/lib/todd/todd-store";
import { StatusBar } from "@/components/os/StatusBar";
import { Dock } from "@/components/os/Dock";
import { WindowFrame } from "@/components/os/WindowFrame";
import { MobileSheet } from "@/components/os/MobileSheet";
import { ToddExe } from "@/components/os/ToddExe";
import { AppContent } from "@/components/apps/AppContent";
import { ToddStage } from "@/components/todd/ToddStage";

function useViewport() {
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });
  const [layout, setLayout] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });
      setLayout(width < 768 ? "mobile" : "desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { viewport, layout };
}

function DesktopInner() {
  const { viewport, layout } = useViewport();
  const { closeApp, focused, minimizeApp, openApp } = useWindows();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !focused) return;
      if (layout === "mobile") closeApp(focused);
      else minimizeApp(focused);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, minimizeApp, closeApp, layout]);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--os-bg)] text-white">
      <a
        href="#os-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-12 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#0a0a0a]"
      >
        Skip to desktop
      </a>

      <div className="os-wallpaper pointer-events-none absolute inset-0" aria-hidden />

      <StatusBar />

      <main id="os-main" className="relative min-h-0 flex-1">
        {layout === "desktop" && (
          <>
            <ToddExe />
            {ALL_APPS.map((id: AppId) => (
              <WindowFrame key={id} id={id} viewport={viewport}>
                <AppContent id={id} />
              </WindowFrame>
            ))}
          </>
        )}

        {layout === "mobile" && (
          <>
            <div className="flex h-full flex-col items-center justify-center px-6 pb-28 pt-10 text-center">
              <div className="mb-4 h-20 w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/todd/todd-original.png"
                  alt=""
                  className="h-full w-full object-contain drop-shadow-xl"
                />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight">
                MOOSA<span className="text-[var(--os-lime)]">.OS</span>
              </p>
              <p className="mt-2 text-sm text-zinc-400">{PROFILE.fullName}</p>
              <p className="mt-1 text-xs text-zinc-500">{PROFILE.tagline}</p>
              <button
                type="button"
                onClick={() => openApp("terminal")}
                data-todd-safe
                className="mt-6 rounded-xl border border-[var(--os-lime)]/40 bg-[var(--os-lime)]/10 px-4 py-2.5 font-mono text-xs text-[var(--os-lime)]"
              >
                todd@moosa:~$ open terminal
              </button>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <a
                  href={`mailto:${PROFILE.email}`}
                  data-todd-safe
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-200"
                >
                  Email
                </a>
                <a
                  href={PROFILE.resumePdf}
                  download
                  data-todd-safe
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-200"
                >
                  Resume
                </a>
              </div>
            </div>
            <MobileSheet />
          </>
        )}

        <ToddStage layout={layout} viewport={viewport} />
      </main>

      <Dock layout={layout} />
    </div>
  );
}

export function Desktop() {
  return (
    <WindowProvider>
      <ToddProvider>
        <DesktopInner />
      </ToddProvider>
    </WindowProvider>
  );
}
