"use client";

import { PROFILE } from "@/lib/portfolio/data";

const links = [
  {
    label: "Email",
    href: `mailto:${PROFILE.email}`,
    detail: PROFILE.email,
  },
  {
    label: "GitHub",
    href: PROFILE.github,
    detail: `github.com/${PROFILE.githubHandle}`,
  },
  {
    label: "LinkedIn",
    href: PROFILE.linkedin,
    detail: "linkedin.com/in/moosa-alam",
  },
  {
    label: "Resume",
    href: PROFILE.resumePdf,
    detail: "Download PDF",
    download: true,
  },
] as const;

export function ContactApp() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Reach out for infra, cloud, and networking co-op roles.
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...("download" in l && l.download ? { download: true } : {})}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                l.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              data-todd-safe
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-[var(--os-lime)]/40 hover:bg-white/[0.06]"
            >
              <span className="text-sm font-medium text-white">{l.label}</span>
              <span className="text-xs text-zinc-400">{l.detail}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
