"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { APP_META, type AppId } from "@/lib/portfolio/data";
import { useWindows } from "@/lib/os/window-store";
type Props = {
  id: AppId;
  children: ReactNode;
  viewport: { width: number; height: number };
};

const DOCK_CLEARANCE = 96;
const STATUS_H = 40;

export function WindowFrame({ id, children, viewport }: Props) {
  const {
    windows,
    focused,
    focusApp,
    closeApp,
    minimizeApp,
    toggleMaximize,
    moveWindow,
  } = useWindows();
  const w = windows[id];
  const meta = APP_META[id];
  const isTerminal = id === "terminal";
  const dragRef = useRef<{
    ox: number;
    oy: number;
    sx: number;
    sy: number;
  } | null>(null);

  const clampPos = useCallback(
    (x: number, y: number, width: number) => {
      const maxX = Math.max(8, viewport.width - 80);
      const maxY = Math.max(STATUS_H, viewport.height - DOCK_CLEARANCE - 40);
      return {
        x: Math.min(Math.max(x, -width + 80), maxX),
        y: Math.min(Math.max(y, STATUS_H + 4), maxY),
      };
    },
    [viewport.width, viewport.height]
  );

  const onPointerDownTitle = (e: ReactPointerEvent) => {
    if (w.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    focusApp(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      ox: e.clientX,
      oy: e.clientY,
      sx: w.x,
      sy: w.y,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.ox;
    const dy = e.clientY - dragRef.current.oy;
    const next = clampPos(
      dragRef.current.sx + dx,
      dragRef.current.sy + dy,
      w.width
    );
    moveWindow(id, next.x, next.y);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!w.open || w.minimized || w.maximized) return;
    const next = clampPos(w.x, w.y, w.width);
    if (next.x !== w.x || next.y !== w.y) moveWindow(id, next.x, next.y);
  }, [
    viewport.width,
    viewport.height,
    w.open,
    w.minimized,
    w.maximized,
    w.x,
    w.y,
    w.width,
    clampPos,
    moveWindow,
    id,
  ]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      minimizeApp(id);
    }
  };

  if (!w.open || w.minimized) return null;

  const isFocused = focused === id;
  const style = w.maximized
    ? {
        left: 12,
        top: STATUS_H + 12,
        width: viewport.width - 24,
        height: viewport.height - STATUS_H - DOCK_CLEARANCE - 8,
      }
    : {
        left: w.x,
        top: w.y,
        width: w.width,
        height: Math.min(w.height, viewport.height - STATUS_H - DOCK_CLEARANCE),
      };

  const title = isTerminal ? "todd@moosa ~" : meta.title;

  return (
    <motion.div
      role="dialog"
      aria-label={meta.title}
      aria-modal={false}
      data-todd-window={id}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onPointerDown={() => focusApp(id)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="absolute flex flex-col overflow-visible outline-none"
      style={{
        ...style,
        zIndex: w.z,
      }}
    >
      <div
        className={`glass-panel flex h-full flex-col overflow-hidden rounded-[24px] ${
          isTerminal && isFocused ? "glass-panel-hero" : ""
        } ${isFocused ? "glass-panel-focus" : "opacity-[0.98]"}`}
      >
        <div
          className="relative flex h-11 shrink-0 cursor-grab items-center border-b border-white/[0.06] bg-black/40 px-4 active:cursor-grabbing"
          data-todd-landmark="window-perch"
          data-todd-perch={id}
          onPointerDown={onPointerDownTitle}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="z-10 flex items-center gap-2">
            <button
              type="button"
              aria-label={`Close ${meta.title}`}
              onClick={() => closeApp(id)}
              className="h-[13px] w-[13px] rounded-full bg-[#ff5f57] shadow-[0_0_0_0.5px_rgba(0,0,0,0.35)] hover:brightness-110"
              data-todd-safe
            />
            <button
              type="button"
              aria-label={`Minimize ${meta.title}`}
              onClick={() => minimizeApp(id)}
              className="h-[13px] w-[13px] rounded-full bg-[#febc2e] shadow-[0_0_0_0.5px_rgba(0,0,0,0.35)] hover:brightness-110"
              data-todd-safe
            />
            <button
              type="button"
              aria-label={`Maximize ${meta.title}`}
              onClick={() => toggleMaximize(id)}
              className="h-[13px] w-[13px] rounded-full bg-[#28c840] shadow-[0_0_0_0.5px_rgba(0,0,0,0.35)] hover:brightness-110"
              data-todd-safe
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] tracking-wide text-white/40">
            {title}
          </span>
          {isTerminal ? (
            <button
              type="button"
              className="z-10 ml-auto w-8 text-center text-[16px] text-white/25 hover:text-white/65"
              aria-label="New tab (cosmetic)"
              data-todd-safe
              tabIndex={-1}
            >
              +
            </button>
          ) : (
            <span className="ml-auto w-8" aria-hidden />
          )}
        </div>
        <div
          className={`relative min-h-0 flex-1 overflow-y-auto ${
            isTerminal
              ? "bg-[radial-gradient(ellipse_70%_45%_at_50%_115%,rgba(110,170,55,0.1),transparent_62%)] px-7 py-6 sm:px-8 sm:py-7"
              : "p-6 sm:p-7"
          }`}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
