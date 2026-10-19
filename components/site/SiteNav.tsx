"use client";

import { ThemeToggle } from "@/components/site/ThemeToggle";

type NavLink = {
  id: string;
  label: string;
  href?: string;
};

const LINKS: NavLink[] = [
  { id: "home", label: "home" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "contact", label: "contact" },
] as const;

type Props = {
  active?: string;
};

export function SiteNav({ active = "home" }: Props) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8 lg:px-16">
      <a href="#" className="pointer-events-auto font-mono text-xs font-medium tracking-[.18em] text-[var(--fg)]">MA<span className="text-[var(--lime)]">_</span></a>
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-3 sm:gap-6"
      >
        {LINKS.map((link) => {
          const isActive = active === link.id;
          const className = `relative font-sans text-[12px] tracking-[-0.01em] transition sm:text-[14px] ${
            isActive
              ? "text-[var(--fg)]"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`;

          if ("href" in link && link.href) {
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {link.label}
              </a>
            );
          }

          return (
            <a
              key={link.id}
              href={link.id === "home" ? "#" : `#${link.id}`}
              className={className}
            >
              {link.label}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[calc(100%+5px)] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[var(--lime)]"
                />
              )}
            </a>
          );
        })}
        <ThemeToggle />
      </nav>
    </header>
  );
}
