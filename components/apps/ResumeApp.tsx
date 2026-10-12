"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/portfolio/data";

export function ResumeApp() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    fetch(PROFILE.resumePdf)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load PDF");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setPdfUrl(url);
      })
      .catch(() => setError(true));
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  return (
    <div className="flex h-full min-h-[280px] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={PROFILE.resumePdf}
          download
          className="rounded-md border border-[var(--os-lime)]/40 bg-[var(--os-lime)]/10 px-3 py-1.5 text-xs font-medium text-[var(--os-lime)] transition hover:bg-[var(--os-lime)]/20"
          data-todd-safe
        >
          Download PDF
        </a>
        <a
          href={PROFILE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white"
          data-todd-safe
        >
          Open full preview
        </a>
      </div>
      {error && (
        <div className="text-sm text-zinc-400">
          Could not load the PDF.{" "}
          <a
            href={PROFILE.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Open in new tab
          </a>
        </div>
      )}
      {pdfUrl && !error && (
        <iframe
          src={pdfUrl}
          className="min-h-0 w-full flex-1 rounded-md border border-white/10 bg-zinc-900"
          title="Resume preview"
        />
      )}
      {!pdfUrl && !error && (
        <p className="text-sm text-zinc-500">Loading resume…</p>
      )}
    </div>
  );
}
