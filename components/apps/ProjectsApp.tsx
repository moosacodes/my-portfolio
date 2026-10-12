"use client";

import { PROJECTS } from "@/lib/portfolio/data";

export function ProjectsApp() {
  return (
    <ul className="divide-y divide-white/[0.07]">
      {PROJECTS.map((proj) => (
        <li key={proj.name} className="py-5 first:pt-0 last:pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-[17px] font-semibold tracking-[-0.03em] text-white">
                {proj.name}
              </h3>
              <p className="mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-white/45">
                {proj.desc}
              </p>
            </div>
            <a
              href={proj.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 pt-1 font-mono text-[11px] text-[var(--os-lime)]/80 transition hover:text-[var(--os-lime)]"
              aria-label={`${proj.name} on GitHub`}
              data-todd-safe
            >
              github ↗
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
