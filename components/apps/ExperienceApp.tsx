"use client";

import { EXPERIENCE } from "@/lib/portfolio/data";

export function ExperienceApp() {
  return (
    <div className="space-y-0">
      {EXPERIENCE.map((job, i) => (
        <div
          key={job.org}
          className={`py-5 ${i === 0 ? "pt-0" : "border-t border-white/[0.07]"}`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-[16px] font-semibold tracking-[-0.03em] text-white">
              {job.role}
            </h3>
            <p className="font-mono text-[11px] text-white/30">{job.period}</p>
          </div>
          <p className="mt-1 text-[13px] text-[var(--os-lime)]/75">{job.org}</p>
          <ul className="mt-2.5 max-w-[52ch] space-y-1.5 text-[13.5px] leading-relaxed text-white/45">
            {job.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-white/30" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}