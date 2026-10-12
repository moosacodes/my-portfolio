"use client";

import { EDUCATION } from "@/lib/portfolio/data";

export function EducationApp() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[22px] font-semibold tracking-[-0.035em] text-white">
          {EDUCATION.school}
        </h2>
        <p className="mt-2 text-[14px] text-white/55">{EDUCATION.degree}</p>
        <p className="mt-1 text-[13px] text-[var(--os-lime)]/75">
          {EDUCATION.emphasis}
        </p>
        <p className="mt-2 font-mono text-[11px] text-white/30">
          {EDUCATION.expected}
        </p>
      </div>
      <ul className="space-y-3 border-t border-white/[0.08] pt-5">
        {EDUCATION.bullets.map((b) => (
          <li
            key={b}
            className="flex gap-3 text-[13.5px] leading-relaxed text-white/50"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--os-lime)]/70" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}