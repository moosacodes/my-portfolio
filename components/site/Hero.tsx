"use client";

import { SocialRow } from "@/components/site/SocialRow";
import { SystemIllustration } from "@/components/site/SystemIllustration";
import { PROFILE } from "@/lib/portfolio/data";

export function Hero() {
  return (
    <section id="home" className="hero relative px-6 pb-20 pt-28 sm:px-10 sm:pt-36 lg:px-16 lg:pb-28">
      <div className="hero-orbit" aria-hidden />
      <div className="mx-auto grid w-full max-w-[1320px] items-end gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
        <div className="relative z-10 min-w-0">
          <div data-todd-home className="absolute -top-20 left-0 h-12 w-12" aria-hidden />
          <p className="eyebrow mb-7"><span className="live-dot" /> Moosa Alam / computer science co-op</p>
          <h1 className="hero-title">
            I build the<br />
            <em>systems</em><br />
            underneath.
          </h1>
          <p className="hero-copy">
            Linux, networking, cloud infrastructure, and automation — explored through hands-on engineering work at the University of Guelph.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="button-primary">See the work <span aria-hidden>↘</span></a>
            <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer" className="button-secondary">Résumé</a>
          </div>
          <SocialRow />
        </div>
        <div className="relative z-10 min-w-0 pb-2">
          <div className="map-label"><span>01</span> a system is a story about flow</div>
          <SystemIllustration />
          <p className="mt-4 max-w-sm text-xs leading-5 text-[var(--muted)]">An interactive map of the questions I like asking: where does a packet go, what can stop it, and how do we know?</p>
        </div>
      </div>
    </section>
  );
}
