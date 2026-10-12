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

/** Geometry tuned so Terminal is the centered hero window */
export const DEFAULT_WINDOW_GEOMETRY: Record<
  AppId,
  { x: number; y: number; width: number; height: number }
> = {
  terminal: { x: 280, y: 120, width: 720, height: 420 },
  about: { x: 96, y: 88, width: 520, height: 480 },
  projects: { x: 160, y: 100, width: 560, height: 460 },
  experience: { x: 200, y: 80, width: 540, height: 500 },
  skills: { x: 240, y: 110, width: 500, height: 440 },
  education: { x: 180, y: 120, width: 480, height: 400 },
  resume: { x: 140, y: 64, width: 640, height: 540 },
  contact: { x: 360, y: 140, width: 420, height: 360 },
};
