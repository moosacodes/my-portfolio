import type { ReactNode } from "react";
import { ABOUT, EDUCATION, EXPERIENCE, PROJECTS, PROFILE } from "@/lib/portfolio/data";

function SectionShell({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-[var(--line)] px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--lime)]">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <SectionShell id="about" title="about">
      <div className="max-w-[640px] space-y-5 font-sans text-[17px] leading-[1.7] text-[var(--muted)]">
        {ABOUT.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="text-[var(--fg)]/80">
          {EDUCATION.degree}
          <br />
          <span className="text-[var(--muted)]">
            {EDUCATION.school} · {EDUCATION.expected}
          </span>
        </p>
      </div>
    </SectionShell>
  );
}

export function ExperienceSection() {
  return (
    <SectionShell id="experience" title="experience">
      <ul className="max-w-[720px] space-y-8">
        {EXPERIENCE.map((job) => (
          <li key={`${job.org}-${job.role}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-sans text-[18px] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                {job.role}
              </h3>
              <span className="font-mono text-[12px] text-[var(--muted)]">
                {job.period}
              </span>
            </div>
            <p className="mt-1 font-mono text-[13px] text-[var(--lime-dim)]">
              {job.org}
            </p>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-[var(--muted)]">
              {job.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ProjectsSection() {
  return (
    <SectionShell id="projects" title="projects">
      <ul className="max-w-[720px] space-y-6">
        {PROJECTS.map((p) => (
          <li key={p.name}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <h3 className="font-sans text-[18px] font-semibold tracking-[-0.02em] text-[var(--fg)] transition group-hover:text-[var(--lime)]">
                {p.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
                {p.desc}
              </p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-mono text-[13px] text-[var(--muted)]">
        more on{" "}
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--fg)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--lime)]"
        >
          github.com/{PROFILE.githubHandle}
        </a>
      </p>
    </SectionShell>
  );
}
