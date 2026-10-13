"use client";

import { SocialRow } from "@/components/site/SocialRow";
import { CodeWindow } from "@/components/site/CodeWindow";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center px-6 pb-36 pt-24 sm:px-10 lg:px-14 xl:px-16"
    >
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-12 xl:gap-16">
        {/* left column */}
        <div className="relative max-w-[440px]">
          {/* Perch marker — PlayfulTodd starts / returns here */}
          <div
            data-todd-home
            className="mb-6 h-[96px] w-[96px]"
            aria-hidden
          />

          <h1 className="font-sans text-[52px] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[64px] md:text-[72px]">
            <span className="block text-[var(--fg)]">Moosa</span>
            <span className="block text-[var(--lime)]">Alam.</span>
          </h1>

          <p className="mt-5 max-w-[28rem] font-sans text-[15px] leading-[1.65] text-[var(--muted)] sm:text-[16px]">
            CS student @ UofG, interested in systems, infrastructure and
            cybersecurity.
          </p>

          <SocialRow />

          <a
            href="#projects"
            className="mt-9 inline-flex items-center gap-2 font-mono text-[15px] text-[var(--lime)] transition hover:brightness-110"
          >
            <span>$</span>
            <span className="text-[var(--fg)]">open projects</span>
            <span
              className="ml-0.5 inline-block h-[1.05em] w-[0.55em] animate-cursor-blink bg-[var(--fg)]"
              aria-hidden
            />
          </a>
        </div>

        {/* right column */}
        <div className="relative flex justify-center lg:justify-end lg:pr-2">
          <CodeWindow />
        </div>
      </div>
    </section>
  );
}
