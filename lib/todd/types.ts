export type ToddState =
  | "idle"
  | "look"
  | "blink"
  | "walk"
  | "hop"
  | "startled"
  | "dragged"
  | "dance"
  | "sleep"
  | "hide"
  | "fall"
  | "commanded";

export type ToddPriority =
  | "dragged"
  | "startled"
  | "commanded"
  | "autonomous"
  | "idle";

export const STATE_PRIORITY: Record<ToddState, ToddPriority> = {
  dragged: "dragged",
  startled: "startled",
  commanded: "commanded",
  dance: "commanded",
  sleep: "commanded",
  fall: "commanded",
  walk: "autonomous",
  hop: "autonomous",
  hide: "autonomous",
  look: "autonomous",
  blink: "idle",
  idle: "idle",
};

export const PRIORITY_RANK: Record<ToddPriority, number> = {
  dragged: 5,
  startled: 4,
  commanded: 3,
  autonomous: 2,
  idle: 1,
};

export type ToddCommand =
  | "dance"
  | "sleep"
  | "come"
  | "status"
  | "chaos"
  | "help"
  | "pause"
  | "resume";

export type LandmarkId =
  | "dock"
  | "status"
  | "desktop-corner"
  | "window-perch"
  | "hide-spot";
