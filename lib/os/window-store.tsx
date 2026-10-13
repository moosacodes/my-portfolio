"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ALL_APPS, type AppId } from "@/lib/portfolio/data";
import {
  DEFAULT_WINDOW_GEOMETRY,
  type WindowState,
} from "@/lib/os/types";

type WindowStore = {
  windows: Record<AppId, WindowState>;
  focused: AppId | null;
  mobileActive: AppId | null;
  zCounter: number;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  setMobileActive: (id: AppId | null) => void;
  getOpenStack: () => AppId[];
};

const WindowContext = createContext<WindowStore | null>(null);

/** Tight hero terminal — hugs content, leaves room for Todd on the right lip */
function centerTerminal(vw: number, vh: number) {
  const width = Math.min(820, Math.max(580, vw * 0.54));
  const height = Math.min(400, Math.max(320, vh * 0.44));
  return {
    width: Math.round(width),
    height: Math.round(height),
    x: Math.round((vw - width) / 2 - 28),
    y: Math.round(Math.max(100, vh * 0.18)),
  };
}

function centerContent(vw: number, vh: number, id: AppId) {
  const base = DEFAULT_WINDOW_GEOMETRY[id];
  const width = Math.min(base.width, Math.max(440, vw * 0.44));
  const height = Math.min(base.height, Math.max(380, vh * 0.62));
  return {
    width: Math.round(width),
    height: Math.round(height),
    x: Math.round((vw - width) / 2),
    y: Math.round(Math.max(80, (vh - height) / 2 - 12)),
  };
}

function buildInitial(vw = 1280, vh = 800): Record<AppId, WindowState> {
  const out = {} as Record<AppId, WindowState>;
  let z = 1;
  const term = centerTerminal(vw, vh);
  for (const id of ALL_APPS) {
    const g = id === "terminal" ? term : centerContent(vw, vh, id);
    out[id] = {
      id,
      open: id === "terminal",
      minimized: false,
      maximized: false,
      x: g.x,
      y: g.y,
      width: g.width,
      height: g.height,
      z: id === "terminal" ? 30 : z++,
    };
  }
  return out;
}

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState(() => buildInitial());
  const [focused, setFocused] = useState<AppId | null>("terminal");
  const [mobileActive, setMobileActive] = useState<AppId | null>(null);
  const [zCounter, setZCounter] = useState(30);

  useEffect(() => {
    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const term = centerTerminal(vw, vh);
      setWindows((prev) => {
        if (prev.terminal.maximized) return prev;
        return {
          ...prev,
          terminal: { ...prev.terminal, ...term },
        };
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  const focusApp = useCallback((id: AppId) => {
    setZCounter((z) => {
      const next = z + 1;
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], z: next, minimized: false, open: true },
      }));
      return next;
    });
    setFocused(id);
    setMobileActive(id);
  }, []);

  const openApp = useCallback(
    (id: AppId) => {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const centered =
        id === "terminal" ? centerTerminal(vw, vh) : centerContent(vw, vh, id);

      setWindows((prev) => {
        const next = { ...prev };
        for (const other of ALL_APPS) {
          if (other !== id && next[other].open && !next[other].minimized) {
            next[other] = { ...next[other], minimized: true };
          }
        }
        next[id] = {
          ...next[id],
          open: true,
          minimized: false,
          maximized: false,
          ...centered,
        };
        return next;
      });
      focusApp(id);
    },
    [focusApp]
  );

  const closeApp = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false, minimized: false, maximized: false },
    }));
    setFocused((f) => (f === id ? null : f));
    setMobileActive((m) => (m === id ? null : m));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));
    setFocused((f) => (f === id ? null : f));
  }, []);

  const toggleMaximize = useCallback(
    (id: AppId) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], maximized: !prev[id].maximized, minimized: false },
      }));
      focusApp(id);
    },
    [focusApp]
  );

  const moveWindow = useCallback((id: AppId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], x, y, maximized: false },
    }));
  }, []);

  const getOpenStack = useCallback(() => {
    return ALL_APPS.filter(
      (id) => windows[id].open && !windows[id].minimized
    ).sort((a, b) => windows[a].z - windows[b].z);
  }, [windows]);

  const value = useMemo(
    () => ({
      windows,
      focused,
      mobileActive,
      zCounter,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMaximize,
      moveWindow,
      setMobileActive,
      getOpenStack,
    }),
    [
      windows,
      focused,
      mobileActive,
      zCounter,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMaximize,
      moveWindow,
      getOpenStack,
    ]
  );

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used within WindowProvider");
  return ctx;
}
