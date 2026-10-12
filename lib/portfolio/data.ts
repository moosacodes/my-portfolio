export const PROFILE = {
  fullName: "Moosa Alam",
  shortName: "Moosa",
  tagline: "Computer Science @ Guelph · Systems · Cloud · Security",
  location: "Milton, Ontario",
  status: "Open to work",
  email: "malam20@uoguelph.ca",
  github: "https://github.com/moosacodes",
  githubHandle: "moosacodes",
  linkedin: "https://www.linkedin.com/in/moosa-alam",
  resumePdf: "/Moosa_Alam_Networking_Resume.pdf",
  resumePath: "/resume",
  lastUpdated: "September 2026",
  osVersion: "1.0.0",
} as const;

export const ABOUT = {
  paragraphs: [
    "Computer Science student at the University of Guelph focused on systems, cloud infrastructure, and security.",
    "Right now I'm building networking and Linux depth through hands-on labs, studying for AWS Cloud Practitioner and CCNA, and looking for infra, cloud, and networking co-op roles.",
  ],
  pathIntro:
    "A technical roadmap toward systems, cloud infrastructure, and security engineering.",
  path: [
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
    desc: "Python, Linux, TUN/TAP, UDP, Wireshark · Point-to-point VPN that encapsulates and routes IP packets between isolated endpoints with forwarding, NAT, firewall rules, and authenticated encryption.",
    href: "https://github.com/moosacodes/User-Space-VPN-Tunnel",
  },
] as const;

export const EXPERIENCE = [
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
] as const;

export const EDUCATION = {
  school: "University of Guelph",
  expected: "Expected Dec 2028",
  degree: "Bachelor of Computing (Co-op) · Computer Science",
  emphasis: "Area of emphasis: Cybersecurity",
  bullets: [
    "Coursework spanning systems, networking, databases, cloud, and security.",
    "Co-op stream with industry placements alongside technical projects.",
    "Planning undergraduate research in systems, cloud, or security topics.",
  ],
} as const;

export const CERTIFICATIONS = [
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
