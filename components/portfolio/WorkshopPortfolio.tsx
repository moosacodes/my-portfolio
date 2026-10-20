"use client";

import { useState } from "react";
import { WorkshopVisual } from "@/components/prototypes/RetroDirections";
import {
  ABOUT,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  LEADERSHIP,
  PROFILE,
  PROJECTS,
  SKILLS,
} from "@/lib/portfolio/data";
import styles from "@/components/prototypes/RetroDirections.module.css";
import portfolioStyles from "./WorkshopPortfolio.module.css";

export function WorkshopPortfolio() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main className={`${styles.page} ${styles.workshop}`}>
      <header className={styles.nav}>
        <a href="#top" className={styles.logo}>MOOSA<span>.EXE</span></a>
        <nav aria-label="Primary">
          <a href="#work">work</a>
          <a href="#experience">experience</a>
          <a href="#about">about</a>
          <a href="#contact">contact</a>
          <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer">résumé ↗</a>
        </nav>
        <span className={styles.navStatus}>WORKSHOP / ONLINE</span>
      </header>

      <section id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>personal systems workshop / moosa alam</p>
          <h1><span>Moosa</span> Alam</h1>
          <h2>Systems work, documented like a machine on the bench.</h2>
          <p className={styles.intro}>
            I’m a Computer Science student at the University of Guelph, learning my way through Linux,
            networking, cloud infrastructure, and automation by building, testing, and troubleshooting real projects.
          </p>
          <div className={styles.actions}>
            <a href="#work" className={styles.primary}>inspect the work ↓</a>
            <button type="button" className={styles.secondary} onClick={() => setShowContact((value) => !value)}>
              {showContact ? "close contact ×" : "say hello ↗"}
            </button>
          </div>
          {showContact && (
            <div className={portfolioStyles.contactPopover} role="status">
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer">github.com/{PROFILE.githubHandle}</a>
            </div>
          )}
          <p className={styles.footnote}>systems / networking / cloud / automation</p>
        </div>
        <WorkshopVisual />
      </section>

      <section id="work" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>01 / selected work</p>
          <h2>Things I’ve built to see what happens.</h2>
        </div>
        <div className={portfolioStyles.projectList}>
          {PROJECTS.map((project, index) => (
            <article className={styles.project} key={project.name}>
              <div className={styles.projectNumber}>0{index + 1}</div>
              <div>
                <p className={styles.projectType}>verified project / source available</p>
                <h3>{project.name}</h3>
                <p>{project.desc}</p>
                <div className={portfolioStyles.projectLinks}>
                  <a href={project.href} target="_blank" rel="noreferrer" className={styles.inlineLink}>open source repository ↗</a>
                  {index === 1 && <a href="/projects/user-space-vpn-tunnel" className={styles.inlineLink}>read the case study →</a>}
                </div>
              </div>
              <div className={styles.projectArtifact} aria-label={`${project.name} technical artifact`}>
                <span>INPUT</span><i /><span>ROUTE</span><i /><span>OBSERVE</span>
                <strong>{index === 1 ? "UDP → TUN" : "LAB_01"}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>02 / experience</p>
          <h2>Real work, without pretending it is something else.</h2>
        </div>
        <div className={portfolioStyles.experienceList}>
          {EXPERIENCE.map((job) => (
            <article className={styles.experience} key={`${job.org}-${job.role}`}>
              <div><span>{job.period}</span><h3>{job.role}</h3><strong>{job.org}</strong></div>
              <ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className={styles.disclaimer}>The direction I’m pursuing next includes datacenter operations, Linux, networking, automation, and eventually cluster infrastructure. Those are interests in progress, not claims about work already completed.</p>
      </section>

      <section id="about" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>03 / the person behind the computer</p>
          <h2>Curious about the layers most people never see.</h2>
        </div>
        <div className={portfolioStyles.aboutGrid}>
          <div className={portfolioStyles.aboutCopy}><p>{ABOUT.paragraphs[0]}</p><p>{ABOUT.paragraphs[1]}</p></div>
          <div className={portfolioStyles.aboutFacts}>
            <div><span>EDUCATION</span><strong>{EDUCATION.degree}</strong><small>{EDUCATION.school} · {EDUCATION.expected}<br />{EDUCATION.emphasis}</small></div>
            <div><span>CREDENTIALS</span>{CERTIFICATIONS.map((cert) => <strong key={cert.title}>{cert.title}<small>{cert.meta}</small></strong>)}</div>
            <div><span>LEADERSHIP</span>{LEADERSHIP.map((item) => <strong key={item.role}>{item.role}<small>{item.org}</small></strong>)}</div>
          </div>
        </div>
        <div className={portfolioStyles.skillsStrip}>
          <span>TOOLS ON THE BENCH</span>
          {[...SKILLS.focus, "Linux", "Python", "TCP/IP", "Docker", "AWS", "Wireshark"].map((skill) => <b key={skill}>{skill}</b>)}
        </div>
      </section>

      <section id="contact" className={`${styles.section} ${portfolioStyles.contactSection}`}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>04 / contact</p>
          <h2>Have a system worth investigating?</h2>
        </div>
        <div className={portfolioStyles.contactGrid}>
          <a href={`mailto:${PROFILE.email}`} className={portfolioStyles.contactLink}>email ↗<strong>{PROFILE.email}</strong></a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" className={portfolioStyles.contactLink}>github ↗<strong>github.com/{PROFILE.githubHandle}</strong></a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className={portfolioStyles.contactLink}>linkedin ↗<strong>in/moosa-alam</strong></a>
          <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer" className={portfolioStyles.contactLink}>résumé ↗<strong>open PDF</strong></a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>MOOSA ALAM / {PROFILE.location}</span>
        <span>built with curiosity / no telemetry theater</span>
      </footer>
    </main>
  );
}
