"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ResumePage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    fetch("/Moosa_Alam_Networking_Resume.pdf")
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
    <div className="min-h-screen bg-[#f5efd8] text-[#283b45] flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#c9c2a4]">
        <Link
          href="/"
          className="text-sm text-[#62736c] hover:text-[#283b45] transition-colors"
        >
          ← Back to MOOSAdex
        </Link>
        <span className="text-[#62736c] text-xs">Résumé · Moosa Alam</span>
        <a
          href="/Moosa_Alam_Networking_Resume.pdf"
          download
          className="text-sm text-[#62736c] hover:text-[#283b45] transition-colors"
        >
          Download
        </a>
      </header>
      <main className="flex-1 flex flex-col min-h-0">
        {error && (
          <div className="p-6 text-center text-[#62736c]">
            <p>Could not load the PDF.</p>
            <a
              href="/Moosa_Alam_Networking_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm underline hover:text-[#283b45]"
            >
              Open PDF in new tab
            </a>
          </div>
        )}
        {pdfUrl && !error && (
          <iframe
            src={pdfUrl}
            className="flex-1 w-full min-h-0 border-0"
            title="Resume preview"
          />
        )}
        {!pdfUrl && !error && (
          <div className="flex-1 flex items-center justify-center text-[#62736c] text-sm">
            Loading résumé…
          </div>
        )}
      </main>
    </div>
  );
}
