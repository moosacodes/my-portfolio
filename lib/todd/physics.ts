export type Vec2 = { x: number; y: number };

export type PhysicsBody = {
  pos: Vec2;
  vel: Vec2;
  grounded: boolean;
  /** Platform id under feet, if any */
  platformId?: string | null;
};

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  floorY: number;
};

export type Platform = {
  id: string;
  kind: "window" | "dock" | "floor";
  /** left edge */
  x: number;
  /** top surface Y (Todd's feet / bottom should rest here minus size offset — we store perch Y for Todd top-left) */
  y: number;
  width: number;
  /** perch position for Todd (top-left of sprite) */
  perchX: number;
  perchY: number;
};

export type Landmark = {
  id: string;
  kind: "perch" | "floor" | "hide" | "dock" | "wander";
  x: number;
  y: number;
  width?: number;
  platformId?: string;
};

const GRAVITY = 2400;
const MAX_FALL = 1600;
const GROUND_FRICTION = 0.0008; // exponential base per-second feel via pow

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function dist(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function integrate(
  body: PhysicsBody,
  dt: number,
  bounds: Bounds,
  platforms: Platform[],
  opts: { flying?: boolean; size: number } = { size: 152 }
): PhysicsBody {
  let { x, y } = body.pos;
  let { x: vx, y: vy } = body.vel;
  let grounded = false;
  let platformId: string | null = null;

  if (!opts.flying) {
    vy = Math.min(MAX_FALL, vy + GRAVITY * dt);
  }

  const prevY = y;
  x += vx * dt;
  y += vy * dt;

  x = clamp(x, bounds.minX, bounds.maxX);

  // Floor (bounds.floorY = Todd top-left when standing)
  if (y >= bounds.floorY) {
    y = bounds.floorY;
    if (vy > 120) {
      vy = -vy * 0.22;
      grounded = false;
    } else {
      vy = 0;
      grounded = true;
      platformId = "floor";
    }
  }

  // Window / dock platforms — land when falling onto top edge
  if (vy >= 0) {
    for (const p of platforms) {
      if (p.kind === "floor") continue;
      const left = p.x;
      const right = p.x + p.width;
      const surface = p.perchY;
      const cx = x + opts.size * 0.5;
      const wasAbove = prevY + opts.size * 0.15 <= surface + 6;
      const nowOn = y >= surface - 2 && y <= surface + 18;
      if (wasAbove && nowOn && cx >= left - 8 && cx <= right + 8) {
        y = surface;
        if (vy > 140) {
          vy = -vy * 0.18;
          grounded = false;
        } else {
          vy = 0;
          grounded = true;
          platformId = p.id;
          // light horizontal damp on land
          vx *= 0.55;
        }
        break;
      }
    }
  }

  if (grounded && !opts.flying) {
    vx *= Math.pow(GROUND_FRICTION, dt);
    if (Math.abs(vx) < 6) vx = 0;
  }

  y = clamp(y, bounds.minY, bounds.maxY);
  if (y <= bounds.minY && vy < 0) vy = 0;

  return {
    pos: { x, y },
    vel: { x: vx, y: vy },
    grounded,
    platformId,
  };
}

export function jumpImpulse(body: PhysicsBody, power = 720): PhysicsBody {
  return {
    ...body,
    grounded: false,
    platformId: null,
    vel: { x: body.vel.x, y: -Math.abs(power) },
  };
}

/** Accelerate horizontally toward a target X with accel/decel (no snap). */
export function steerX(
  body: PhysicsBody,
  targetX: number,
  speed: number,
  dt: number,
  accel = 10
): PhysicsBody {
  const dx = targetX - body.pos.x;
  const dir = Math.sign(dx) || 0;
  const abs = Math.abs(dx);
  // Ease down near arrival
  const cap = abs < 80 ? speed * (abs / 80) : speed;
  const desired = dir * cap;
  const vx = body.vel.x + (desired - body.vel.x) * Math.min(1, dt * accel);
  return { ...body, vel: { x: vx, y: body.vel.y } };
}

/** Estimate jump power to reach a higher perch. */
export function jumpPowerForHeight(dy: number) {
  // dy positive means target is above (smaller y)
  const rise = Math.max(0, -dy);
  return clamp(520 + rise * 3.2, 480, 980);
}

export function readPlatforms(
  vw: number,
  vh: number,
  size: number
): Platform[] {
  const floorY = Math.max(52, vh - 108 - size + 6);
  const platforms: Platform[] = [
    {
      id: "floor",
      kind: "floor",
      x: 0,
      y: floorY,
      width: vw,
      perchX: vw * 0.5 - size / 2,
      perchY: floorY,
    },
  ];

  document.querySelectorAll<HTMLElement>("[data-todd-window]").forEach((el) => {
    const id = el.dataset.toddWindow || "window";
    const r = el.getBoundingClientRect();
    if (r.width < 80 || r.height < 60) return;
    // Prefer right edge perch (mockup)
    const perchX = clamp(r.right - size * 0.72, 8, vw - size - 8);
    const perchY = clamp(r.top - size * 0.52, 44, vh - 120 - size);
    platforms.push({
      id: `window-${id}`,
      kind: "window",
      x: r.left,
      y: r.top,
      width: r.width,
      perchX,
      perchY,
    });
  });

  const dock = document.querySelector<HTMLElement>("[data-todd-landmark='dock']");
  if (dock) {
    const r = dock.getBoundingClientRect();
    platforms.push({
      id: "dock",
      kind: "dock",
      x: r.left,
      y: r.top,
      width: r.width,
      perchX: clamp(r.left + r.width * 0.5 - size / 2, 8, vw - size - 8),
      perchY: clamp(r.top - size + 14, 44, vh - size - 8),
    });
  }

  return platforms;
}

export function readLandmarks(vw: number, vh: number, size: number): Landmark[] {
  const platforms = readPlatforms(vw, vh, size);
  const marks: Landmark[] = [];

  for (const p of platforms) {
    if (p.kind === "window") {
      marks.push({
        id: `perch-${p.id.replace("window-", "")}`,
        kind: "perch",
        x: p.perchX,
        y: p.perchY,
        width: p.width,
        platformId: p.id,
      });
      // Hide: peek from left of window
      marks.push({
        id: `hide-${p.id.replace("window-", "")}`,
        kind: "hide",
        x: clamp(p.x - size * 0.4, 8, vw - size - 8),
        y: clamp(p.y + 48, 44, vh - 140 - size),
        platformId: p.id,
      });
    } else if (p.kind === "dock") {
      marks.push({
        id: "dock",
        kind: "dock",
        x: p.perchX,
        y: p.perchY,
        platformId: p.id,
      });
    } else if (p.kind === "floor") {
      marks.push(
        {
          id: "floor-left",
          kind: "floor",
          x: 48,
          y: p.perchY,
          platformId: "floor",
        },
        {
          id: "floor-center",
          kind: "wander",
          x: vw * 0.5 - size / 2,
          y: p.perchY,
          platformId: "floor",
        },
        {
          id: "floor-right",
          kind: "floor",
          x: vw - size - 48,
          y: p.perchY,
          platformId: "floor",
        }
      );
    }
  }

  return marks;
}

export function pickLandmark(
  marks: Landmark[],
  opts: {
    prefer?: Landmark["kind"][];
    avoidId?: string | null;
    from?: Vec2;
    minDist?: number;
  } = {}
): Landmark | null {
  let pool = marks;
  if (opts.prefer?.length) {
    const pref = marks.filter((m) => opts.prefer!.includes(m.kind));
    if (pref.length) pool = pref;
  }
  if (opts.avoidId) pool = pool.filter((m) => m.id !== opts.avoidId);
  if (opts.from && opts.minDist) {
    const far = pool.filter(
      (m) => dist(opts.from!, { x: m.x, y: m.y }) >= opts.minDist!
    );
    if (far.length) pool = far;
  }
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}
