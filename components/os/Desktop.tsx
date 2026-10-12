"use client";

import { useEffect, useState } from "react";
import { DOCK_ORDER, PROFILE, type AppId } from "@/lib/portfolio/data";
import { WindowProvider, useWindows } from "@/lib/os/window-store";
import { ToddProvider } from "@/lib/todd/todd-store";
import { StatusBar } from "@/components/os/StatusBar";
import { Dock } from "@/components/os/Dock";
import { WindowFrame } from "@/components/os/WindowFrame";
import { MobileSheet } from "@/components/os/MobileSheet";
import { DesktopIcons } from "@/components/os/DesktopIcons";
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
  const { closeApp, focused, minimizeApp } = useWindows();

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
            <DesktopIcons />
            <div className="pointer-events-none absolute bottom-28 left-1/2 z-10 w-[min(520px,90vw)] -translate-x-1/2 text-center">
              <h1 className="font-display text-4xl font-bold tracking-tight text-white/90 sm:text-5xl">
                {PROFILE.fullName}
              </h1>
              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                {PROFILE.tagline}
              </p>
              <p className="mt-3 text-xs text-zinc-600">
                Open apps from the dock · try the Terminal · say hi to Todd
              </p>
            </div>
            {DOCK_ORDER.map((id: AppId) => (
              <WindowFrame key={id} id={id} viewport={viewport}>
                <AppContent id={id} />
              </WindowFrame>
            ))}
          </>
        )}

        {layout === "mobile" && (
          <>
            <div className="flex h-full flex-col items-center justify-center px-6 pb-24 pt-8 text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight">
                {PROFILE.fullName}
              </h1>
              <p className="mt-2 text-sm text-zinc-400">{PROFILE.tagline}</p>
              <p className="mt-1 text-xs text-zinc-500">{PROFILE.location}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <a
                  href={`mailto:${PROFILE.email}`}
                  data-todd-safe
                  className="rounded-lg border border-[var(--os-lime)]/40 bg-[var(--os-lime)]/10 px-3 py-2 text-xs font-medium text-[var(--os-lime)]"
                >
                  Email
                </a>
                <a
                  href={PROFILE.resumePdf}
                  download
                  data-todd-safe
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs text-zinc-200"
                >
                  Resume
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-todd-safe
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs text-zinc-200"
                >
                  GitHub
                </a>
              </div>
              <p className="mt-8 max-w-xs text-xs text-zinc-600">
                Tap an app in the dock below. Todd hangs out in the corner —
                he won&apos;t block your links.
              </p>
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
