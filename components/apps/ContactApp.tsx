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
    <div className="space-y-6">
      <p className="max-w-[36ch] text-[14px] leading-relaxed text-white/45">
        Reach out for infra, cloud, and networking co-op roles.
      </p>
      <ul className="divide-y divide-white/[0.07]">
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
              className="group flex items-baseline justify-between gap-4 py-3.5 transition"
            >
              <span className="text-[14px] font-medium text-white group-hover:text-[var(--os-lime)]">
                {l.label}
              </span>
              <span className="truncate font-mono text-[12px] text-white/35 group-hover:text-white/55">
                {l.detail}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
