"use client";

import { ABOUT, PROFILE } from "@/lib/portfolio/data";

export function AboutApp() {
  return (
    <div className="space-y-5 text-sm leading-relaxed text-zinc-300">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">
          {PROFILE.fullName}
        </h2>
        <p className="mt-1 text-zinc-400">{PROFILE.tagline}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {PROFILE.location} · {PROFILE.status}
        </p>
      </div>
      {ABOUT.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <div className="border-t border-white/10 pt-4">
        <h3 className="font-display text-sm font-semibold text-white">
          Path
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{ABOUT.pathIntro}</p>
        <ol className="mt-3 space-y-3">
          {ABOUT.path.map((step) => (
            <li key={step.when} className="flex gap-3">
              <span className="w-16 shrink-0 text-xs uppercase tracking-wide text-[var(--os-lime)]/80">
                {step.when}
              </span>
              <div>
                <p className="font-medium text-white">{step.title}</p>
                <p className="text-zinc-400">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
