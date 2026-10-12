"use client";

import { EDUCATION } from "@/lib/portfolio/data";

export function EducationApp() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-display text-lg font-semibold text-white">
        {EDUCATION.school}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">{EDUCATION.expected}</p>
      <p className="mt-3 font-medium text-zinc-200">{EDUCATION.degree}</p>
      <p className="mt-1 text-sm text-zinc-400">{EDUCATION.emphasis}</p>
      <ul className="mt-4 space-y-2">
        {EDUCATION.bullets.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-zinc-400">
            <span className="text-[var(--os-lime)]/70">→</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
