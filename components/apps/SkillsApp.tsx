"use client";

import { CERTIFICATIONS, SKILLS } from "@/lib/portfolio/data";

function ChipRow({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-300"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsApp() {
  return (
    <div className="space-y-6">
      <ChipRow label="Networking" items={SKILLS.networking} />
      <ChipRow label="Systems & tools" items={SKILLS.systems} />
      <ChipRow label="Focus" items={SKILLS.focus} />
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Certifications
        </h3>
        <ul className="mt-2 space-y-2">
          {CERTIFICATIONS.map((c) => (
            <li
              key={c.title}
              className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  c.done ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-white">{c.title}</p>
                <p className="text-xs text-zinc-500">{c.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
