"use client";

import { ABOUT, PROFILE } from "@/lib/portfolio/data";

export function AboutApp() {
  return (
    <div className="space-y-8 text-[15px] leading-relaxed text-white/65">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--os-lime)]/70">
          about
        </p>
        <h2 className="mt-2 font-display text-[32px] font-semibold tracking-[-0.045em] text-white">
          {PROFILE.fullName}
        </h2>
        <p className="mt-2.5 text-[14px] text-white/40">{PROFILE.tagline}</p>
        <p className="mt-2 text-[12px] text-white/30">
          {PROFILE.location} · {PROFILE.status}
        </p>
      </div>

      <div className="space-y-4 max-w-[44ch]">
        {ABOUT.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="border-t border-white/[0.08] pt-7">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
          Path
        </h3>
        <p className="mt-2 max-w-[40ch] text-[13px] text-white/35">
          {ABOUT.pathIntro}
        </p>
        <ol className="mt-6 space-y-0">
          {ABOUT.path.map((step) => (
            <li
              key={step.when}
              className="grid grid-cols-[76px_1fr] gap-4 border-l border-white/[0.08] py-3.5 pl-5 first:pt-0"
            >
              <span className="pt-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--os-lime)]/70">
                {step.when}
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold tracking-[-0.025em] text-white">
                  {step.title}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/40">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
