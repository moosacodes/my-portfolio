"use client";

import { SocialRow } from "@/components/site/SocialRow";
import { SystemIllustration } from "@/components/site/SystemIllustration";
import { PROFILE } from "@/lib/portfolio/data";

export function Hero() {
  return (
    <section id="home" className="relative px-6 pb-24 pt-32 sm:px-10 sm:pt-40 lg:px-16 lg:pb-32">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-20">
        <div className="relative min-w-0 max-w-xl">
          <div data-todd-home className="absolute -top-20 left-0 h-12 w-12" aria-hidden />
          <p className="mb-6 font-mono text-xs uppercase tracking-[.24em] text-[var(--lime)]">Moosa Alam / systems builder</p>
          <h1 className="font-sans text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[.9] tracking-[-.07em]">
            Making<br /><span className="text-[var(--lime)]">invisible systems</span><br />visible.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-[1.6] text-[var(--muted)]">
            Computer Science co-op student at the University of Guelph. I build and investigate the layers underneath reliable software: Linux, networks, cloud infrastructure, and automation.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="button-primary">Explore work <span aria-hidden>↓</span></a>
            <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer" className="button-secondary">Open résumé</a>
            <a href={`mailto:${PROFILE.email}`} className="button-secondary">Contact</a>
          </div>
          <SocialRow />
        </div>
        <div className="relative min-w-0">
          <SystemIllustration />
        </div>
      </div>
    </section>
  );
}
