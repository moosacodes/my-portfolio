"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/portfolio/data";

const NODES = [
  { id: "client", label: "client", x: 12, y: 50, detail: "A request starts here and enters the lab through a defined interface." },
  { id: "router", label: "router", x: 38, y: 28, detail: "Routes traffic between isolated networks and makes the path observable." },
  { id: "firewall", label: "firewall", x: 38, y: 72, detail: "Applies forwarding and filtering rules before traffic reaches a service." },
  { id: "service", label: "service", x: 68, y: 28, detail: "A Linux service or endpoint receives the routed request." },
  { id: "wire", label: "wire", x: 68, y: 72, detail: "The transport layer carries the inner packet across the tunnel." },
  { id: "result", label: "result", x: 90, y: 50, detail: "The response completes the path and can be checked with packet capture." },
] as const;

export function SystemIllustration() {
  const [selected, setSelected] = useState<(typeof NODES)[number]["id"]>("router");
  const active = NODES.find((node) => node.id === selected) ?? NODES[1];

  return (
    <div className="system-map" aria-label="Interactive systems map">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lime)]">systems / in motion</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Select a component to inspect the path.</p>
        </div>
        <span className="font-mono text-[10px] text-[var(--muted)]">illustrative simulation</span>
      </div>
      <div className="relative aspect-[1.45] min-h-[260px] overflow-hidden px-3 py-5 sm:min-h-[330px]">
        <svg viewBox="0 0 100 100" className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]" role="img" aria-label="A packet path through a client, router, firewall, service, tunnel, and result">
          <path d="M12 50L38 28L68 28L90 50M12 50L38 72L68 72L90 50M38 28L38 72M68 28L68 72" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth=".6" />
          <path d="M12 50L38 28L68 28L90 50" fill="none" className="map-route" stroke="var(--lime)" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle r="1.8" fill="var(--lime)" className="map-packet">
            <animateMotion dur="4s" repeatCount="indefinite" path="M12 50L38 28L68 28L90 50" />
          </circle>
          {NODES.map((node) => (
            <g key={node.id} transform={`translate(${node.x} ${node.y})`} className="cursor-pointer" onClick={() => setSelected(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelected(node.id); }} role="button" tabIndex={0} aria-label={`Inspect ${node.label}`}>
              <circle r={selected === node.id ? 5 : 3.5} fill={selected === node.id ? "var(--lime)" : "var(--bg-elevated)"} stroke="var(--lime)" strokeWidth=".7" />
              <circle r="1" fill="var(--bg)" />
              <text y="10" textAnchor="middle" fill="currentColor" fontSize="4" fontFamily="monospace">{node.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="border-t border-[var(--line)] bg-[var(--bg-elevated)] px-5 py-4">
        <p className="font-mono text-xs text-[var(--lime)]">{active.label}</p>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-[var(--muted)]">{active.detail}</p>
        <a href="#projects" className="mt-3 inline-block text-xs text-[var(--fg)] underline decoration-[var(--lime)] underline-offset-4 hover:text-[var(--lime)]">See the engineering work ↓</a>
      </div>
    </div>
  );
}
