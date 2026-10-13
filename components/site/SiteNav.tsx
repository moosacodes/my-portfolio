"use client";

import { ThemeToggle } from "@/components/site/ThemeToggle";

const LINKS = [
  { id: "home", label: "home" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "blog", label: "blog", href: "https://github.com/moosacodes" },
] as const;

type Props = {
  active?: string;
};

export function SiteNav({ active = "home" }: Props) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end px-6 pt-7 sm:px-10 sm:pt-8">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-5 sm:gap-6"
      >
        {LINKS.map((link) => {
          const isActive = active === link.id;
          const className = `relative font-sans text-[14px] tracking-[-0.01em] transition ${
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
