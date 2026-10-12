"use client";

import { CERTIFICATIONS, SKILLS } from "@/lib/portfolio/data";

function SkillGroup({
  label,
  items,
}: {
  label: string;
  items: readonly string[];
}) {
  return (
    <div>
      <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30">
        {label}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-white/70">
        {items.join(" · ")}
      </p>
    </div>
  );
}

export function SkillsApp() {
  return (
    <div className="space-y-7">
      <SkillGroup label="Networking" items={SKILLS.networking} />
      <SkillGroup label="Systems & tools" items={SKILLS.systems} />
      <SkillGroup label="Focus" items={SKILLS.focus} />
      <div className="border-t border-white/[0.08] pt-6">
        <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30">
          Certifications
        </h3>
        <ul className="mt-4 space-y-3">
          {CERTIFICATIONS.map((c) => (
            <li key={c.title} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  c.done ? "bg-[var(--os-lime)]" : "bg-amber-400/80"
                }`}
              />
              <div>
                <p className="text-[14px] font-medium text-white">{c.title}</p>
                <p className="mt-0.5 text-[12px] text-white/35">{c.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
