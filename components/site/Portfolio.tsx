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
        <footer className="border-t border-[var(--line)] px-6 py-10 text-center font-mono text-[12px] text-[var(--muted)] sm:px-10">
          © {new Date().getFullYear()} Moosa Alam
        </footer>
        <PlayfulTodd />
      </div>
    </div>
  );
}
