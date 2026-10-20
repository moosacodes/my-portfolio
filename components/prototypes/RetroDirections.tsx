"use client";

import { useState } from "react";
import { ABOUT, EXPERIENCE, PROFILE, PROJECTS } from "@/lib/portfolio/data";
import styles from "./RetroDirections.module.css";

type Direction = "archive" | "workshop" | "internet";

const DIRECTION_COPY: Record<Direction, {
  label: string;
  title: string;
  intro: string;
  visualTitle: string;
  visualNote: string;
  projectIndex: number;
}> = {
  archive: {
    label: "concept A / personal computer archive",
    title: "A personal collection of systems, notes, and things worth taking apart.",
    intro: "I’m Moosa Alam, a Computer Science student at the University of Guelph. I build small, observable systems to understand what happens underneath.",
    visualTitle: "MOOSA.EXE / WORKSTATION",
    visualNote: "click a component to inspect the collection",
    projectIndex: 0,
  },
  workshop: {
    label: "concept B / retro hardware workshop",
    title: "Systems work, documented like a machine on the bench.",
    intro: "I’m Moosa Alam. I’m learning my way through Linux, networking, cloud infrastructure, and automation by building, testing, and troubleshooting real projects.",
    visualTitle: "BENCH 04 / SIGNAL PATH",
    visualNote: "toggle the inspection lamp to reveal the path",
    projectIndex: 1,
  },
  internet: {
    label: "concept C / old internet experimental",
    title: "Hello from Moosa’s corner of the internet.",
    intro: "A Computer Science student at Guelph, collecting useful bugs, network experiments, and questions about how computers move information.",
    visualTitle: "WELCOME.TXT / 1999–NOW",
    visualNote: "open a file from the index",
    projectIndex: 0,
  },
};

function ArchiveVisual({ direction }: { direction: Direction }) {
  const [selected, setSelected] = useState("cpu");
  const parts = [
    ["cpu", "CPU", "the thing doing the work"],
    ["ram", "RAM", "temporary space for active ideas"],
    ["disk", "DISK", "where experiments become artifacts"],
  ] as const;

  return (
    <div className={`${styles.visual} ${styles[direction]}`}>
      <div className={styles.visualBar}>
        <span>{DIRECTION_COPY[direction].visualTitle}</span>
        <span>● ONLINE / CURIOUS</span>
      </div>
      <div className={styles.archiveMachine}>
        <div className={styles.monitor}>
          <div className={styles.monitorScreen}>
            <span className={styles.screenCursor}>_</span>
            <strong>hello, systems.</strong>
            <small>select a component →</small>
          </div>
        </div>
        <div className={styles.keyboard} aria-hidden />
        <div className={styles.parts}>
          {parts.map(([id, label, detail]) => (
            <button
              type="button"
              key={id}
              className={selected === id ? styles.partSelected : ""}
              onClick={() => setSelected(id)}
              aria-label={`Inspect ${label}: ${detail}`}
            >
              <span>{label}</span>
              <i />
            </button>
          ))}
        </div>
      </div>
      <div className={styles.visualCaption}>
        <span>{DIRECTION_COPY[direction].visualNote}</span>
        <strong>{parts.find(([id]) => id === selected)?.[2]}</strong>
      </div>
    </div>
  );
}

export function WorkshopVisual({ direction = "workshop" }: { direction?: Direction }) {
  const [lit, setLit] = useState(true);
  return (
    <div className={`${styles.visual} ${styles[direction]} ${lit ? styles.lit : styles.dim}`}>
      <div className={styles.visualBar}>
        <span>{DIRECTION_COPY[direction].visualTitle}</span>
        <button type="button" onClick={() => setLit((value) => !value)} aria-pressed={lit}>
          {lit ? "LAMP ON" : "LAMP OFF"}
        </button>
      </div>
      <div className={styles.bench}>
        <div className={styles.rack}><span>ROUTER</span><b /><b /><b /><b /></div>
        <div className={styles.benchLine} />
        <div className={`${styles.signal} ${styles.signalOne}`}>PACKET</div>
        <div className={`${styles.signal} ${styles.signalTwo}`}>UDP</div>
        <div className={`${styles.signal} ${styles.signalThree}`}>TUN</div>
        <div className={styles.benchNote}>inner packet → user space → outer transport</div>
      </div>
      <div className={styles.visualCaption}>
        <span>{DIRECTION_COPY[direction].visualNote}</span>
        <strong>{lit ? "A readable path through the machine." : "The system is still there. Observation helps."}</strong>
      </div>
    </div>
  );
}

function InternetVisual({ direction }: { direction: Direction }) {
  const [file, setFile] = useState("readme");
  const files: Record<string, string> = {
    readme: "MOOSA ALAM / CS @ GUELPH / BUILDING + LEARNING",
    work: "SYNK + VIBEZ / SOFTWARE / SYSTEMS / QUESTIONS",
    links: "GITHUB / LINKEDIN / RESUME / EMAIL",
  };
  return (
    <div className={`${styles.visual} ${styles[direction]}`}>
      <div className={styles.visualBar}>
        <span>{DIRECTION_COPY[direction].visualTitle}</span>
        <span>guestbook: open</span>
      </div>
      <div className={styles.webWindow}>
        <aside>
          <span>FILE INDEX</span>
          {Object.keys(files).map((name) => (
            <button type="button" key={name} onClick={() => setFile(name)} className={file === name ? styles.fileActive : ""}>
              [{name}.txt]
            </button>
          ))}
        </aside>
        <div className={styles.webCopy}>
          <span>HTTP/1.1 200 OK</span>
          <h3>{files[file]}</h3>
          <p>Not a product. Not a dashboard. Just a small place to show the things I’m building and figure out next.</p>
          <a href="#projects">jump to /projects/</a>
        </div>
      </div>
      <div className={styles.visualCaption}>
        <span>{DIRECTION_COPY[direction].visualNote}</span>
        <strong>Exploration is optional; the index is not.</strong>
      </div>
    </div>
  );
}

export function RetroDirections({ direction }: { direction: Direction }) {
  const copy = DIRECTION_COPY[direction];
  const project = PROJECTS[copy.projectIndex];
  const job = EXPERIENCE[copy.projectIndex];

  return (
    <main className={`${styles.page} ${styles[direction]}`}>
      <header className={styles.nav}>
        <a href="#top" className={styles.logo}>MOOSA<span>.EXE</span></a>
        <nav aria-label="Prototype navigation">
          <a href="#work">work</a>
          <a href="#experience">experience</a>
          <a href="#about">about</a>
          <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer">résumé ↗</a>
        </nav>
        <span className={styles.navStatus}>prototype / {direction}</span>
      </header>

      <section id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>{copy.label}</p>
          <h1><span>Moosa</span> Alam</h1>
          <h2>{copy.title}</h2>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.actions}>
            <a href="#work" className={styles.primary}>inspect the work ↓</a>
            <a href={`mailto:${PROFILE.email}`} className={styles.secondary}>say hello ↗</a>
          </div>
          <p className={styles.footnote}>systems / networking / cloud / automation</p>
        </div>
        {direction === "workshop" ? <WorkshopVisual direction={direction} /> : direction === "internet" ? <InternetVisual direction={direction} /> : <ArchiveVisual direction={direction} />}
      </section>

      <section id="work" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>01 / selected work</p>
          <h2>Things I’ve built to see what happens.</h2>
        </div>
        <article className={styles.project}>
          <div className={styles.projectNumber}>0{copy.projectIndex + 1}</div>
          <div>
            <p className={styles.projectType}>verified project / source available</p>
            <h3>{project.name}</h3>
            <p>{project.desc}</p>
            <a href={project.href} target="_blank" rel="noreferrer" className={styles.inlineLink}>open source repository ↗</a>
          </div>
          <div className={styles.projectArtifact} aria-label={`${project.name} technical artifact`}>
            <span>INPUT</span><i /><span>ROUTE</span><i /><span>OBSERVE</span>
            <strong>{direction === "internet" ? "PACKET.LOG" : direction === "workshop" ? "UDP → TUN" : "LAB_01"}</strong>
          </div>
        </article>
      </section>

      <section id="experience" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>02 / experience</p>
          <h2>Real work, without pretending it is something else.</h2>
        </div>
        <article className={styles.experience}>
          <div><span>{job.period}</span><h3>{job.role}</h3><strong>{job.org}</strong></div>
          <ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </article>
        <p className={styles.disclaimer}>The direction I’m pursuing next includes datacenter operations, Linux, networking, automation, and eventually cluster infrastructure. Those are interests in progress, not claims about work already completed.</p>
      </section>

      <section id="about" className={styles.about}>
        <p className={styles.kicker}>03 / the person behind the computer</p>
        <div><h2>Curious about the layers most people never see.</h2><p>{ABOUT.paragraphs[0]}</p><p>{ABOUT.paragraphs[1]}</p></div>
      </section>

      <footer className={styles.footer}>
        <span>MOOSA ALAM / {PROFILE.location}</span>
        <span><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> · <a href={PROFILE.github}>github</a> · <a href={PROFILE.linkedin}>linkedin</a></span>
      </footer>
    </main>
  );
}
