"use client";

import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { PlayfulTodd } from "@/components/site/PlayfulTodd";
import {
  AboutSection,
  ExperienceSection,
  ProjectsSection,
} from "@/components/site/Sections";

export function Portfolio() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", "about", "experience", "projects"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-[var(--bg)] text-[var(--fg)]">
      <div className="site-grain" aria-hidden />
      <div className="site-content">
        <SiteNav active={active} />
        <main>
          <Hero />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
        </main>
        <footer id="contact" className="border-t border-[var(--line)] px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div><p className="font-mono text-xs uppercase tracking-[.2em] text-[var(--lime)]">Have a systems problem?</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Let’s talk about it.</h2><a className="mt-4 inline-block text-[var(--muted)] underline decoration-[var(--lime)] underline-offset-4 hover:text-[var(--fg)]" href="mailto:malam20@uoguelph.ca">malam20@uoguelph.ca</a></div>
            <div className="text-left font-mono text-xs text-[var(--muted)] sm:text-right"><p>© {new Date().getFullYear()} Moosa Alam</p><p className="mt-2">Milton, Ontario · available for relevant opportunities</p></div>
          </div>
        </footer>
        <PlayfulTodd />
      </div>
    </div>
  );
}
