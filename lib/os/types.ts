import type { AppId } from "@/lib/portfolio/data";

export type WindowState = {
  id: AppId;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
};

export type DesktopLayout = "desktop" | "mobile";

export const DEFAULT_WINDOW_GEOMETRY: Record<
  AppId,
  { x: number; y: number; width: number; height: number }
> = {
  about: { x: 72, y: 64, width: 520, height: 480 },
  projects: { x: 140, y: 88, width: 560, height: 460 },
  experience: { x: 200, y: 72, width: 540, height: 500 },
  skills: { x: 260, y: 100, width: 500, height: 440 },
  education: { x: 180, y: 110, width: 480, height: 400 },
  terminal: { x: 320, y: 140, width: 580, height: 380 },
  resume: { x: 100, y: 56, width: 640, height: 560 },
  contact: { x: 360, y: 160, width: 420, height: 360 },
};
