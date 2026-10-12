/**
 * Extract animation layers from todd-original.png (RGBA).
 * Outputs to public/todd/layers/ — fuzzy texture preserved from source pixels.
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public/todd/todd-original.png");
const OUT = path.join(ROOT, "public/todd/layers");

function readPng(file) {
  const buf = fs.readFileSync(file);
  let o = 8;
  const chunks = [];
  while (o < buf.length) {
    const len = buf.readUInt32BE(o);
    const type = buf.slice(o + 4, o + 8).toString();
    const data = buf.slice(o + 8, o + 8 + len);
    chunks.push({ type, data });
    o += 12 + len;
  }
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const w = ihdr.readUInt32BE(0);
  const h = ihdr.readUInt32BE(4);
  const compressed = Buffer.concat(
    chunks.filter((c) => c.type === "IDAT").map((c) => c.data)
  );
  const raw = zlib.inflateSync(compressed);
  const bpp = 4;
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let i = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[i++];
    const row = raw.subarray(i, i + stride);
    i += stride;
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : null;
    const dest = out.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const left = x >= bpp ? dest[x - bpp] : 0;
      const up = prev ? prev[x] : 0;
      const upleft = prev && x >= bpp ? prev[x - bpp] : 0;
      let v = row[x];
      if (filter === 1) v = (v + left) & 255;
      else if (filter === 2) v = (v + up) & 255;
      else if (filter === 3) v = (v + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upleft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upleft);
        v = (v + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upleft)) & 255;
      }
      dest[x] = v;
    }
  }
  return { w, h, data: out };
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function writePng(file, w, h, rgba) {
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const out = Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(file, out);
}

function get(img, x, y) {
  const o = (y * img.w + x) * 4;
  return [img.data[o], img.data[o + 1], img.data[o + 2], img.data[o + 3]];
}

function set(buf, w, x, y, r, g, b, a) {
  const o = (y * w + x) * 4;
  buf[o] = r;
  buf[o + 1] = g;
  buf[o + 2] = b;
  buf[o + 3] = a;
}

const img = readPng(SRC);
fs.mkdirSync(OUT, { recursive: true });

// Detect white eye clusters
const whites = [];
for (let y = 60; y < 210; y++) {
  for (let x = 80; x < 420; x++) {
    const [r, g, b, a] = get(img, x, y);
    if (a > 200 && r > 210 && g > 210 && b > 210) whites.push([x, y]);
  }
}
const midX = whites.reduce((s, p) => s + p[0], 0) / whites.length;
function clusterBounds(pts) {
  let minX = 1e9,
    maxX = 0,
    minY = 1e9,
    maxY = 0,
    sx = 0,
    sy = 0;
  for (const [x, y] of pts) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    sx += x;
    sy += y;
  }
  return {
    minX,
    maxX,
    minY,
    maxY,
    cx: Math.round(sx / pts.length),
    cy: Math.round(sy / pts.length),
    w: maxX - minX + 1,
    h: maxY - minY + 1,
  };
}
const leftEye = clusterBounds(whites.filter((p) => p[0] < midX));
const rightEye = clusterBounds(whites.filter((p) => p[0] >= midX));

// Sample fuzzy green near eyes for inpainting / lids
function sampleGreenNear(eye, n = 80) {
  const samples = [];
  for (let y = eye.minY - 30; y <= eye.maxY + 40; y++) {
    for (let x = eye.minX - 40; x <= eye.maxX + 40; x++) {
      if (x < 0 || y < 0 || x >= img.w || y >= img.h) continue;
      const [r, g, b, a] = get(img, x, y);
      if (a < 220) continue;
      if (g > 140 && g > r + 20 && g > b + 40 && !(r > 200 && g > 200 && b > 200)) {
        samples.push([r, g, b, a]);
      }
    }
  }
  if (!samples.length) return [140, 200, 40, 255];
  // pick median-ish sample
  return samples[Math.floor(samples.length / 2)];
}

function inCircle(x, y, cx, cy, rx, ry) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function fillEye(dest, eye, greenSamples) {
  const rx = eye.w * 0.55;
  const ry = eye.h * 0.55;
  for (let y = eye.minY - 8; y <= eye.maxY + 8; y++) {
    for (let x = eye.minX - 8; x <= eye.maxX + 8; x++) {
      if (!inCircle(x, y, eye.cx, eye.cy, rx, ry)) continue;
      const [r, g, b, a] = get(img, x, y);
      // replace sclera + pupil with fuzzy green
      if (a > 180 && ((r > 180 && g > 180 && b > 180) || (r < 60 && g < 60 && b < 60))) {
        const s = greenSamples[(x * 13 + y * 7) % greenSamples.length];
        set(dest, img.w, x, y, s[0], s[1], s[2], 255);
      }
    }
  }
}

const greenL = [];
const greenR = [];
for (let i = 0; i < 120; i++) {
  greenL.push(sampleGreenNear(leftEye));
  greenR.push(sampleGreenNear(rightEye));
}

// Body with eyes filled
const body = Buffer.from(img.data);
fillEye(body, leftEye, greenL);
fillEye(body, rightEye, greenR);
writePng(path.join(OUT, "body.png"), img.w, img.h, body);

// Extract circular eye whites (full eye socket crop)
function extractEyeWhite(eye, name) {
  const pad = 4;
  const w = eye.w + pad * 2;
  const h = eye.h + pad * 2;
  const buf = Buffer.alloc(w * h * 4);
  const rx = eye.w * 0.52;
  const ry = eye.h * 0.52;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = eye.minX - pad + x;
      const sy = eye.minY - pad + y;
      if (sx < 0 || sy < 0 || sx >= img.w || sy >= img.h) continue;
      if (!inCircle(sx, sy, eye.cx, eye.cy, rx, ry)) continue;
      const [r, g, b, a] = get(img, sx, sy);
      // keep white + soft edge; clear green rim
      if (a > 180 && r > 160 && g > 160 && b > 160) {
        set(buf, w, x, y, r, g, b, a);
      } else if (a > 180 && r < 50 && g < 50 && b < 50) {
        // fill pupil hole with white so pupil layer sits on clean sclera
        set(buf, w, x, y, 248, 248, 246, 255);
      }
    }
  }
  writePng(path.join(OUT, name), w, h, buf);
  return { w, h, cx: eye.cx, cy: eye.cy, pad };
}

const leftWhite = extractEyeWhite(leftEye, "eye-white-l.png");
const rightWhite = extractEyeWhite(rightEye, "eye-white-r.png");

// Extract pupils (black + catchlights) into square canvas
function extractPupil(eye, name) {
  const size = Math.max(eye.w, eye.h);
  const buf = Buffer.alloc(size * size * 4);
  const ox = Math.floor((size - eye.w) / 2) - eye.minX;
  const oy = Math.floor((size - eye.h) / 2) - eye.minY;
  for (let y = eye.minY; y <= eye.maxY; y++) {
    for (let x = eye.minX; x <= eye.maxX; x++) {
      const [r, g, b, a] = get(img, x, y);
      if (a < 180) continue;
      // pupil + highlights (bright spots on dark)
      const isDark = r < 55 && g < 55 && b < 55;
      const isHighlight = r > 220 && g > 220 && b > 220 &&
        // highlight only near pupil center band
        Math.hypot(x - eye.cx, y - eye.cy) < eye.w * 0.35;
      // Also grab highlight pixels adjacent to dark
      if (isDark || (isHighlight && Math.hypot(x - eye.cx, y - eye.cy) < eye.w * 0.28)) {
        // for highlights inside pupil region from original - actually highlights are white on black
      }
      if (isDark) {
        set(buf, size, x + ox, y + oy, r, g, b, a);
      }
    }
  }
  // re-add catchlights from original near pupil center
  for (let y = eye.minY; y <= eye.maxY; y++) {
    for (let x = eye.minX; x <= eye.maxX; x++) {
      const [r, g, b, a] = get(img, x, y);
      if (a > 200 && r > 230 && g > 230 && b > 230) {
        // only if surrounded by dark (catchlight on pupil)
        let darkN = 0;
        for (let dy = -3; dy <= 3; dy++)
          for (let dx = -3; dx <= 3; dx++) {
            const [rr, gg, bb, aa] = get(img, x + dx, y + dy);
            if (aa > 200 && rr < 50 && gg < 50 && bb < 50) darkN++;
          }
        if (darkN > 6) set(buf, size, x + ox, y + oy, r, g, b, a);
      }
    }
  }
  writePng(path.join(OUT, name), size, size, buf);
  return { size, ox, oy };
}

extractPupil(leftEye, "pupil-l.png");
extractPupil(rightEye, "pupil-r.png");

// Lid: circular fuzzy green crop from forehead/cheek
function makeLid(eye, name) {
  const size = Math.max(eye.w, eye.h) + 12;
  const buf = Buffer.alloc(size * size * 4);
  // sample region beside eye (cheek)
  const srcCx = eye.cx;
  const srcCy = eye.maxY + 28;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - size / 2;
      const dy = y - size / 2;
      if (dx * dx + dy * dy > (size / 2) * (size / 2)) continue;
      const sx = Math.round(srcCx + dx * 0.9);
      const sy = Math.round(srcCy + dy * 0.55);
      if (sx < 0 || sy < 0 || sx >= img.w || sy >= img.h) continue;
      let [r, g, b, a] = get(img, sx, sy);
      // if we hit non-green, wander
      if (a < 200 || !(g > 130 && g > b)) {
        [r, g, b, a] = sampleGreenNear(eye);
      }
      const edge = Math.sqrt(dx * dx + dy * dy) / (size / 2);
      const aa = Math.round(255 * Math.max(0, 1 - Math.pow(edge, 3)));
      set(buf, size, x, y, r, g, b, Math.min(a, aa));
    }
  }
  writePng(path.join(OUT, name), size, size, buf);
}
makeLid(leftEye, "lid-l.png");
makeLid(rightEye, "lid-r.png");

// Layout JSON (% of 500 canvas)
const layout = {
  canvas: 500,
  leftEye: {
    cx: leftEye.cx / 5,
    cy: leftEye.cy / 5,
    w: leftEye.w / 5,
    h: leftEye.h / 5,
  },
  rightEye: {
    cx: rightEye.cx / 5,
    cy: rightEye.cy / 5,
    w: rightEye.w / 5,
    h: rightEye.h / 5,
  },
  whitePad: 4 / 5,
  maxPupil: 3.2,
  assets: {
    body: "/todd/layers/body.png",
    canonical: "/todd/todd-original.png",
    eyeWhiteL: "/todd/layers/eye-white-l.png",
    eyeWhiteR: "/todd/layers/eye-white-r.png",
    pupilL: "/todd/layers/pupil-l.png",
    pupilR: "/todd/layers/pupil-r.png",
    lidL: "/todd/layers/lid-l.png",
    lidR: "/todd/layers/lid-r.png",
    walkA: "/todd/todd-walk-a.png",
    walkB: "/todd/todd-walk-b.png",
    jump: "/todd/todd-jump.png",
  },
  notes: {
    missingForFullFidelity: [
      "Dedicated eyelid art painted from same fuzzy shader (current lids are texture-sampled)",
      "Separate foot/leg frames for a cleaner run cycle (walk-a/walk-b/jump are usable but slightly drifted)",
      "Startled + dance pose sheets matching todd-original lighting",
    ],
  },
};

fs.writeFileSync(path.join(OUT, "layout.json"), JSON.stringify(layout, null, 2));
console.log("Wrote layers to", OUT);
console.log(JSON.stringify(layout.leftEye), JSON.stringify(layout.rightEye));
