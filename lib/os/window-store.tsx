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

function centerTerminal(vw: number, vh: number) {
  // Mockup-like hero terminal: large, readable, intentionally composed
  const width = Math.min(920, Math.max(560, vw * 0.68));
  const height = Math.min(560, Math.max(360, vh * 0.58));
  return {
    width: Math.round(width),
    height: Math.round(height),
    x: Math.round((vw - width) / 2),
    y: Math.round(Math.max(64, (vh - height) / 2 - 12)),
  };
}

function buildInitial(vw = 1280, vh = 800): Record<AppId, WindowState> {
  const out = {} as Record<AppId, WindowState>;
  let z = 1;
  const term = centerTerminal(vw, vh);
  for (const id of ALL_APPS) {
    const g = id === "terminal" ? term : DEFAULT_WINDOW_GEOMETRY[id];
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
      const term = centerTerminal(window.innerWidth, window.innerHeight);
      setWindows((prev) => {
        if (prev.terminal.maximized) return prev;
        return {
          ...prev,
          terminal: {
            ...prev.terminal,
            ...term,
          },
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
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], open: true, minimized: false },
      }));
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
