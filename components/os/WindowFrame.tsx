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

const TITLE_H = 36;
const DOCK_CLEARANCE = 88;
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
  const dragRef = useRef<{
    ox: number;
    oy: number;
    sx: number;
    sy: number;
  } | null>(null);

  const clampPos = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const maxX = Math.max(8, viewport.width - 80);
      const maxY = Math.max(
        STATUS_H,
        viewport.height - DOCK_CLEARANCE - 40
      );
      return {
        x: Math.min(Math.max(x, -width + 80), maxX),
        y: Math.min(Math.max(y, STATUS_H), maxY),
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
      w.width,
      w.height
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
    const next = clampPos(w.x, w.y, w.width, w.height);
    if (next.x !== w.x || next.y !== w.y) {
      moveWindow(id, next.x, next.y);
    }
  }, [
    viewport.width,
    viewport.height,
    w.open,
    w.minimized,
    w.maximized,
    w.x,
    w.y,
    w.width,
    w.height,
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
        left: 8,
        top: STATUS_H + 8,
        width: viewport.width - 16,
        height: viewport.height - STATUS_H - DOCK_CLEARANCE - 8,
      }
    : {
        left: w.x,
        top: w.y,
        width: w.width,
        height: Math.min(w.height, viewport.height - STATUS_H - DOCK_CLEARANCE),
      };

  return (
    <motion.div
      role="dialog"
      aria-label={meta.title}
      aria-modal={false}
      data-todd-window={id}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onPointerDown={() => focusApp(id)}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`absolute flex flex-col overflow-hidden rounded-xl border shadow-2xl outline-none ${
        isFocused
          ? "border-white/25 shadow-black/50"
          : "border-white/10 shadow-black/30 opacity-95"
      } bg-[var(--os-window)]`}
      style={{
        ...style,
        zIndex: w.z,
      }}
    >
      <div
        className="flex h-9 shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-black/30 px-2 active:cursor-grabbing"
        data-todd-landmark="window-perch"
        onPointerDown={onPointerDownTitle}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Close ${meta.title}`}
            onClick={() => closeApp(id)}
            className="h-3 w-3 rounded-full bg-red-500/90 hover:bg-red-400"
            data-todd-safe
          />
          <button
            type="button"
            aria-label={`Minimize ${meta.title}`}
            onClick={() => minimizeApp(id)}
            className="h-3 w-3 rounded-full bg-amber-400/90 hover:bg-amber-300"
            data-todd-safe
          />
          <button
            type="button"
            aria-label={`Maximize ${meta.title}`}
            onClick={() => toggleMaximize(id)}
            className="h-3 w-3 rounded-full bg-emerald-500/90 hover:bg-emerald-400"
            data-todd-safe
          />
        </div>
        <span className="flex-1 truncate text-center text-xs font-medium text-zinc-300">
          {meta.icon} {meta.title}
        </span>
        <span className="w-14" aria-hidden />
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto p-4"
        style={{ maxHeight: `calc(100% - ${TITLE_H}px)` }}
      >
        {children}
      </div>
    </motion.div>
  );
}
