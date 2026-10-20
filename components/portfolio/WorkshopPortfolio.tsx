"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROFILE } from "@/lib/portfolio/data";
import styles from "./WorkshopPortfolio.module.css";

type LocationId = "square" | "reliability" | "radar" | "foundry" | "watchtower" | "tunnel" | "guild" | "comms";
type Project = { name: string; summary: string; stack: string; metrics: string[]; href?: string };
type Location = { id: LocationId; mapLabel: string; eyebrow: string; title: string; question: string; intro: string; x: number; y: number; kind: string; projects?: Project[] };

const LOCATIONS: Location[] = [
  { id: "square", mapLabel: "SIGNAL SQUARE", eyebrow: "PLAYER FILE 001", title: "Moosa Alam", question: "Who built this place?", intro: "Computer Science co-op student at the University of Guelph. I build reliable cloud, backend, networking, and security systems—and I measure what improves.", x: 50, y: 50, kind: "square" },
  { id: "reliability", mapLabel: "RELIABILITY STN.", eyebrow: "CORE QUEST 01", title: "Reliability Station", question: "Can he keep systems alive?", intro: "Infrastructure that recovers quickly, reports its own failures, and can be rebuilt without guesswork.", kind: "station", projects: [
    { name: "Cloud-Native Reliability Platform", summary: "A five-service Kubernetes platform engineered for observable, recoverable delivery.", stack: "Kubernetes · AWS · Terraform · Docker", metrics: ["12K+ req/min", "<60s recovery", "95%+ failures caught <45s"] },
    { name: "InfraPulse", summary: "Reproducible AWS infrastructure with SLOs, failure injection, and actionable alerts.", stack: "Python · AWS · Terraform · Docker", metrics: ["<10m full rebuild", "4 failure modes", "3 SLIs · 1 SLO"], href: "https://github.com/moosacodes/InfraPulse" },
  ], x: 28, y: 21 },
  { id: "radar", mapLabel: "RADAR OBSERVATORY", eyebrow: "CORE QUEST 02", title: "Radar Observatory", question: "Can he ship a useful product?", intro: "A live data product that turns fragmented hiring feeds into one searchable signal.", x: 84, y: 18, kind: "observatory", projects: [
    { name: "OpenRoleRadar", summary: "A normalized job discovery pipeline spanning six incompatible ATS providers.", stack: "Python · PostgreSQL · REST APIs · Astro · GitHub Actions", metrics: ["1,400+ postings", "6 ATS providers", "5 min discovery latency"], href: "https://github.com/moosacodes/Open-Role-Radar" },
  ] },
  { id: "foundry", mapLabel: "WORKER FOUNDRY", eyebrow: "CORE QUEST 03", title: "Worker Foundry", question: "Can he build at scale?", intro: "A distributed processing system built around retries, idempotency, throughput, and predictable latency.", x: 82, y: 48, kind: "foundry", projects: [
    { name: "Distributed Job Processing Platform", summary: "Eight workers coordinate durable jobs through a retry-safe Spring Boot backend.", stack: "Java · Spring Boot · PostgreSQL · Redis · Docker", metrics: ["25K+ jobs", "500+ jobs/min", "<120ms p95 at 300+ req/s"] },
  ] },
  { id: "watchtower", mapLabel: "SECURITY TOWER", eyebrow: "CORE QUEST 04", title: "Security Watchtower", question: "Can he find and reduce risk?", intro: "Detection and prevention systems that turn noisy cloud activity into decisions teams can act on.", x: 87, y: 75, kind: "tower", projects: [
    { name: "Cloud Security Detection Platform", summary: "A correlation and investigation layer for cloud authentication and network telemetry.", stack: "AWS · Python · Splunk · Docker", metrics: ["50K+ events/day", "12 MITRE rules", "<5 min investigation"], href: "https://github.com/moosacodes/AI-Powered-Security-Log-Intelligence-Platform" },
    { name: "Permission Guard", summary: "A CI security gate that identifies dangerous IAM permissions before deployment.", stack: "Python · AWS IAM · Terraform · GitHub Actions", metrics: ["20+ risk patterns", "15/15 bad changes blocked", "SARIF reporting"], href: "https://github.com/moosacodes/Permission-Guard" },
  ] },
  { id: "tunnel", mapLabel: "TUNNEL EXCHANGE", eyebrow: "CORE QUEST 05", title: "Tunnel Exchange", question: "Does he understand the wire?", intro: "Packets, routes, tunnels, NAT, and firewalls explored from the host outward.", x: 23, y: 74, kind: "tunnel", projects: [
    { name: "User-Space VPN Tunnel", summary: "A point-to-point TUN interface that frames and moves IP packets over UDP.", stack: "Python · Linux · TUN/TAP · UDP · Wireshark", metrics: ["User-space routing", "UDP framing", "NAT + firewall policy"], href: "https://github.com/moosacodes/User-Space-VPN-Tunnel" },
    { name: "Virtualized Network Home Lab", summary: "A two-host routed lab for breaking, observing, and repairing network paths.", stack: "Linux · Docker · TCP/IP · Wireshark", metrics: ["10K+ packets", "20+ Mbps", "6/6 failures resolved"], href: "https://github.com/moosacodes/Virtualized-Network-Home-Lab" },
  ] },
  { id: "guild", mapLabel: "GUILD HALL", eyebrow: "FIELD LOG", title: "Guild Hall", question: "Has he shipped with people?", intro: "Internships and leadership work where the result mattered outside the codebase.", x: 52, y: 18, kind: "guild", projects: [
    { name: "AI Systems Engineering Intern · Synk", summary: "Diagnosed runtime behavior for an AI platform serving more than 60 concurrent users.", stack: "Apr 2026 – Sep 2026", metrics: ["Reliability +18%", "Frame degradation −14%", "Performance +12%"] },
    { name: "Software Engineering Intern · Vibez Music", summary: "Built Python and Flask tooling, observability, testing, and deployment automation.", stack: "Jan 2026 – Apr 2026", metrics: ["Throughput +40%", "Debug time −35%", "80% automated"] },
  ] },
  { id: "comms", mapLabel: "COMMS TOWER", eyebrow: "OPEN CHANNEL", title: "Comms Tower", question: "Ready to talk?", intro: "The signal is clear. Pick a channel and say hello.", x: 52, y: 78, kind: "comms" },
];

const CORE_ROUTE: LocationId[] = ["reliability", "radar", "foundry", "watchtower", "tunnel"];

function Character({ moving = false, large = false }: { moving?: boolean; large?: boolean }) {
  return <svg className={`${styles.character} ${moving ? styles.characterMoving : ""} ${large ? styles.characterLarge : ""}`} viewBox="0 0 48 64" aria-hidden="true" shapeRendering="crispEdges">
    <ellipse cx="24" cy="61" rx="15" ry="3" fill="#263238" opacity=".28" />
    <path d="M9 57h13v5H7v-3h2zM27 57h12l2 2v3H26z" fill="#f5ead0" stroke="#263238" strokeWidth="2" />
    <path d="M12 39h12v20H10l2-20zM24 39h12l2 20H24z" fill="#59656e" stroke="#263238" strokeWidth="2" />
    <path d="M9 26h30v19H27l-3-4-3 4H9z" fill="#cb4b43" stroke="#263238" strokeWidth="2" />
    <path d="M12 27l-7 8 5 5 5-8M36 27l7 8-5 5-5-8" fill="#cb4b43" stroke="#263238" strokeWidth="2" />
    <path d="M11 38h26M24 27v14" stroke="#f1c75b" strokeWidth="2" />
    <path d="M32 27L19 45" stroke="#263238" strokeWidth="2" /><rect x="27" y="38" width="10" height="8" rx="1" fill="#254e5a" stroke="#263238" strokeWidth="2" />
    <path d="M15 12h18v15H15z" fill="#b87555" stroke="#263238" strokeWidth="2" /><rect x="12" y="17" width="4" height="7" fill="#b87555" stroke="#263238" strokeWidth="2" /><rect x="32" y="17" width="4" height="7" fill="#b87555" stroke="#263238" strokeWidth="2" />
    <path d="M18 21h4M27 21h4M22 25h5" stroke="#263238" strokeWidth="2" />
    <path d="M13 17V9h4V5h5V3h7v2h5v4h3v10h-5v-6h-4v-3H17v7z" fill="#24242b" stroke="#263238" strokeWidth="2" />
    <rect x="11" y="7" width="6" height="6" fill="#24242b" stroke="#263238" strokeWidth="2" /><rect x="17" y="2" width="7" height="7" fill="#24242b" stroke="#263238" strokeWidth="2" /><rect x="25" y="1" width="7" height="8" fill="#24242b" stroke="#263238" strokeWidth="2" /><rect x="32" y="5" width="6" height="7" fill="#24242b" stroke="#263238" strokeWidth="2" />
  </svg>;
}

function BootScreen({ onSkip }: { onSkip: () => void }) {
  return <div className={styles.boot} role="dialog" aria-label="Loading Moosa's World">
    <div className={styles.bootNoise} /><div className={styles.bootConsole}>
      <div className={styles.bootTop}><span>MA-01</span><span>FIELD UNIT</span></div>
      <div className={styles.bootScreen}><div className={styles.bootSignal}><i /><i /><i /><i /></div><Character large /><div className={styles.bootCopy}><span>INITIALIZING WORLD...</span><strong>MOOSA&apos;S<br />SIGNAL DISTRICT</strong><small>LINKING PROJECT NODES</small></div><div className={styles.bootBar}><i /></div></div>
      <div className={styles.bootControls}><span className={styles.dpad}>+</span><span>BUILD / EXPLORE / SHIP</span><span className={styles.buttons}>● ●</span></div>
    </div><button className={styles.skipBoot} onClick={onSkip}>PRESS START <span>↵</span></button>
  </div>;
}

export function WorkshopPortfolio() {
  const [booting, setBooting] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [currentId, setCurrentId] = useState<LocationId>("square");
  const [openId, setOpenId] = useState<LocationId | null>(null);
  const [moving, setMoving] = useState(false);
  const [visited, setVisited] = useState<Set<LocationId>>(new Set(["square"]));
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [secret, setSecret] = useState(false);
  const [night, setNight] = useState(false);
  const travelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const keyBuffer = useRef("");

  useEffect(() => { const timer = setTimeout(() => setBooting(false), 1650); if (window.localStorage.getItem("moosa-world-sound") === "on") setSoundOn(true); return () => clearTimeout(timer); }, []);
  useEffect(() => { if (!booting && worldRef.current) worldRef.current.scrollLeft = Math.max(0, (worldRef.current.scrollWidth - worldRef.current.clientWidth) / 2); }, [booting]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenId(null); if (event.key.toLowerCase() === "n") setNight((value) => !value); keyBuffer.current = (keyBuffer.current + event.key.toLowerCase()).slice(-5); if (keyBuffer.current === "moosa") setSecret((value) => !value); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);

  const beep = useCallback((frequency = 420, duration = .07) => {
    if (!soundOn) return;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor(); const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.type = "square"; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration);
  }, [soundOn]);

  const travelTo = useCallback((id: LocationId, fromTour = false) => {
    if (moving) return; if (travelTimer.current) clearTimeout(travelTimer.current); setOpenId(null); setCurrentId(id); setMoving(true); beep(320, .08);
    const destination = LOCATIONS.find((item) => item.id === id);
    if (destination && worldRef.current) {
      const target = worldRef.current.scrollWidth * destination.x / 100 - worldRef.current.clientWidth / 2;
      worldRef.current.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
    travelTimer.current = setTimeout(() => { setMoving(false); setVisited((old) => new Set([...old, id])); setOpenId(id); beep(620, .11); if (!fromTour) setTourIndex(null); }, 900);
  }, [beep, moving]);
  useEffect(() => () => { if (travelTimer.current) clearTimeout(travelTimer.current); }, []);

  const startTour = () => { setIntroStep(2); setTourIndex(0); travelTo(CORE_ROUTE[0], true); };
  const nextTour = () => { if (tourIndex === null) return; if (tourIndex >= CORE_ROUTE.length - 1) { setTourIndex(null); setOpenId(null); beep(780, .16); return; } const next = tourIndex + 1; setTourIndex(next); travelTo(CORE_ROUTE[next], true); };
  const toggleSound = () => { const next = !soundOn; setSoundOn(next); window.localStorage.setItem("moosa-world-sound", next ? "on" : "off"); };

  const current = useMemo(() => LOCATIONS.find((item) => item.id === currentId)!, [currentId]);
  const active = openId ? LOCATIONS.find((item) => item.id === openId)! : null;
  const coreVisited = CORE_ROUTE.filter((id) => visited.has(id)).length;
  if (booting) return <BootScreen onSkip={() => setBooting(false)} />;

  return <main className={`${styles.game} ${secret ? styles.secretMode : ""} ${night ? styles.nightMode : ""}`}>
    <header className={styles.hud}>
      <button className={styles.brand} onClick={() => travelTo("square")} aria-label="Go to Signal Square"><span className={styles.brandIcon}>M</span><span><strong>MOOSA&apos;S WORLD</strong><small>SIGNAL DISTRICT · ONLINE</small></span></button>
      <div className={styles.hudCenter} aria-label={`${coreVisited} of 5 core locations found`}><span>RELAY LINK</span><div className={styles.relayPips}>{CORE_ROUTE.map((id) => <i key={id} className={visited.has(id) ? styles.relayOn : ""} />)}</div><b>{coreVisited}/5</b></div>
      <div className={styles.hudActions}><button onClick={startTour} className={styles.tourButton}>▶ QUICK TOUR</button><a href={PROFILE.resumePath} className={styles.resumeButton}>RESUME ↗</a><button className={styles.soundButton} onClick={() => setNight((value) => !value)} aria-label={night ? "Switch to day" : "Switch to night"}>{night ? "☀" : "☾"}</button><button className={styles.soundButton} onClick={toggleSound} aria-label={soundOn ? "Mute sound" : "Enable sound"}>{soundOn ? "♪" : "♪̸"}</button></div>
    </header>

    <section className={styles.worldShell} aria-label="Interactive portfolio map">
      <div className={styles.worldTopline}><span>FIELD MAP / DISTRICT 01</span><span className={styles.status}><i /> SELECT A LOCATION</span><span>42.31°N · 79.88°W</span></div>
      <div ref={worldRef} className={`${styles.world} ${active ? styles.worldFocused : ""}`}>
        <div className={styles.worldArt}>
          <div className={styles.sunWash} /><div className={styles.cloudOne} /><div className={styles.cloudTwo} /><div className={styles.scanBeam} />
          <div className={styles.airship}><i /><span>MA-NET</span></div>
          {[...Array(12)].map((_, index) => <i key={index} className={`${styles.firefly} ${styles[`firefly${index + 1}`] || ""}`} />)}
          {LOCATIONS.filter((item) => item.id !== "square").map((location) => <button key={location.id} className={`${styles.location} ${styles[location.kind]} ${visited.has(location.id) ? styles.locationVisited : ""} ${currentId === location.id ? styles.locationCurrent : ""}`} style={{ left: `${location.x}%`, top: `${location.y}%` }} onClick={() => travelTo(location.id)} aria-label={`${location.mapLabel}: ${location.question}`} disabled={moving}>
            <span className={styles.hotspotRing}><i /><b /></span><strong>{location.mapLabel}</strong><small>{location.question}</small>
          </button>)}
          <button className={`${styles.squareMarker} ${currentId === "square" ? styles.locationCurrent : ""}`} style={{ left: "50%", top: "50%" }} onClick={() => travelTo("square")} disabled={moving}><span>◆</span><strong>SIGNAL SQUARE</strong><small>Start here</small></button>
          <div className={`${styles.player} ${moving ? styles.playerMoving : ""}`} style={{ left: `${current.x}%`, top: `${current.y}%` }}><span className={styles.playerTag}>{moving ? "TRAVELLING" : "YOU"}</span><Character moving={moving} /><i className={styles.playerPulse} /></div>
          <div className={styles.mapKey}><span><i className={styles.keyRed} /> PROJECT NODE</span><span><i className={styles.keyGold} /> DISCOVERED</span><span>CLICK / TAP A LANDMARK</span></div>
        </div>
      </div>
    </section>

    {introStep < 2 && <div className={styles.dialogueWrap}><div className={styles.speakerPortrait}><Character large /></div><button className={styles.dialogue} onClick={() => { beep(480); setIntroStep((value) => value + 1); }}><span>MOOSA</span><p>{introStep === 0 ? "Yo—welcome to my signal district. Every building here is something I designed, broke, measured, and rebuilt." : "Short on time? Run the Quick Tour. Got a minute? Pick anywhere and I’ll meet you there."}</p><small>CLICK TO CONTINUE <b>▼</b></small></button></div>}

    {active && introStep >= 2 && <aside className={styles.dossier} aria-label={`${active.title} details`}>
      <div className={styles.dossierTop}><span>{active.eyebrow}</span><button onClick={() => { setOpenId(null); setTourIndex(null); }} aria-label="Close panel">×</button></div>
      <div className={styles.dossierTitle}><span className={styles.locationGlyph}>{active.id === "square" ? "M" : active.id.slice(0, 1).toUpperCase()}</span><div><small>{active.question}</small><h1>{active.title}</h1></div></div><p className={styles.dossierIntro}>{active.intro}</p>
      {active.id === "square" && <div className={styles.playerFile}><div><span>CLASS</span><strong>Infrastructure-minded software engineer</strong></div><div><span>BASE</span><strong>Milton, Ontario · University of Guelph</strong></div><div><span>CREDENTIAL</span><strong>AWS Certified Cloud Practitioner</strong></div><div className={styles.playerLinks}><a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div>}
      {active.projects?.map((project, index) => <article className={styles.project} key={project.name}><div className={styles.projectIndex}>0{index + 1}</div><div className={styles.projectCopy}><h2>{project.name}</h2><p>{project.summary}</p><span className={styles.stack}>{project.stack}</span><div className={styles.metrics}>{project.metrics.map((metric) => <strong key={metric}>{metric}</strong>)}</div>{project.href && <a href={project.href} target="_blank" rel="noreferrer">VIEW SOURCE <span>↗</span></a>}</div></article>)}
      {active.id === "comms" && <div className={styles.commsLinks}><a href={`mailto:${PROFILE.email}`}><span>EMAIL</span><strong>{PROFILE.email}</strong><i>↗</i></a><a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><span>LINKEDIN</span><strong>/in/moosa-alam</strong><i>↗</i></a><a href={PROFILE.github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>@{PROFILE.githubHandle}</strong><i>↗</i></a><a href={PROFILE.resumePath}><span>RESUME</span><strong>Open field record</strong><i>↗</i></a></div>}
      {tourIndex !== null && <div className={styles.tourControls}><span>QUICK TOUR · {tourIndex + 1}/{CORE_ROUTE.length}</span><button onClick={nextTour}>{tourIndex === CORE_ROUTE.length - 1 ? "FINISH TOUR" : "NEXT STOP"} →</button></div>}
    </aside>}

    {coreVisited === CORE_ROUTE.length && !openId && introStep >= 2 && <button className={styles.completionToast} onClick={() => travelTo("comms")}><span>◆ RELAY RESTORED</span><strong>All core signals found.</strong><small>Open a channel →</small></button>}
    <footer className={styles.footer}><span>MADE FROM SCRATCH BY MOOSA</span><span>TIP: TYPE MY FIRST NAME</span><span>© 2026 · SIGNAL DISTRICT v2.0</span></footer>
  </main>;
}

declare global { interface Window { webkitAudioContext?: typeof AudioContext } }
