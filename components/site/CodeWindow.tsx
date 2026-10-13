"use client";

import type { ReactNode } from "react";

const FILES = [
  { name: "src", kind: "folder" as const, depth: 0 },
  { name: "app", kind: "folder" as const, depth: 1 },
  { name: "page.tsx", kind: "file" as const, depth: 2 },
  { name: "components", kind: "folder" as const, depth: 1 },
  { name: "Todd.tsx", kind: "file" as const, depth: 2 },
  { name: "Highlights.tsx", kind: "file" as const, depth: 2 },
  { name: "Projects.tsx", kind: "file" as const, depth: 2 },
  { name: "public", kind: "folder" as const, depth: 0 },
];

export function CodeWindow() {
  return (
    <div className="relative w-full max-w-[580px] lg:max-w-none">
      {/* Soft lift only — no 3D perspective (that was clipping / looking cheap) */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121212] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="relative flex h-11 items-center border-b border-white/[0.07] bg-[#1c1c1c] px-4">
          <div className="z-10 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] text-white/45">
            page.tsx
          </span>
        </div>

        <div className="flex min-h-[340px] sm:min-h-[400px]">
          <div className="min-w-0 flex-1 overflow-x-auto px-4 py-5 font-mono text-[12.5px] leading-[1.75] sm:text-[13.5px]">
            <CodeLine n={1}>
              <Kw>import</Kw> <Id>{"{"}</Id> <Id>Todd</Id> <Id>{"}"}</Id>{" "}
              <Kw>from</Kw> <Str>&quot;@/components/Todd&quot;</Str>
              <Punc>;</Punc>
            </CodeLine>
            <CodeLine n={2}>
              <Kw>import</Kw> <Id>{"{"}</Id> <Id>Highlights</Id> <Id>{"}"}</Id>{" "}
              <Kw>from</Kw> <Str>&quot;@/components/Highlights&quot;</Str>
              <Punc>;</Punc>
            </CodeLine>
            <CodeLine n={3}>
              <Kw>import</Kw> <Id>{"{"}</Id> <Id>Projects</Id> <Id>{"}"}</Id>{" "}
              <Kw>from</Kw> <Str>&quot;@/components/Projects&quot;</Str>
              <Punc>;</Punc>
            </CodeLine>
            <CodeLine n={4} />
            <CodeLine n={5}>
              <Kw>export</Kw> <Kw>default</Kw> <Kw>function</Kw> <Fn>Home</Fn>
              <Punc>() {"{"}</Punc>
            </CodeLine>
            <CodeLine n={6}>
              {"  "}
              <Kw>return</Kw> <Punc>(</Punc>
            </CodeLine>
            <CodeLine n={7}>
              {"    "}
              <Punc>&lt;</Punc>
              <Tag>main</Tag> <Attr>className</Attr>
              <Punc>=</Punc>
              <Str>&quot;flex min-h-screen&quot;</Str>
              <Punc>&gt;</Punc>
            </CodeLine>
            <CodeLine n={8}>
              {"      "}
              <Punc>&lt;</Punc>
              <Tag>Todd</Tag> <Punc>/&gt;</Punc>
            </CodeLine>
            <CodeLine n={9}>
              {"      "}
              <Punc>&lt;</Punc>
              <Tag>Highlights</Tag> <Punc>/&gt;</Punc>
            </CodeLine>
            <CodeLine n={10}>
              {"      "}
              <Punc>&lt;</Punc>
              <Tag>Projects</Tag> <Punc>/&gt;</Punc>
            </CodeLine>
            <CodeLine n={11}>
              {"    "}
              <Punc>&lt;/</Punc>
              <Tag>main</Tag>
              <Punc>&gt;</Punc>
            </CodeLine>
            <CodeLine n={12}>
              {"  "}
              <Punc>);</Punc>
            </CodeLine>
            <CodeLine n={13}>
              <Punc>{"}"}</Punc>
            </CodeLine>
          </div>

          <aside className="hidden w-[158px] shrink-0 border-l border-white/[0.07] bg-[#0e0e0e] px-2.5 py-3.5 font-mono text-[11.5px] text-white/50 sm:block md:w-[172px] md:text-[12px]">
            <p className="mb-2.5 px-1 text-[10px] uppercase tracking-[0.16em] text-white/30">
              explorer
            </p>
            <ul className="space-y-0.5">
              {FILES.map((f) => (
                <li
                  key={`${f.depth}-${f.name}`}
                  style={{ paddingLeft: f.depth * 10 }}
                  className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 ${
                    f.name === "page.tsx"
                      ? "bg-[var(--lime)]/15 text-[var(--lime)]"
                      : ""
                  }`}
                >
                  <span className="opacity-40" aria-hidden>
                    {f.kind === "folder" ? "▸" : "·"}
                  </span>
                  <span className="truncate">{f.name}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-3 right-1 flex max-w-[210px] flex-col items-end gap-0.5 sm:-bottom-5 sm:right-2 sm:max-w-[250px]">
        <svg
          width="70"
          height="44"
          viewBox="0 0 72 48"
          fill="none"
          className="mr-6 text-white/65 sm:mr-14"
          aria-hidden
        >
          <path
            d="M8 40C22 28 38 18 58 10"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M48 6l12 5-8 10"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="font-hand text-[16px] leading-snug text-white/70 sm:text-[18px]">
          some of the stuff i&apos;ve been working on...
        </p>
      </div>
    </div>
  );
}

function CodeLine({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <div className="flex gap-3.5 whitespace-pre">
      <span className="w-4 shrink-0 select-none text-right text-white/25">
        {n}
      </span>
      <span>{children ?? "\u00a0"}</span>
    </div>
  );
}

function Kw({ children }: { children: ReactNode }) {
  return <span className="text-[#c586c0]">{children}</span>;
}
function Fn({ children }: { children: ReactNode }) {
  return <span className="text-[#dcdcaa]">{children}</span>;
}
function Id({ children }: { children: ReactNode }) {
  return <span className="text-[#9cdcfe]">{children}</span>;
}
function Str({ children }: { children: ReactNode }) {
  return <span className="text-[#ce9178]">{children}</span>;
}
function Tag({ children }: { children: ReactNode }) {
  return <span className="text-[#4ec9b0]">{children}</span>;
}
function Attr({ children }: { children: ReactNode }) {
  return <span className="text-[#9cdcfe]">{children}</span>;
}
function Punc({ children }: { children: ReactNode }) {
  return <span className="text-white/60">{children}</span>;
}
