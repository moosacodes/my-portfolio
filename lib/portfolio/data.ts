export const PROFILE = {
  fullName: "Moosa Alam",
  shortName: "Moosa",
  tagline: "Computer Science @ Guelph · Systems · Cloud · Networking",
  location: "Milton, Ontario",
  status: "Open to work",
  email: "malam20@uoguelph.ca",
  github: "https://github.com/moosacodes",
  githubHandle: "moosacodes",
  linkedin: "https://www.linkedin.com/in/moosa-alam",
  resumePdf: "/Moosa_Alam_Networking_Resume.pdf",
  resumePath: "/resume",
  lastUpdated: "October 2026",
  osVersion: "1.0.0",
} as const;

export const ABOUT = {
  paragraphs: [
    "Computer Science co-op student at the University of Guelph, building depth in systems programming, Linux, networking, cloud infrastructure, and automation.",
    "I’m developing toward AI/HPC infrastructure and high-performance networking through hands-on labs and careful troubleshooting. I’m looking for software, systems, cloud, and networking opportunities.",
  ],
  pathIntro:
    "A technical roadmap toward systems, cloud infrastructure, and security engineering.",
  path: [
    {
      when: "Now",
      title: "Foundation",
      desc: "Systems and networking fundamentals, infrastructure labs, and a growing Linux and cloud toolkit.",
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
  ],
} as const;

export const PROJECTS = [
  {
    name: "Virtualized Network Home Lab",
    desc: "Linux, Docker, GitHub Actions, Wireshark · Segmented multi-host lab with isolated subnets, IPv4 routing, DNS, DHCP, NAT, SSH, and firewall rules — validated with ping, traceroute, and packet analysis.",
    href: "https://github.com/moosacodes/Virtualized-Network-Home-Lab",
  },
  {
    name: "User-Space VPN Tunnel",
    desc: "Python, Linux, TUN/TAP, UDP, Wireshark · Point-to-point learning tunnel that encapsulates and routes IP packets between isolated endpoints with forwarding, NAT, firewall rules, and a framed UDP transport.",
    href: "https://github.com/moosacodes/User-Space-VPN-Tunnel",
  },
] as const;

export const EXPERIENCE = [
  {
    role: "AI Systems Engineering Intern",
    org: "SYNK",
    period: "Apr 2026 – Sep 2026 · Remote",
    bullets: [
      "Analyzed runtime telemetry to enhance platform reliability by 18% for over 60 concurrent users.",
      "Identified performance bottlenecks, leading to a 14% reduction in frame-time degradation.",
      "Conducted stress tests on concurrent workloads, resulting in 12% improved system performance through actionable optimization recommendations.",
    ],
  },
  {
    role: "Software Engineer Intern",
    org: "Vibez Music",
    period: "Jan 2026 – Apr 2026 · Toronto, ON · Hybrid",
    bullets: [
      "Developed Python and Flask tools that automated operational processes, improving workflow throughput by over 40%.",
      "Enhanced system reliability through structured logging, request validation, and error handling.",
      "Implemented automated testing and deployment using GitHub Actions CI/CD, resolving integration and production issues.",
    ],
  },
  {
    role: "Academic Tutor & Mentor",
    org: "Licensed2Learn",
    period: "Nov 2024 – Jan 2025",
    bullets: [
      "Provided one-on-one tutoring in Math, CS, and English, helping students improve understanding and performance.",
    ],
  },
  {
    role: "Social Media Marketing Intern",
    org: "Mind4Youth",
    period: "Nov 2024 – Dec 2024",
    bullets: [
      "Helped grow Instagram engagement by 25% through targeted content and campaign visuals.",
    ],
  },
] as const;

export const EDUCATION = {
  school: "University of Guelph",
  expected: "Expected April 2029",
  degree: "Bachelor of Computing (Co-op) · Computer Science",
  emphasis: "Area of emphasis: Cybersecurity",
  bullets: [
    "Coursework spanning systems, networking, databases, cloud, and security.",
    "Co-op stream with industry placements alongside technical projects.",
    "Area of emphasis: Cybersecurity, with broader interests in systems and infrastructure.",
  ],
} as const;

export const CERTIFICATIONS = [
  {
    title: "AWS Certified Cloud Practitioner",
    meta: "Certified · Amazon Web Services",
    done: true,
  },
  {
    title: "CCNA",
    meta: "In progress · Cisco",
    done: false,
  },
] as const;

export const SKILLS = {
  networking: [
    "TCP/IP",
    "Subnetting",
    "VLANs",
    "DNS",
    "DHCP",
    "NAT",
    "Routing",
    "Switching",
    "ACLs",
    "VPN",
    "SSH",
    "Wireshark",
    "tcpdump",
  ],
  systems: [
    "Linux",
    "Python",
    "Bash",
    "C",
    "Docker",
    "Git",
    "GitHub Actions",
    "CI/CD",
    "Virtualization",
    "AWS",
  ],
  focus: ["Networking", "Systems", "Cloud", "Security"],
} as const;

export const LEADERSHIP = [
  {
    role: "Technical Lead",
    org: "The J Healthcare Initiative",
    desc: "Leading technical work and helping translate project goals into dependable, maintainable systems.",
  },
  {
    role: "Events Chair",
    org: "University of Guelph Cloud Computing Club",
    desc: "Organizing technical events that connect students with practical cloud and infrastructure work.",
  },
] as const;

export type AppId =
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "education"
  | "terminal"
  | "resume"
  | "contact";

export const APP_META: Record<
  AppId,
  { title: string; dockLabel: string; menuLabel: string }
> = {
  about: { title: "About", dockLabel: "About", menuLabel: "About" },
  projects: { title: "Projects", dockLabel: "Projects", menuLabel: "Projects" },
  experience: {
    title: "Experience",
    dockLabel: "Experience",
    menuLabel: "Experience",
  },
  skills: { title: "Skills", dockLabel: "Skills", menuLabel: "Skills" },
  education: {
    title: "Education",
    dockLabel: "Education",
    menuLabel: "Education",
  },
  terminal: { title: "Terminal", dockLabel: "Terminal", menuLabel: "Terminal" },
  resume: { title: "Resume", dockLabel: "Resume", menuLabel: "Resume" },
  contact: { title: "Contact", dockLabel: "Contact", menuLabel: "Contact" },
};

/** Menu bar order (matches mockup) */
export const MENU_ORDER: AppId[] = [
  "terminal",
  "projects",
  "about",
  "experience",
  "skills",
  "resume",
  "contact",
];

/** Primary dock icons (6, mockup-style) — Education still available via terminal/open */
export const DOCK_ORDER: AppId[] = [
  "terminal",
  "projects",
  "resume",
  "skills",
  "experience",
  "contact",
];

/** All apps for window registry */
export const ALL_APPS: AppId[] = [
  "terminal",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "resume",
  "contact",
];
