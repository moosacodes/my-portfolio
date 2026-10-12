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
const STATUS_H = 44;

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
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`absolute flex flex-col overflow-visible rounded-xl outline-none ${
        isFocused ? "opacity-100" : "opacity-90"
      }`}
      style={{
        ...style,
        zIndex: w.z,
      }}
    >
      {/* Overflow visible so Todd can peek; inner shell clips content */}
      <div
        className={`glass-panel flex h-full flex-col overflow-hidden rounded-xl ${
          isFocused
            ? "border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
            : "border-white/8"
        }`}
      >
        <div
          className="flex h-10 shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-black/25 px-3 active:cursor-grabbing"
          data-todd-landmark="window-perch"
          data-todd-perch={id}
          onPointerDown={onPointerDownTitle}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Close ${meta.title}`}
              onClick={() => closeApp(id)}
              className="h-3 w-3 rounded-full bg-[#ff5f57] hover:brightness-110"
              data-todd-safe
            />
            <button
              type="button"
              aria-label={`Minimize ${meta.title}`}
              onClick={() => minimizeApp(id)}
              className="h-3 w-3 rounded-full bg-[#febc2e] hover:brightness-110"
              data-todd-safe
            />
            <button
              type="button"
              aria-label={`Maximize ${meta.title}`}
              onClick={() => toggleMaximize(id)}
              className="h-3 w-3 rounded-full bg-[#28c840] hover:brightness-110"
              data-todd-safe
            />
          </div>
          <span className="flex-1 truncate text-center font-mono text-xs text-zinc-300">
            {title}
          </span>
          {isTerminal ? (
            <button
              type="button"
              className="w-8 text-center text-zinc-500 hover:text-white"
              aria-label="New tab (cosmetic)"
              data-todd-safe
              tabIndex={-1}
            >
              +
            </button>
          ) : (
            <span className="w-8" aria-hidden />
          )}
        </div>
        <div className="relative min-h-0 flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
