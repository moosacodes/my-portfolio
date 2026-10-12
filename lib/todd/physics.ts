export type Vec2 = { x: number; y: number };

export type PhysicsBody = {
  pos: Vec2;
  vel: Vec2;
  grounded: boolean;
};

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  floorY: number;
};

export type Landmark = {
  id: string;
  kind: "perch" | "floor" | "hide" | "dock";
  x: number;
  y: number;
  width?: number;
};

const GRAVITY = 2200;
const MAX_FALL = 1400;

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function integrate(
  body: PhysicsBody,
  dt: number,
  bounds: Bounds,
  opts: { flying?: boolean } = {}
): PhysicsBody {
  let { x, y } = body.pos;
  let { x: vx, y: vy } = body.vel;
  let grounded = body.grounded;

  if (!opts.flying) {
    vy = Math.min(MAX_FALL, vy + GRAVITY * dt);
  }

  x += vx * dt;
  y += vy * dt;

  // horizontal friction when grounded
  if (grounded && !opts.flying) {
    vx *= Math.pow(0.05, dt);
    if (Math.abs(vx) < 4) vx = 0;
  }

  x = clamp(x, bounds.minX, bounds.maxX);

  if (y >= bounds.floorY) {
    y = bounds.floorY;
    if (vy > 80) {
      // bounce
      vy = -vy * 0.28;
      grounded = false;
    } else {
      vy = 0;
      grounded = true;
    }
  } else {
    grounded = false;
  }

  y = clamp(y, bounds.minY, bounds.maxY);

  return { pos: { x, y }, vel: { x: vx, y: vy }, grounded };
}

export function jumpImpulse(
  body: PhysicsBody,
  power = 720
): PhysicsBody {
  return {
    ...body,
    grounded: false,
    vel: { x: body.vel.x, y: -power },
  };
}

export function runToward(
  body: PhysicsBody,
  target: Vec2,
  speed: number,
  dt: number
): PhysicsBody {
  const dx = target.x - body.pos.x;
  const dir = Math.sign(dx) || 0;
  const dist = Math.abs(dx);
  const arrive = Math.min(speed, dist * 3.2);
  const desired = dir * arrive;
  const vx = body.vel.x + (desired - body.vel.x) * Math.min(1, dt * 8);
  return {
    ...body,
    vel: { x: vx, y: body.vel.y },
  };
}

export function readLandmarks(vw: number, vh: number, size: number): Landmark[] {
  const marks: Landmark[] = [
    {
      id: "desktop-center",
      kind: "floor",
      x: vw * 0.5 - size / 2,
      y: vh - 140 - size,
    },
    {
      id: "desktop-left",
      kind: "floor",
      x: 48,
      y: vh - 140 - size,
    },
    {
      id: "desktop-right",
      kind: "floor",
      x: vw - size - 48,
      y: vh - 140 - size,
    },
  ];

  document.querySelectorAll<HTMLElement>("[data-todd-window]").forEach((el) => {
    const id = el.dataset.toddWindow || "window";
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 40) return;
    marks.push({
      id: `perch-${id}`,
      kind: "perch",
      x: clamp(r.right - size * 0.65, 8, vw - size - 8),
      y: clamp(r.top - size * 0.55, 48, vh - 120 - size),
      width: r.width,
    });
    marks.push({
      id: `hide-${id}`,
      kind: "hide",
      x: clamp(r.left - size * 0.35, 8, vw - size - 8),
      y: clamp(r.top + r.height * 0.35, 48, vh - 120 - size),
    });
  });

  const dock = document.querySelector<HTMLElement>("[data-todd-landmark='dock']");
  if (dock) {
    const r = dock.getBoundingClientRect();
    marks.push({
      id: "dock",
      kind: "dock",
      x: clamp(r.left + r.width * 0.5 - size / 2, 8, vw - size - 8),
      y: clamp(r.top - size + 10, 48, vh - size - 8),
    });
  }

  return marks;
}
