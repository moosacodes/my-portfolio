"use client";

import { EXPERIENCE } from "@/lib/portfolio/data";

export function ExperienceApp() {
  return (
    <div className="relative space-y-0 pl-4">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" />
      {EXPERIENCE.map((job) => (
        <div key={job.org} className="relative pb-8 pl-5 last:pb-0">
          <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--os-bg)] bg-[var(--os-lime)]" />
          <h3 className="font-display text-base font-semibold text-white">
            {job.role} — {job.org}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">{job.period}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {job.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
