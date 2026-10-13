"use client";

import { useState } from "react";

const CMD = "ssh moosaalam.me";

export function SshCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CMD);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] sm:text-[14px]">
      <span className="text-[var(--muted)]">prefer a terminal?</span>
      <button
        type="button"
        onClick={copy}
        className="group inline-flex items-center gap-2 text-[var(--fg)] transition hover:text-[var(--lime)]"
        aria-label={copied ? "Copied" : "Copy ssh command"}
      >
        <span>
          <span className="text-[var(--fg)]">$</span> {CMD}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="opacity-70 group-hover:opacity-100"
        >
          <rect
            x="9"
            y="9"
            width="11"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
        {copied && (
          <span className="font-sans text-[12px] text-[var(--lime)]">copied</span>
        )}
      </button>
    </div>
  );
}
