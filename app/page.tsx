"use client";

import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

const GITHUB_BASE = "https://github.com/moosacodes";
const LINKEDIN_URL = "https://www.linkedin.com/in/moosa-alam";
const EMAIL = "moosahameed07@gmail.com";

type SectionKey = "about" | "experience" | "education" | "certifications" | "path";

const SECTION_KEYS: SectionKey[] = [
  "about",
  "experience",
  "education",
  "certifications",
  "path",
];

const FULL_NAME = "Moosa Alam";
const TYPING_SPEED_MS = 90;
const CURSOR_BLINK_MS = 530;

function useTypewriter(text: string, startAfterMs = 400) {
  const [display, setDisplay] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplay("");
    setDone(false);
    const start = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        if (i < text.length) {
          setDisplay(text.slice(0, i + 1));
          i++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDone(true);
        }
      }, TYPING_SPEED_MS);
    }, startAfterMs);
    return () => {
      clearTimeout(start);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, startAfterMs]);

  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => setShowCursor((c) => !c), CURSOR_BLINK_MS);
    return () => clearInterval(id);
  }, [done]);

  return { display, showCursor, done };
}

const TECH_ROW_1 = [
  "Python", "Linux", "TCP/IP", "Subnetting", "VLANs", "DNS", "DHCP", "NAT",
  "Docker", "Git", "Bash", "C", "AWS", "GitHub Actions",
];
const TECH_ROW_2 = [
  "Routing", "Switching", "ACLs", "VPN", "SSH", "Wireshark", "tcpdump",
  "Virtualization", "CI/CD", "Networking", "Systems", "Cloud", "Security",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function useTilt() {
  const spring = { stiffness: 100, damping: 18 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      rotateX.set(dy * 14);
      rotateY.set(-dx * 14);
    },
    [rotateX, rotateY]
  );

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { ref, handleMouse, handleLeave, rotateX, rotateY };
}

export default function Home() {
  const [active, setActive] = useState<SectionKey>("about");
  const tilt = useTilt();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { display: nameDisplay, showCursor, done: nameDone } = useTypewriter(FULL_NAME, 300);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const n = SECTION_KEYS.length;
    const onKeyDown = (e: KeyboardEvent) => {
      const i = SECTION_KEYS.indexOf(active);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActive(SECTION_KEYS[(i + 1) % n]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActive(SECTION_KEYS[(i + n - 1) % n]);
      } else if (e.key >= "1" && e.key <= String(n)) {
        setActive(SECTION_KEYS[Number(e.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#0a0a0a] focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        Skip to content
      </a>
    <main id="main-content" className="min-h-screen dot-grid relative overflow-x-hidden">
      {/* Cursor-follow spotlight - stronger for more "wow" */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
      >
        <div
          className="absolute w-[min(90vw,700px)] h-[min(90vw,700px)] rounded-full opacity-[0.18] blur-[100px] transition-opacity duration-500"
          style={{
            left: mouse.x,
            top: mouse.y,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* Hero: name + pic — tighter, PFP closer */}
        <motion.header
          initial="hidden"
          animate="show"
          variants={container}
          className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6 md:gap-8 items-center mb-14 md:mb-16"
        >
          <div className="order-2 md:order-1">
            <h1
              className={`font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] overflow-hidden min-h-[1.2em] transition-all duration-700 ${
                nameDone ? "drop-shadow-[0_0_24px_rgba(255,255,255,0.15)]" : ""
              }`}
            >
              <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                {nameDisplay}
                <span
                  className={`inline-block w-0.5 sm:w-1 h-[0.85em] align-middle ml-0.5 bg-white rounded-sm transition-opacity duration-150 ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                />
              </span>
            </h1>
            <motion.p
              variants={item}
              className="mt-6 text-white/60 text-lg sm:text-xl font-medium"
            >
              Computer Science @ Guelph · Systems · Cloud · Security
            </motion.p>
            <motion.div
              variants={item}
              className="flex items-center gap-4 mt-8"
            >
              <motion.a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Email me (opens Gmail)`}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white/50 hover:text-white transition-colors"
                aria-label="Email (Gmail)"
                whileHover={{ scale: 1.14, y: -3 }}
                whileTap={{ scale: 0.92 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </motion.a>
              <motion.a
                href={GITHUB_BASE}
                target="_blank"
                rel="noopener noreferrer"
                title="github.com/moosacodes"
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white/50 hover:text-white transition-colors"
                aria-label="GitHub"
                whileHover={{ scale: 1.14, y: -3 }}
                whileTap={{ scale: 0.92 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </motion.a>
              <motion.a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="linkedin.com/in/moosa-alam"
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white/50 hover:text-white transition-colors"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.14, y: -3 }}
                whileTap={{ scale: 0.92 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>
            </motion.div>
            <motion.p
              variants={item}
              className="mt-4 text-white/50 text-xs font-medium tracking-wider uppercase flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Open to work
            </motion.p>
            <motion.p variants={item} className="mt-2 text-white/40 text-sm underline decoration-white/30">
              Milton, Ontario
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className="order-1 md:order-2 flex justify-center md:justify-end [perspective:900px]"
            onMouseMove={tilt.handleMouse}
            onMouseLeave={tilt.handleLeave}
            ref={tilt.ref}
          >
            <motion.div
              className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/50 animate-float animate-glow-pulse"
              style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src="/image.png"
                alt="Moosa Alam"
                width={224}
                height={224}
                className="object-cover w-full h-full object-[center_0%]"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.header>

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-12 border-b border-white/10 pb-1"
        >
          {SECTION_KEYS.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActive(tab)}
                aria-current={active === tab ? "true" : undefined}
                className={`relative capitalize text-sm font-medium tracking-wide pb-3 transition-colors ${
                  active === tab ? "text-white" : "text-white/50 hover:text-white/90"
                }`}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {tab}
                {active === tab && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
          ))}
        </motion.nav>

        {/* Content */}
        <motion.section
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[360px]"
        >
          <AnimatePresence mode="wait">
            {active === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-white/85 text-lg leading-relaxed space-y-4"
                  >
                    <p>Computer Science student at the University of Guelph focused on systems, cloud infrastructure, and security.</p>
                    <p>Right now I’m building networking and Linux depth through hands-on labs, studying for AWS Cloud Practitioner and CCNA, and looking for infra, cloud, and networking co-op roles.</p>
                  </motion.div>
                </div>


                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="mt-6 text-white/70 text-sm uppercase tracking-wider font-medium"
                >
                  What I&apos;m building
                </motion.p>
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={container}
                  className="mt-4 space-y-3"
                >
                  {(
                    [
                      {
                        name: "Virtualized Network Home Lab",
                        desc: "Linux, Docker, GitHub Actions, Wireshark · Segmented multi-host lab with isolated subnets, IPv4 routing, DNS, DHCP, NAT, SSH, and firewall rules — validated with ping, traceroute, and packet analysis.",
                        href: "https://github.com/moosacodes/Virtualized-Network-Home-Lab",
                      },
                      {
                        name: "User-Space VPN Tunnel",
                        desc: "Python, Linux, TUN/TAP, UDP, Wireshark · Point-to-point VPN that encapsulates and routes IP packets between isolated endpoints with forwarding, NAT, firewall rules, and authenticated encryption.",
                        href: "https://github.com/moosacodes/User-Space-VPN-Tunnel",
                      },
                    ] as {
                      name: string;
                      desc: string;
                      href: string;
                      demo?: string;
                    }[]
                  ).map((proj) => (
                    <motion.li key={proj.name} variants={item}>
                      <motion.div
                        className="gradient-border gradient-border-hover card-shine rounded-xl p-5 hover:bg-white/[0.08] hover:border-white/25 transition-all duration-300 group"
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-display font-semibold text-white">
                              {proj.name}
                            </h4>
                            <p className="text-white/60 text-sm mt-1.5 leading-relaxed">
                              {proj.desc}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <a
                                href={proj.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium tracking-wide uppercase text-white/55 hover:text-white transition-colors"
                              >
                                GitHub
                              </a>
                              {proj.demo && (
                                <a
                                  href={proj.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium tracking-wide uppercase text-white/55 hover:text-white transition-colors"
                                >
                                  Live demo
                                </a>
                              )}
                            </div>
                          </div>
                          <a
                            href={proj.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-white hover:text-white hover:scale-110 transition-all duration-300"
                            aria-label={`${proj.name} on GitHub`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        </div>
                      </motion.div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}

            {active === "experience" && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-2xl"
              >
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" />
                {[
                    {
                      role: "Software Development Intern",
                      org: "PixelsBoost Website Design",
                      period: "Apr 2026 – Aug 2026 · Milton, ON",
                      desc: "Built and deployed full-stack client apps serving 1,000+ users from requirements through launch; integrated Stripe processing $10,000+ in transactions; improved performance 32% via caching, resource tuning, and reduced network/rendering overhead.",
                    },
                    {
                      role: "Software Engineering Intern",
                      org: "Vibez Music",
                      period: "Jan 2026 – Apr 2026 · Toronto, ON",
                      desc: "Improved internal workflow throughput by 40%+ with Python and Flask automation; strengthened reliability via structured logging, request validation, and traceable error handling; automated testing and deployment with GitHub Actions CI/CD.",
                    },
                    {
                      role: "Academic Tutor & Mentor",
                      org: "Licensed2Learn",
                      period: "Nov 2024 – Jan 2025",
                      desc: "Provided one-on-one tutoring in Math, CS, and English, helping students improve understanding and performance.",
                    },
                    {
                      role: "Social Media Marketing Intern",
                      org: "Mind4Youth",
                      period: "Nov 2024 – Dec 2024",
                      desc: "Helped grow Instagram engagement by 25% through targeted content and campaign visuals.",
                    },
                  ].map((job, i) => (
                  <motion.div
                    key={job.org}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="relative pl-8 pb-10 last:pb-0 group/job"
                  >
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-white/80 border-2 border-[#0a0a0a] group-hover/job:bg-white group-hover/job:scale-125 transition-transform duration-300" />
                    <h3 className="font-display font-semibold text-white text-lg">
                      {job.role} — {job.org}
                    </h3>
                    <p className="text-white/45 text-sm mt-0.5">{job.period}</p>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">{job.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {active === "education" && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="gradient-border gradient-border-hover card-shine rounded-2xl p-6 sm:p-8 hover:bg-white/[0.03] transition-colors duration-300"
                >
                  <h3 className="font-display font-semibold text-white text-xl">
                    University of Guelph
                  </h3>
                  <p className="text-white/50 text-sm mt-1">Expected Dec 2028</p>
                  <p className="text-white/80 mt-3 font-medium">
                    Bachelor of Computing (Co-op) · Computer Science
                  </p>
                  <p className="text-white/55 text-sm mt-1">Area of emphasis: Cybersecurity</p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Coursework spanning systems, networking, databases, cloud, and security.",
                      "Co-op stream with industry placements alongside technical projects.",
                      "Planning undergraduate research in systems, cloud, or security topics.",
                    ].map((bullet, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="flex gap-3 text-white/75 text-sm leading-relaxed"
                      >
                        <span className="text-white/40 mt-0.5">→</span>
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            )}

            {active === "certifications" && (
              <motion.div
                key="certifications"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-4 sm:grid-cols-2 max-w-2xl"
              >
                {[
                  {
                    title: "AWS Certified Cloud Practitioner",
                    meta: "In progress · Amazon Web Services",
                    done: false,
                  },
                  {
                    title: "CCNA",
                    meta: "In progress · Cisco",
                    done: false,
                  },
                ].map((cert, i) => (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className="gradient-border gradient-border-hover card-shine rounded-xl p-6 hover:bg-white/[0.06] hover:scale-[1.03] hover:border-white/20 transition-all duration-300"
                  >
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full mb-4 ${
                        cert.done ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
                      }`}
                    />
                    <h3 className="font-display font-semibold text-white text-base leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-white/50 text-sm mt-2">{cert.meta}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {active === "path" && (
              <motion.div
                key="path"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-2xl"
              >
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  A technical roadmap toward systems, cloud infrastructure, and security engineering.
                </p>
                <div className="absolute left-[5px] top-16 bottom-2 w-px bg-white/10" />
                {[
                  {
                    when: "Now",
                    title: "Foundation",
                    desc: "Systems and networking fundamentals, infrastructure labs, and AWS Cloud Practitioner / CCNA preparation.",
                  },
                  {
                    when: "Next",
                    title: "Industry experience",
                    desc: "Co-op in infrastructure, cloud, or networking — applying Linux, networking, and automation in production environments.",
                  },
                  {
                    when: "Then",
                    title: "Systems depth",
                    desc: "Stronger coursework in networking, databases, and systems programming, with continued personal infrastructure projects.",
                  },
                  {
                    when: "Later",
                    title: "Cloud, security & research",
                    desc: "Cloud and security focus alongside planned undergraduate research in systems or infrastructure security.",
                  },
                  {
                    when: "Longer term",
                    title: "Advanced systems engineering",
                    desc: "Deeper roles in systems, cloud, or security engineering, with graduate study as a possible next step.",
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.when}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="relative pl-8 pb-10 last:pb-0 group/job"
                  >
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-white/80 border-2 border-[#0a0a0a] group-hover/job:bg-white group-hover/job:scale-125 transition-transform duration-300" />
                    <p className="text-white/45 text-sm">{step.when}</p>
                    <h3 className="font-display font-semibold text-white text-lg mt-0.5">
                      {step.title}
                    </h3>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Scrolling tech strip - text only, mask fade at edges, no box/border */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="tech-strip-seamless mt-14 py-6"
        >
          <div className="flex overflow-hidden mb-3 tech-strip-mask">
            <div className="flex animate-marquee-left shrink-0">
              <div className="flex gap-12 pr-12 shrink-0">
                {TECH_ROW_1.map((tech, i) => (
                  <span key={`1a-${i}`} className="text-white/45 text-sm font-medium tracking-wide whitespace-nowrap">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-12 pr-12 shrink-0">
                {TECH_ROW_1.map((tech, i) => (
                  <span key={`1b-${i}`} className="text-white/45 text-sm font-medium tracking-wide whitespace-nowrap">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex overflow-hidden tech-strip-mask">
            <div className="flex animate-marquee-right shrink-0">
              <div className="flex gap-12 pr-12 shrink-0">
                {TECH_ROW_2.map((tech, i) => (
                  <span key={`2a-${i}`} className="text-white/40 text-sm font-medium tracking-wide whitespace-nowrap">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-12 pr-12 shrink-0">
                {TECH_ROW_2.map((tech, i) => (
                  <span key={`2b-${i}`} className="text-white/40 text-sm font-medium tracking-wide whitespace-nowrap">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Resume CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-14 flex flex-col items-center"
        >
          <motion.a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            title="Open resume preview"
            className="group card-shine relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-medium text-sm hover:bg-white hover:text-[#0a0a0a] hover:border-white hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all duration-300"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
          >
            View resume
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center text-white/30 text-xs tracking-wide space-y-2"
        >
          <p>Last updated September 2026</p>
          <p>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 underline decoration-white/30 hover:decoration-white/50 transition-colors">Get in touch</a>
            {" · "}
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 underline decoration-white/30 hover:decoration-white/50 transition-colors">LinkedIn</a>
          </p>
          <p className="text-white/20">← → or 1–5 to switch sections</p>
        </motion.footer>
      </div>
    </main>
    </>
  );
}
