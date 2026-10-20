"use client";

import { useEffect, useState } from "react";
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
import styles from "./WorkshopPortfolio.module.css";

type StopId = "home" | "network" | "tunnel";
type SkillGroup = keyof typeof SKILLS;

const MAP_STOPS: {
  id: StopId;
  x: number;
  y: number;
  label: string;
  title: string;
  note: string;
}[] = [
  {
    id: "home",
    x: 15,
    y: 73,
    label: "START",
    title: "Guelph Field Notes",
    note: "Computer Science co-op student, learning by building and testing real systems.",
  },
  {
    id: "network",
    x: 50,
    y: 51,
    label: "LAB 01",
    title: "Network Home Lab",
    note: "A segmented virtual network with routing, DNS, DHCP, NAT, and packet captures.",
  },
  {
    id: "tunnel",
    x: 82,
    y: 34,
    label: "LAB 02",
    title: "User-Space VPN Tunnel",
    note: "A learning tunnel that follows IPv4 packets from TUN devices through framed UDP.",
  },
];

const SKILL_GROUPS: { id: SkillGroup; label: string }[] = [
  { id: "networking", label: "Networking" },
  { id: "systems", label: "Systems" },
  { id: "focus", label: "Current focus" },
];

const PROJECT_STACKS = [
  ["Linux", "Docker", "GitHub Actions", "Wireshark"],
  ["Python", "TUN/TAP", "UDP", "Wireshark"],
];

function TrainerSprite({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 16 20"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="0" width="8" height="2" fill="#253a50" />
      <rect x="2" y="2" width="12" height="2" fill="#d95344" />
      <rect x="3" y="4" width="10" height="5" fill="#e9bd87" />
      <rect x="2" y="4" width="3" height="4" fill="#493d38" />
      <rect x="11" y="4" width="3" height="4" fill="#493d38" />
      <rect x="5" y="6" width="1" height="1" fill="#253a50" />
      <rect x="10" y="6" width="1" height="1" fill="#253a50" />
      <rect x="4" y="9" width="8" height="2" fill="#e9bd87" />
      <rect x="2" y="11" width="12" height="5" fill="#e8eee2" />
      <rect x="0" y="11" width="3" height="5" fill="#d95344" />
      <rect x="13" y="11" width="3" height="5" fill="#d95344" />
      <rect x="5" y="11" width="2" height="4" fill="#54877b" />
      <rect x="9" y="11" width="2" height="4" fill="#54877b" />
      <rect x="3" y="16" width="4" height="3" fill="#293950" />
      <rect x="9" y="16" width="4" height="3" fill="#293950" />
      <rect x="2" y="19" width="5" height="1" fill="#f4d86a" />
      <rect x="9" y="19" width="5" height="1" fill="#f4d86a" />
    </svg>
  );
}

function FieldMapArtwork() {
  return (
    <svg
      className={styles.mapArtwork}
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect width="640" height="400" fill="#b7d9c9" />
      <rect y="181" width="640" height="219" fill="#8faa69" />
      <rect y="208" width="640" height="18" fill="#7e9d5f" />
      <rect x="30" y="42" width="68" height="14" fill="#f7edc8" />
      <rect x="15" y="56" width="97" height="13" fill="#f7edc8" />
      <rect x="476" y="72" width="64" height="12" fill="#f7edc8" />
      <rect x="463" y="84" width="91" height="12" fill="#f7edc8" />
      <rect x="523" y="39" width="42" height="42" fill="#f0c967" />
      <rect x="531" y="31" width="26" height="8" fill="#f0c967" />
      <rect x="515" y="47" width="8" height="26" fill="#f0c967" />
      <path d="M-12 352H160V319H251V281H344V242H454V198H648V270H510V316H380V354H256V400H-12Z" fill="#d8ba78" />
      <path d="M-12 364H153V333H244V295H340V256H452V212H648V228H466V272H354V311H259V349H-12Z" fill="#ead195" />
      <g fill="#5f815a">
        <rect x="42" y="134" width="35" height="46" />
        <rect x="34" y="145" width="51" height="29" />
        <rect x="94" y="159" width="25" height="28" />
        <rect x="83" y="166" width="47" height="19" />
        <rect x="164" y="116" width="37" height="52" />
        <rect x="155" y="129" width="55" height="31" />
        <rect x="231" y="157" width="32" height="36" />
        <rect x="220" y="166" width="56" height="22" />
        <rect x="376" y="137" width="34" height="45" />
        <rect x="365" y="148" width="56" height="27" />
        <rect x="451" y="130" width="45" height="52" />
        <rect x="441" y="145" width="64" height="31" />
        <rect x="572" y="144" width="36" height="46" />
        <rect x="562" y="155" width="58" height="28" />
      </g>
      <g fill="#486b51">
        <rect x="51" y="177" width="17" height="18" />
        <rect x="174" y="165" width="17" height="19" />
        <rect x="386" y="177" width="17" height="18" />
        <rect x="465" y="175" width="18" height="17" />
        <rect x="582" y="181" width="17" height="16" />
      </g>
      <g fill="#eff0ca">
        <rect x="310" y="136" width="20" height="20" />
        <rect x="304" y="142" width="32" height="8" />
        <rect x="316" y="130" width="8" height="32" />
      </g>
      <g fill="#557c84">
        <rect x="533" y="218" width="43" height="60" />
        <rect x="526" y="227" width="57" height="45" />
        <rect x="541" y="205" width="27" height="14" />
        <rect x="545" y="197" width="19" height="8" />
      </g>
      <g fill="#f0c967">
        <rect x="550" y="232" width="8" height="8" />
        <rect x="550" y="247" width="8" height="8" />
        <rect x="564" y="232" width="8" height="8" />
        <rect x="564" y="247" width="8" height="8" />
      </g>
      <g fill="#f6e8b7">
        <rect x="22" y="267" width="7" height="7" />
        <rect x="117" y="236" width="7" height="7" />
        <rect x="197" y="219" width="7" height="7" />
        <rect x="283" y="326" width="7" height="7" />
        <rect x="422" y="299" width="7" height="7" />
        <rect x="611" y="316" width="7" height="7" />
      </g>
      <g fill="#526d4d">
        <rect x="20" y="382" width="5" height="18" />
        <rect x="30" y="389" width="5" height="11" />
        <rect x="609" y="373" width="5" height="27" />
        <rect x="621" y="384" width="5" height="16" />
      </g>
    </svg>
  );
}

function ProjectArtwork({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className={styles.projectDiagram} viewBox="0 0 440 240" aria-hidden="true">
        <path d="M82 120H174M266 120H358M220 53V120M220 120V190M82 120L147 185M358 120L292 185" />
        <path className={styles.diagramRoute} d="M82 120H174H220V53M220 120H358" />
        <rect x="28" y="91" width="108" height="58" />
        <rect x="166" y="91" width="108" height="58" />
        <rect x="304" y="91" width="108" height="58" />
        <circle cx="220" cy="53" r="19" />
        <circle cx="147" cy="185" r="13" />
        <circle cx="292" cy="185" r="13" />
        <text x="82" y="116" textAnchor="middle">HOST A</text>
        <text x="82" y="132" textAnchor="middle">192.168.10</text>
        <text x="220" y="116" textAnchor="middle">ROUTER</text>
        <text x="220" y="132" textAnchor="middle">FIREWALL</text>
        <text x="358" y="116" textAnchor="middle">HOST B</text>
        <text x="358" y="132" textAnchor="middle">192.168.20</text>
        <text x="220" y="57" textAnchor="middle">DNS</text>
      </svg>
    );
  }

  return (
    <svg className={styles.projectDiagram} viewBox="0 0 440 240" aria-hidden="true">
      <path d="M91 121H151M217 121H277M343 121H392" />
      <path className={styles.diagramRoute} d="M91 121H151H217H277H343H392" />
      <rect x="21" y="86" width="70" height="70" />
      <rect x="151" y="86" width="66" height="70" />
      <rect x="277" y="86" width="66" height="70" />
      <rect x="363" y="100" width="60" height="42" />
      <text x="56" y="116" textAnchor="middle">KERNEL</text>
      <text x="56" y="133" textAnchor="middle">IPv4</text>
      <text x="184" y="116" textAnchor="middle">TUN</text>
      <text x="184" y="133" textAnchor="middle">DEVICE</text>
      <text x="310" y="116" textAnchor="middle">UDP</text>
      <text x="310" y="133" textAnchor="middle">FRAME</text>
      <text x="393" y="126" textAnchor="middle">PEER</text>
      <circle className={styles.diagramPacket} cx="105" cy="121" r="6" />
    </svg>
  );
}

export function WorkshopPortfolio() {
  const [booting, setBooting] = useState(true);
  const [selectedStop, setSelectedStop] = useState<StopId>("home");
  const [openExperience, setOpenExperience] = useState<number | null>(0);
  const [skillGroup, setSkillGroup] = useState<SkillGroup>("networking");
  const [nightMode, setNightMode] = useState(false);
  const stop = MAP_STOPS.find((item) => item.id === selectedStop) ?? MAP_STOPS[0];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBooting(false);
      return;
    }
    const timer = window.setTimeout(() => setBooting(false), 1150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {booting && (
        <div className={styles.bootOverlay} role="dialog" aria-modal="true" aria-label="Portfolio start screen">
          <div className={styles.bootHandheld}>
            <div className={styles.bootLabel}>
              <span>MOOSAdex</span>
              <span>FIELD LOG 001</span>
            </div>
            <div className={styles.bootScreen}>
              <div className={styles.bootSprite}><TrainerSprite /></div>
              <p>NEW ADVENTURE<br /><strong>MOOSA ALAM</strong></p>
              <span className={styles.bootCursor}>PRESS START</span>
            </div>
            <div className={styles.bootProgress}><i /></div>
            <p className={styles.bootStatus}>LOADING TRAINER PROFILE…</p>
          </div>
          <button className={styles.skipIntro} type="button" autoFocus onClick={() => setBooting(false)}>
            Skip intro <span>↵</span>
          </button>
        </div>
      )}

      <main className={styles.page + (nightMode ? " " + styles.night : "")}>
        <header className={styles.hud}>
          <a className={styles.brand} href="#top" aria-label="Moosa Alam, back to top">
            <span className={styles.brandMark}>M</span>
            <span>MOOSA<span className={styles.brandAccent}>DEX</span><small>FIELD LOG 001</small></span>
          </a>
          <nav className={styles.nav} aria-label="Main navigation">
            <a href="#work">Encounters</a>
            <a href="#experience">Guild log</a>
            <a href="#profile">Trainer card</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className={styles.hudActions}>
            <span className={styles.availability}><i /> Open to co-op</span>
            <button
              className={styles.themeToggle}
              type="button"
              onClick={() => setNightMode((value) => !value)}
              aria-label={nightMode ? "Switch to daylight palette" : "Switch to night palette"}
              title={nightMode ? "Daylight palette" : "Night palette"}
            >
              {nightMode ? "☼" : "☾"}
            </button>
          </div>
        </header>

        <section id="top" className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.liveDot} /> PROFILE NO. 001 <i /> MILTON, ONTARIO</p>
            <p className={styles.trainerClass}>COMPUTER SCIENCE CO-OP <span>·</span> SYSTEMS EXPLORER</p>
            <h1>Moosa<br /><span>Alam</span><b className={styles.titleStar}>✳</b></h1>
            <p className={styles.heroLead}>
              I study what happens between packets, processes, and machines.
            </p>
            <p className={styles.heroDescription}>
              A University of Guelph Computer Science student building hands-on depth in Linux, networking, cloud infrastructure, and automation.
            </p>
            <div className={styles.heroActions}>
              <a href="#work" className={styles.primaryButton}>VIEW FIELD LOG <span>↓</span></a>
              <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer" className={styles.textButton}>OPEN RÉSUMÉ ↗</a>
            </div>
            <div className={styles.heroFacts}>
              <span><small>REGION</small> Guelph · Milton</span>
              <span><small>CLASS</small> Co-op 2029</span>
              <span><small>TYPE</small> Systems / Network</span>
            </div>
          </div>

          <div className={styles.fieldCard}>
            <div className={styles.fieldTopline}>
              <span><i /> FIELD MAP <b> / ROUTE 01</b></span>
              <span>● SAVE DATA OK</span>
            </div>
            <div className={styles.mapWorld}>
              <FieldMapArtwork />
              <span className={styles.mapCoordinates}>MAP GRID 02-B</span>
              <span className={styles.mapWeather}>FIELD CONDITIONS <b>GOOD</b></span>
              {MAP_STOPS.map((item) => (
                <button
                  className={styles.mapStop + (selectedStop === item.id ? " " + styles.mapStopActive : "")}
                  key={item.id}
                  type="button"
                  style={{ left: item.x + "%", top: item.y + "%" }}
                  onClick={() => setSelectedStop(item.id)}
                  aria-pressed={selectedStop === item.id}
                  aria-label={"Travel to " + item.title}
                >
                  <i /><span>{item.label}</span>
                </button>
              ))}
              <div
                className={styles.mapTrainer}
                style={{ left: (stop.x - 3) + "%", top: (stop.y - 23) + "%" }}
              >
                <TrainerSprite />
              </div>
              <div className={styles.mapLegend}><i /> YOU ARE HERE</div>
            </div>
            <div className={styles.fieldCaption}>
              <div><span>NOW EXPLORING</span><strong>{stop.title}</strong></div>
              <p>{stop.note}</p>
            </div>
          </div>
        </section>

        <section id="work" className={styles.workSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>01 <i /> FIELD ENCOUNTERS</p>
            <div>
              <h2>Built to understand<br /><span>what’s underneath.</span></h2>
              <p>Two hands-on systems projects. Each one made observable, testable, and easier to explain.</p>
            </div>
            <span className={styles.sectionStamp}>2<br />LOGGED</span>
          </div>

          <div className={styles.projectGrid}>
            {PROJECTS.map((project, index) => (
              <article className={styles.projectCard} key={project.name}>
                <div className={styles.projectArt + (index === 1 ? " " + styles.projectArtSecond : "")}>
                  <div className={styles.artTopline}>
                    <span>ENCOUNTER 00{index + 1}</span>
                    <span>STATUS <b>DOCUMENTED</b></span>
                  </div>
                  <ProjectArtwork index={index} />
                  <span className={styles.artCaption}>{index === 0 ? "SUBNET ROUTE / 02 HOSTS" : "PACKET JOURNEY / TUN → UDP"}</span>
                </div>
                <div className={styles.projectInfo}>
                  <div className={styles.projectHeading}>
                    <span className={styles.projectNo}>NO. 00{index + 1}</span>
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.desc}</p>
                  <div className={styles.stackList}>
                    {PROJECT_STACKS[index].map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className={styles.projectActions}>
                    <a href={project.href} target="_blank" rel="noreferrer">VIEW SOURCE <span>↗</span></a>
                    {index === 1 && <a href="/projects/user-space-vpn-tunnel">READ CASE STUDY <span>→</span></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className={styles.experienceSection}>
          <div className={styles.sectionHeader + " " + styles.experienceHeader}>
            <p className={styles.eyebrow}>02 <i /> GUILD LOG</p>
            <div>
              <h2>Experience points<br /><span>earned on the job.</span></h2>
              <p>People, teams, and real responsibilities that shaped how I work.</p>
            </div>
            <span className={styles.sectionStamp}>04<br />ENTRIES</span>
          </div>
          <div className={styles.experienceList}>
            {EXPERIENCE.map((job, index) => (
              <article className={styles.experienceEntry} key={job.org + job.role}>
                <button
                  className={styles.experienceToggle}
                  type="button"
                  onClick={() => setOpenExperience(openExperience === index ? null : index)}
                  aria-expanded={openExperience === index}
                >
                  <span className={styles.experienceIndex}>0{index + 1}</span>
                  <span className={styles.experienceMain}>
                    <small>{job.period}</small>
                    <strong>{job.role}</strong>
                  </span>
                  <span className={styles.experienceOrg}>{job.org}</span>
                  <span className={styles.experienceExpand}>{openExperience === index ? "−" : "+"}</span>
                </button>
                {openExperience === index && (
                  <ul className={styles.experienceDetails}>
                    {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>
          <p className={styles.nextQuest}>
            <span>NEXT QUEST</span> Pursuing datacenter operations, Linux, networking, automation, and cluster infrastructure. These are interests in progress.
          </p>
        </section>

        <section id="profile" className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>03 <i /> TRAINER CARD</p>
            <div>
              <h2>Curious about the<br /><span>layers most miss.</span></h2>
              <p>Still learning. Happiest with a terminal open and a packet capture running.</p>
            </div>
            <span className={styles.sectionStamp}>PLAYER<br />PROFILE</span>
          </div>
          <div className={styles.profileGrid}>
            <div className={styles.profileCopy}>
              {ABOUT.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className={styles.leadership}>
                <span className={styles.miniLabel}>IN THE COMMUNITY</span>
                {LEADERSHIP.map((item) => (
                  <div className={styles.leadershipItem} key={item.role}>
                    <strong>{item.role}</strong>
                    <span>{item.org}</span>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside className={styles.trainerCard}>
              <div className={styles.trainerCardTop}><span>TRAINER DATA</span><span>NO. 001</span></div>
              <div className={styles.trainerCardIdentity}>
                <div className={styles.portraitTile}><TrainerSprite /></div>
                <div><span>NAME</span><strong>MOOSA ALAM</strong><small>{PROFILE.location}</small></div>
              </div>
              <div className={styles.trainerStat}><span>EDUCATION</span><strong>{EDUCATION.degree}</strong><small>{EDUCATION.school} · {EDUCATION.expected}</small></div>
              <div className={styles.trainerStat}><span>AREA OF EMPHASIS</span><strong>{EDUCATION.emphasis}</strong></div>
              <div className={styles.trainerStat}><span>CREDENTIALS</span>
                {CERTIFICATIONS.map((cert) => (
                  <strong className={styles.credential} key={cert.title}>
                    {cert.title}<small>{cert.meta}</small>
                  </strong>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.skillsSection} aria-labelledby="skills-title">
          <div className={styles.skillsHeading}>
            <div><p className={styles.eyebrow}>04 <i /> CURRENT LOADOUT</p><h2 id="skills-title">Tools on hand.</h2></div>
            <p>Skills grow with every build. Pick a field kit to inspect.</p>
          </div>
          <div className={styles.skillTabs} role="tablist" aria-label="Skill categories">
            {SKILL_GROUPS.map((group) => (
              <button
                className={skillGroup === group.id ? styles.skillTabActive : ""}
                type="button"
                role="tab"
                aria-selected={skillGroup === group.id}
                key={group.id}
                onClick={() => setSkillGroup(group.id)}
              >
                {group.label}<span>{SKILLS[group.id].length.toString().padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <div className={styles.skillItems} role="tabpanel">
            {SKILLS[skillGroup].map((skill, index) => (
              <span key={skill}><i>{(index + 1).toString().padStart(2, "0")}</i>{skill}</span>
            ))}
          </div>
        </section>

        <section id="contact" className={styles.contactSection}>
          <p className={styles.eyebrow}>05 <i /> OPEN CHANNEL</p>
          <div className={styles.contactContent}>
            <div>
              <h2>Have a good<br /><span>system to explore?</span></h2>
              <p>Open to co-op roles in systems, software, cloud, and networking. Let’s talk.</p>
            </div>
            <div className={styles.contactLinks}>
              <a href={"mailto:" + PROFILE.email}><span>EMAIL</span><strong>{PROFILE.email}</strong><i>↗</i></a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>github.com/{PROFILE.githubHandle}</strong><i>↗</i></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><span>LINKEDIN</span><strong>in/moosa-alam</strong><i>↗</i></a>
              <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer"><span>RÉSUMÉ</span><strong>Open PDF</strong><i>↗</i></a>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <a href="#top" className={styles.footerBrand}>MOOSAdex <span>↑ BACK TO ROUTE 01</span></a>
          <span>BUILT WITH CURIOSITY · {PROFILE.location.toUpperCase()} · © 2026</span>
        </footer>
      </main>
    </>
  );
}
