"use client";

import { PROJECTS } from "@/lib/portfolio/data";

export function ProjectsApp() {
  return (
    <ul className="space-y-4">
      {PROJECTS.map((proj) => (
        <li
          key={proj.name}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-white">
                {proj.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                {proj.desc}
              </p>
            </div>
            <a
              href={proj.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-white/15 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[var(--os-lime)]/50 hover:text-white"
              aria-label={`${proj.name} on GitHub`}
            >
              GitHub
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
