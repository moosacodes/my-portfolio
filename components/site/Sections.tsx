import type { ReactNode } from "react";
import {
  ABOUT,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  LEADERSHIP,
  PROFILE,
  PROJECTS,
} from "@/lib/portfolio/data";

function SectionShell({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--line)] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1120px]">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-[var(--lime)]">{eyebrow}</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{title}</h2>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <SectionShell id="projects" eyebrow="01 / selected work" title="Built to learn what the system is actually doing.">
      <div className="grid gap-5 lg:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <article key={project.name} className="project-panel group">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs text-[var(--lime)]">0{index + 1}</span>
              <span className="font-mono text-[10px] uppercase tracking-[.16em] text-[var(--muted)]">verified lab work</span>
            </div>
            <h3 className="mt-16 text-2xl font-semibold tracking-[-.04em] transition group-hover:text-[var(--lime)]">{project.name}</h3>
            <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">{project.desc}</p>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              {(index === 0 ? ["Linux", "Docker", "IPv4", "DNS", "Wireshark"] : ["Python", "TUN/TAP", "UDP", "Linux", "packet capture"]).map((tag) => <span key={tag} className="border border-[var(--line)] px-2 py-1">{tag}</span>)}
            </div>
            <a href={project.href} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--fg)] underline decoration-[var(--lime)] underline-offset-4 hover:text-[var(--lime)]">View source <span aria-hidden>↗</span></a>
          </article>
        ))}
      </div>
      <div className="mt-8 border-l-2 border-[var(--lime)] pl-5 text-sm leading-7 text-[var(--muted)]">
        <strong className="font-medium text-[var(--fg)]">Engineering lens.</strong> Both projects are labs, not production infrastructure. The point is repeatable observation: isolate a failure, capture the traffic, and make the next change explainable.
      </div>
    </SectionShell>
  );
}

export function ExperienceSection() {
  return (
    <SectionShell id="experience" eyebrow="02 / experience" title="Turning messy signals into useful engineering decisions.">
      <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {EXPERIENCE.slice(0, 2).map((job) => (
          <article key={job.org} className="grid gap-6 py-8 md:grid-cols-[.7fr_1.3fr]">
            <div><p className="font-mono text-xs text-[var(--lime)]">{job.period}</p><h3 className="mt-3 text-xl font-medium">{job.role}</h3><p className="mt-1 text-sm text-[var(--muted)]">{job.org}</p></div>
            <ul className="space-y-3 text-[15px] leading-7 text-[var(--muted)]">{job.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lime)]" />{bullet}</li>)}</ul>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function AboutSection() {
  return (
    <SectionShell id="about" eyebrow="03 / context" title="Curious about the layers most people never see.">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-5 text-lg leading-8 text-[var(--muted)]">{ABOUT.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="space-y-8">
          <div><p className="label">Education</p><p className="mt-2 text-sm leading-6">{EDUCATION.degree}<br /><span className="text-[var(--muted)]">{EDUCATION.school} · {EDUCATION.expected}</span><br /><span className="text-[var(--muted)]">{EDUCATION.emphasis}</span></p></div>
          <div><p className="label">Credentials</p>{CERTIFICATIONS.map((cert) => <p key={cert.title} className="mt-2 text-sm">{cert.title}<br /><span className="text-[var(--muted)]">{cert.meta}</span></p>)}</div>
          <div><p className="label">Leadership</p>{LEADERSHIP.map((item) => <p key={item.role} className="mt-2 text-sm">{item.role} · {item.org}</p>)}</div>
        </div>
      </div>
    </SectionShell>
  );
}

export function ContactSection() {
  return <div className="hidden" aria-hidden><a href={PROFILE.github}>GitHub</a></div>;
}
