"use client";

/**
 * Canonical Todd — exact original PNG only.
 * Motion = whole-asset float. No scale squash (that makes him look scuffed).
 */
export function ToddMark({
  size = 96,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute -right-0.5 top-0.5 text-white"
        width="20"
        height="26"
        viewBox="0 0 22 28"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 8l6-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7 14l7-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M9 20l6-3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/todd/todd-original.png"
        alt=""
        draggable={false}
        width={size}
        height={size}
        className="todd-idle h-full w-full object-contain"
      />
    </div>
  );
}
