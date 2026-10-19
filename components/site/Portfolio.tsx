"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/portfolio/data";

const packetStages = [
  ["01", "TUN", "The kernel hands a raw IPv4 packet to the user-space tunnel."],
  ["02", "UDP", "The tunnel wraps it in a small frame for the peer host."],
  ["03", "PEER", "The peer receives the datagram and writes the inner packet onward."],
  ["04", "CHECK", "The route can be checked with tests and packet captures."],
] as const;

const Arrow = () => <span className="arrow" aria-hidden>↗</span>;

function ToddShelf() {
  const [state, setState] = useState<"idle" | "hello" | "hop">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timeout = window.setTimeout(() => setState("idle"), state === "hop" ? 800 : 1300);
    return () => window.clearTimeout(timeout);
  }, [state]);

  return (
    <div className="todd-shelf">
      <span className="shelf-label">TODD / ON DUTY</span>
      <button
        type="button"
        className={`todd-sprite todd-state-${state}`}
        onClick={() => setState((current) => current === "idle" ? "hello" : "hop")}
        aria-label={state === "idle" ? "Wake Todd" : "Make Todd hop"}
      >
        <Image src={state === "hop" ? "/todd/todd-jump.png" : "/todd/todd-original.png"} alt="Todd, Moosa's green frog mascot" width={512} height={512} />
      </button>
      <div className="shelf-line" aria-hidden />
      <span className="shelf-caption">{state === "idle" ? "say hi" : state === "hello" ? "hey!" : "boing"}</span>
    </div>
  );
}

function NetworkBoard() {
  const [selected, setSelected] = useState<"edge" | "packet" | "host">("packet");
  const labels = {
    edge: ["edge router", "Where a path enters the lab."],
    packet: ["packet trace", "A deliberately illustrative route."],
    host: ["service host", "The endpoint that gives traffic somewhere to go."],
  }[selected];

  return (
    <div className="network-board">
      <div className="board-top"><span>WORKBENCH / 001</span><span>illustration, not live telemetry</span></div>
      <svg viewBox="0 0 720 470" role="img" aria-label="Illustrated network workbench with a router, packet, and service host">
        <path className="board-rule" d="M40 80H680M40 392H680M80 120V350M640 120V350" />
        <path className="board-cable" d="M116 278C198 278 190 165 300 190S425 345 530 246" />
        <path className="board-cable board-cable-alt" d="M116 299C210 305 208 202 300 214S428 365 530 267" />
        <g className={`board-part ${selected === "edge" ? "is-selected" : ""}`} role="button" tabIndex={0} onClick={() => setSelected("edge")} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected("edge")} aria-label="Inspect edge router">
          <rect x="75" y="235" width="125" height="88" rx="7" />
          <circle cx="99" cy="270" r="6" /><circle cx="121" cy="270" r="6" /><circle cx="143" cy="270" r="6" />
          <path d="M96 296h66" /><text x="91" y="312">EDGE</text>
        </g>
        <g className={`board-part ${selected === "packet" ? "is-selected" : ""}`} role="button" tabIndex={0} onClick={() => setSelected("packet")} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected("packet")} aria-label="Inspect packet trace">
          <circle className="board-packet-ring" cx="340" cy="214" r="26" /><circle className="board-packet" cx="340" cy="214" r="9" />
          <text x="318" y="170">PACKET</text>
        </g>
        <g className={`board-part ${selected === "host" ? "is-selected" : ""}`} role="button" tabIndex={0} onClick={() => setSelected("host")} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected("host")} aria-label="Inspect service host">
          <rect x="515" y="171" width="120" height="150" rx="7" />
          <path d="M538 208h74M538 244h74M538 280h74" /><circle cx="550" cy="195" r="4" /><circle cx="550" cy="231" r="4" /><circle cx="550" cy="267" r="4" />
          <text x="535" y="308">HOST</text>
        </g>
        <path className="board-arrow" d="M204 278h70M378 214l112-13" markerEnd="url(#board-arrow)" />
        <defs><marker id="board-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m0 0 10 5-10 5z" /></marker></defs>
      </svg>
      <div className="board-caption"><strong>{labels[0]}</strong><span>{labels[1]}</span></div>
      <ToddShelf />
    </div>
  );
}

function PacketJourney() {
  const [step, setStep] = useState(-1);
  const current = step >= 0 ? packetStages[step] : null;

  return (
    <div className="packet-panel">
      <div className="packet-title"><span>THE PACKET JOURNEY</span><strong>{step < 0 ? "READY" : `${step + 1} / 04`}</strong></div>
      <div className="packet-steps">
        {packetStages.map(([number, name], index) => <button type="button" key={number} className={step >= index ? "packet-step active" : "packet-step"} onClick={() => setStep(index)} aria-label={`Inspect ${name} stage`}><i>{number}</i><b>{name}</b></button>)}
      </div>
      <div className="packet-message" aria-live="polite">{current ? <><strong>{current[0]} / {current[1]}</strong><p>{current[2]}</p></> : <p>Start a short, illustrative walk through the tunnel. No live traffic is involved.</p>}</div>
      <button className="underlined-action" type="button" onClick={() => setStep(step >= 3 ? -1 : step + 1)}>{step >= 3 ? "Reset" : "Start journey"} <Arrow /></button>
    </div>
  );
}

export function Portfolio() {
  return (
    <div className="portfolio-v2">
      <header className="v2-nav">
        <a href="#home" className="v2-logo">MOOSA<span>/</span>ALAM</a>
        <nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <a className="v2-resume" href={PROFILE.resumePdf} target="_blank" rel="noreferrer">Résumé <Arrow /></a>
      </header>

      <main>
        <section id="home" className="v2-hero">
          <div className="v2-hero-copy">
            <p className="v2-kicker">Computer Science co-op / University of Guelph</p>
            <h1>Moosa<br /><span>Alam.</span></h1>
            <p className="v2-intro">I build and inspect the systems underneath: Linux, networking, cloud infrastructure, and automation.</p>
            <div className="v2-actions"><a className="v2-primary" href="#work">Explore the work <Arrow /></a><a href={`mailto:${PROFILE.email}`} className="v2-text-link">Email me</a></div>
            <div className="v2-facts"><span>Milton, Ontario</span><span>Graduating April 2029</span><span>AWS certified</span></div>
          </div>
          <NetworkBoard />
        </section>

        <section id="work" className="v2-work">
          <div className="v2-section-heading"><p className="v2-kicker">Selected work / 01—02</p><h2>Projects with a point of view.</h2><p>Learning projects where the interesting part is making a system observable, then deciding what to change.</p></div>
          <article className="v2-project v2-project-light">
            <div className="v2-project-index">01</div>
            <div className="v2-project-art topology-art" aria-label="Home lab topology illustration"><span className="art-note">SEGMENTED LAB</span><svg viewBox="0 0 560 360" role="img" aria-label="Network topology with isolated services"><path d="M82 180h396M168 100v160M392 100v160" /><circle cx="82" cy="180" r="35" /><circle cx="168" cy="100" r="28" /><circle cx="168" cy="260" r="28" /><circle cx="392" cy="100" r="28" /><circle cx="392" cy="260" r="28" /><circle cx="478" cy="180" r="35" /><text x="59" y="185">WAN</text><text x="148" y="105">DNS</text><text x="145" y="265">DHCP</text><text x="378" y="105">APP</text><text x="378" y="265">SSH</text><text x="454" y="185">LAN</text></svg><span className="art-caption">A small network you can take apart.</span></div>
            <div className="v2-project-copy"><p className="v2-kicker">Virtualized Network Home Lab</p><h3>A controlled place to break a path and trace why.</h3><p>I designed a virtualized Linux lab with isolated subnets, IPv4 routing, DNS, DHCP, NAT, SSH, and firewall rules. The point was not scale; it was a clear boundary around every failure.</p><dl><div><dt>Built</dt><dd>Topology, services, routing, and validation workflow.</dd></div><div><dt>Checked</dt><dd>Ping, traceroute, and packet analysis.</dd></div><div><dt>Limit</dt><dd>A personal lab, not production infrastructure.</dd></div></dl><a className="v2-source" href="https://github.com/moosacodes/Virtualized-Network-Home-Lab" target="_blank" rel="noreferrer">Open repository <Arrow /></a></div>
          </article>
          <article className="v2-project v2-project-dark">
            <div className="v2-project-index">02</div>
            <div className="v2-project-copy"><p className="v2-kicker">User-Space VPN Tunnel</p><h3>Moving the inner packet by hand.</h3><p>A Python tunnel reads raw IPv4 packets from Linux TUN devices, frames them over UDP, and forwards them between peer hosts. I kept the boundary visible instead of hiding it behind a finished library.</p><dl><div><dt>Built</dt><dd>TUN adapter, UDP framing, select-loop forwarder, CLI endpoints.</dd></div><div><dt>Checked</dt><dd>Unit tests, network scripts, namespace benchmarks, and capture workflows.</dd></div><div><dt>Limit</dt><dd>A learning tunnel; not an authenticated-encryption product.</dd></div></dl><div className="v2-links"><a className="v2-source" href="https://github.com/moosacodes/User-Space-VPN-Tunnel" target="_blank" rel="noreferrer">Open repository <Arrow /></a><a className="v2-source" href="/projects/user-space-vpn-tunnel">Read case study <Arrow /></a></div></div>
            <PacketJourney />
          </article>
        </section>

        <section id="about" className="v2-about"><div><p className="v2-kicker">About</p><h2>Technical curiosity, without the theater.</h2><p>I’m a Computer Science co-op student at the University of Guelph, building depth in systems programming, Linux, networking, cloud infrastructure, and automation.</p><p>AI/HPC infrastructure is a developing interest. Right now, I’m focused on getting the fundamentals right and learning through projects that can be tested, inspected, and explained.</p></div><aside><div><span>Education</span><strong>Bachelor of Computing (Co-op)</strong><p>University of Guelph<br />Expected April 2029</p></div><div><span>Credentials</span><strong>AWS Certified Cloud Practitioner</strong><p>Completed · CCNA in progress</p></div><div><span>Looking for</span><strong>Systems, cloud, and networking work</strong><p>Internships where careful engineering matters.</p></div></aside></section>
        <section id="contact" className="v2-contact"><p className="v2-kicker">Open channel</p><h2>Let’s talk systems.</h2><div><a href={`mailto:${PROFILE.email}`}>{PROFILE.email} <Arrow /></a><a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div></section>
      </main>
      <footer className="v2-footer"><span>© {new Date().getFullYear()} Moosa Alam</span><span>Systems / cloud / networking</span></footer>
    </div>
  );
}
