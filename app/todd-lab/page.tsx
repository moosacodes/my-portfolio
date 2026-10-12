"use client";

import { useEffect, useState } from "react";
import { ToddCharacter } from "@/components/todd/ToddCharacter";
import type { ToddAnimClip } from "@/lib/todd/layout";

const CLIPS: { id: ToddAnimClip; label: string; note: string }[] = [
  { id: "idle", label: "Idle", note: "Breath + look wander + blink" },
  { id: "look", label: "Look", note: "Forced gaze tracking" },
  { id: "blink", label: "Blink", note: "Single blink pulse" },
  { id: "walk", label: "Walk", note: "Pose cycle + squash bob" },
  { id: "run", label: "Run", note: "Faster cycle + lean" },
  { id: "hop", label: "Hop", note: "Anticipate → stretch → land" },
  { id: "startled", label: "Startled", note: "Jolt stretch" },
  { id: "sleep", label: "Sleep", note: "Lids closed + settle" },
  { id: "dance", label: "Dance", note: "Pose cycling + bounce" },
];

const SIZES = [64, 96, 152, 220];

export default function ToddLabPage() {
  const [clip, setClip] = useState<ToddAnimClip>("idle");
  const [size, setSize] = useState(160);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);
  const [mouseLook, setMouseLook] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!mouseLook) {
      setLook(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = document.getElementById("todd-stage");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setLook({
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.45))),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.45))),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseLook]);

  return (
    <div className="min-h-[100dvh] bg-[#050705] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--os-lime)]">
              Todd lab
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
              Animation testbed
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Isolated from the desktop. Layered rig from{" "}
              <code className="text-white/80">todd-original.png</code> plus walk/jump
              pose sheets. Verify clips here before integration.
            </p>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
              Clip
            </p>
            <div className="flex flex-col gap-1">
              {CLIPS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClip(c.id)}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                    clip === c.id
                      ? "bg-[var(--os-lime)]/15 text-[var(--os-lime)]"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="font-medium">{c.label}</span>
                  <span className="mt-0.5 block text-[11px] text-white/35">
                    {c.note}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm text-white/60">
              Size
              <span className="font-mono text-[var(--os-lime)]">{size}px</span>
            </label>
            <input
              type="range"
              min={48}
              max={280}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-[var(--os-lime)]"
            />
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-white/50 hover:border-white/25 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <button
              type="button"
              onClick={() => setFacing((f) => (f === 1 ? -1 : 1))}
              className="rounded-lg border border-white/10 px-3 py-2 text-left text-white/70 hover:bg-white/[0.04]"
            >
              Facing: {facing === 1 ? "right" : "left"}
            </button>
            <button
              type="button"
              onClick={() => setMouseLook((v) => !v)}
              className={`rounded-lg border px-3 py-2 text-left ${
                mouseLook
                  ? "border-[var(--os-lime)]/40 text-[var(--os-lime)]"
                  : "border-white/10 text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              Mouse look: {mouseLook ? "on" : "off"}
            </button>
            <button
              type="button"
              onClick={() => setReduced((v) => !v)}
              className={`rounded-lg border px-3 py-2 text-left ${
                reduced
                  ? "border-[var(--os-lime)]/40 text-[var(--os-lime)]"
                  : "border-white/10 text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              Reduced motion: {reduced ? "on" : "off"}
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[12px] leading-relaxed text-white/45">
            <p className="font-medium text-white/70">Asset gaps</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Painted fuzzy eyelids (current lids sample body texture)</li>
              <li>Dedicated startled / dance pose sheets</li>
              <li>Separate foot art for a cleaner run cycle</li>
            </ul>
          </div>
        </aside>

        <main className="flex min-h-[70vh] flex-1 flex-col">
          <div
            id="todd-stage"
            className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(90,140,45,0.22), transparent 70%), #080a08",
            }}
          >
            <ToddCharacter
              clip={clip}
              size={size}
              facing={facing}
              look={look}
              reducedMotion={reduced}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SIZES.map((s) => (
              <div
                key={s}
                className="flex flex-col items-center rounded-xl border border-white/8 bg-black/30 py-4"
              >
                <ToddCharacter clip={clip} size={s} facing={facing} look={look} reducedMotion={reduced} />
                <span className="mt-2 font-mono text-[11px] text-white/40">{s}px</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
