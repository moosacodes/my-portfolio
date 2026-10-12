"use client";

import { ABOUT, PROFILE } from "@/lib/portfolio/data";

export function AboutApp() {
  return (
    <div className="space-y-7 text-[15px] leading-relaxed text-white/70">
      <div>
        <h2 className="font-display text-[28px] font-semibold tracking-[-0.04em] text-white">
          {PROFILE.fullName}
        </h2>
        <p className="mt-2 text-[14px] text-white/45">{PROFILE.tagline}</p>
        <p className="mt-1.5 text-[12px] tracking-wide text-[var(--os-lime)]/80">
          {PROFILE.location} · {PROFILE.status}
        </p>
      </div>

      <div className="space-y-4">
        {ABOUT.paragraphs.map((p) => (
          <p key={p} className="max-w-[42ch]">
            {p}
          </p>
        ))}
      </div>

      <div className="border-t border-white/[0.08] pt-6">
        <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/35">
          Path
        </h3>
        <p className="mt-2 max-w-[40ch] text-[13px] text-white/40">
          {ABOUT.pathIntro}
        </p>
        <ol className="mt-5 space-y-0">
          {ABOUT.path.map((step) => (
            <li
              key={step.when}
              className="grid grid-cols-[72px_1fr] gap-4 border-l border-white/[0.08] py-3.5 pl-4 first:pt-0"
            >
              <span className="pt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--os-lime)]/75">
                {step.when}
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold tracking-[-0.02em] text-white">
                  {step.title}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/45">
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
