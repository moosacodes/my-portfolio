"use client";

import { useEffect, useState } from "react";
import { ALL_APPS, PROFILE, type AppId } from "@/lib/portfolio/data";
import { WindowProvider, useWindows } from "@/lib/os/window-store";
import { ToddProvider } from "@/lib/todd/todd-store";
import { StatusBar } from "@/components/os/StatusBar";
import { Dock } from "@/components/os/Dock";
import { WindowFrame } from "@/components/os/WindowFrame";
import { MobileSheet } from "@/components/os/MobileSheet";
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
  const { closeApp, focused, minimizeApp, openApp, mobileActive } = useWindows();

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

      <main id="os-main" className="relative min-h-0 flex-1 overflow-hidden">
        {layout === "desktop" &&
          ALL_APPS.map((id: AppId) => (
            <WindowFrame key={id} id={id} viewport={viewport}>
              <AppContent id={id} />
            </WindowFrame>
          ))}

        {layout === "mobile" && (
          <>
            {!mobileActive && (
              <div className="flex h-full flex-col items-center justify-center px-7 pb-32 pt-12 text-center">
                <div className="mb-6 h-28 w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/todd/todd-original.png"
                    alt=""
                    className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)]"
                  />
                </div>
                <p className="font-display text-[34px] font-semibold tracking-[-0.04em]">
                  MOOSA<span className="text-[var(--os-lime)]">.OS</span>
                </p>
                <p className="mt-3 text-[15px] text-white/70">{PROFILE.fullName}</p>
                <p className="mt-1.5 max-w-[28ch] text-[12.5px] leading-relaxed text-white/35">
                  {PROFILE.tagline}
                </p>
                <button
                  type="button"
                  onClick={() => openApp("terminal")}
                  data-todd-safe
                  className="mt-8 rounded-2xl border border-[var(--os-lime)]/35 bg-[var(--os-lime)]/[0.08] px-5 py-3 font-mono text-[12px] text-[var(--os-lime)]"
                >
                  todd@moosa:~$ open terminal
                </button>
                <div className="mt-5 flex items-center gap-5 text-[12px] text-white/40">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    data-todd-safe
                    className="transition hover:text-white/75"
                  >
                    Email
                  </a>
                  <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden />
                  <a
                    href={PROFILE.resumePdf}
                    download
                    data-todd-safe
                    className="transition hover:text-white/75"
                  >
                    Resume
                  </a>
                </div>
              </div>
            )}
            <MobileSheet />
          </>
        )}
      </main>

      <Dock layout={layout} />

      {/* Full-viewport stage so landmark rects match Todd transforms */}
      <ToddStage layout={layout} viewport={viewport} />
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
