import {
  ABOUT,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILLS,
  type AppId,
} from "@/lib/portfolio/data";
import type { ToddCommand } from "@/lib/todd/types";

export type TerminalContext = {
  openApp: (id: AppId) => void;
  toddCommand: (cmd: ToddCommand) => string;
};

export type CommandResult = {
  lines: string[];
  clear?: boolean;
};

const APP_ALIASES: Record<string, AppId> = {
  about: "about",
  projects: "projects",
  project: "projects",
  experience: "experience",
  skills: "skills",
  education: "education",
  terminal: "terminal",
  resume: "resume",
  contact: "contact",
};

export const COMMAND_NAMES = [
  "help",
  "whoami",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "resume",
  "contact",
  "github",
  "open",
  "clear",
  "history",
  "todd",
  "sudo",
] as const;

export function autocomplete(input: string, history: string[]): string | null {
  const trimmed = input.trimStart();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    const matches = COMMAND_NAMES.filter((c) => c.startsWith(parts[0].toLowerCase()));
    if (matches.length === 1) return matches[0] + (matches[0] === "open" || matches[0] === "todd" || matches[0] === "sudo" ? " " : "");
    return null;
  }

  const cmd = parts[0].toLowerCase();
  const partial = parts[parts.length - 1].toLowerCase();

  if (cmd === "open") {
    const apps = Object.keys(APP_ALIASES);
    const matches = apps.filter((a) => a.startsWith(partial));
    if (matches.length === 1) {
      return `open ${matches[0]}`;
    }
  }

  if (cmd === "todd") {
    const toddCmds = ["dance", "sleep", "come", "status", "chaos", "help", "pause", "resume"];
    const matches = toddCmds.filter((a) => a.startsWith(partial));
    if (matches.length === 1) return `todd ${matches[0]}`;
  }

  if (cmd === "sudo") {
    if ("hire".startsWith(partial)) return "sudo hire ";
    if (parts[1]?.toLowerCase() === "hire" && "moosa".startsWith(partial)) {
      return "sudo hire moosa";
    }
  }

  void history;
  return null;
}

export function runCommand(
  raw: string,
  ctx: TerminalContext,
  history: string[]
): CommandResult {
  const line = raw.trim();
  if (!line) return { lines: [] };

  const [head, ...rest] = line.split(/\s+/);
  const cmd = head.toLowerCase();
  const arg = rest.join(" ").trim();

  switch (cmd) {
    case "help":
      return {
        lines: [
          "MOOSA.OS terminal — safe frontend interpreter (no shell exec).",
          "",
          "Navigation:",
          "  about | projects | experience | skills | education",
          "  resume | contact | github | open <app>",
          "",
          "System:",
          "  whoami · help · clear · history",
          "",
          "Todd:",
          "  todd dance | sleep | come | status | chaos | pause | resume | help",
          "",
          "Easter eggs:",
          "  sudo hire moosa · todd dance · todd chaos",
          "",
          "Tips: ↑/↓ history · Tab autocomplete · Esc blurs input",
        ],
      };

    case "whoami":
      return {
        lines: [
          PROFILE.fullName,
          PROFILE.tagline,
          PROFILE.location,
          PROFILE.status,
        ],
      };

    case "about":
      ctx.openApp("about");
      return {
        lines: [...ABOUT.paragraphs, "", `Opened ${APP_ALIASES.about} window.`],
      };

    case "projects":
      ctx.openApp("projects");
      return {
        lines: [
          ...PROJECTS.flatMap((p, i) => [
            `${i + 1}. ${p.name}`,
            `   ${p.desc}`,
            `   ${p.href}`,
            "",
          ]),
          "Opened projects window.",
        ],
      };

    case "experience":
      ctx.openApp("experience");
      return {
        lines: [
          ...EXPERIENCE.flatMap((e) => [
            `${e.role} — ${e.org}`,
            `  ${e.period}`,
            `  ${e.desc}`,
            "",
          ]),
          "Opened experience window.",
        ],
      };

    case "skills":
      ctx.openApp("skills");
      return {
        lines: [
          `Networking: ${SKILLS.networking.join(", ")}`,
          `Systems: ${SKILLS.systems.join(", ")}`,
          `Focus: ${SKILLS.focus.join(", ")}`,
          "",
          "Certifications:",
          ...CERTIFICATIONS.map(
            (c) => `  · ${c.title} — ${c.meta}`
          ),
          "",
          "Opened skills window.",
        ],
      };

    case "education":
      ctx.openApp("education");
      return {
        lines: [
          EDUCATION.school,
          EDUCATION.degree,
          EDUCATION.emphasis,
          EDUCATION.expected,
          ...EDUCATION.bullets.map((b) => `  → ${b}`),
          "",
          "Opened education window.",
        ],
      };

    case "resume":
      ctx.openApp("resume");
      return {
        lines: [
          `Resume PDF: ${PROFILE.resumePdf}`,
          `Preview route: ${PROFILE.resumePath}`,
          "Opened resume window.",
        ],
      };

    case "contact":
      ctx.openApp("contact");
      return {
        lines: [
          `Email: ${PROFILE.email}`,
          `GitHub: ${PROFILE.github}`,
          `LinkedIn: ${PROFILE.linkedin}`,
          "Opened contact window.",
        ],
      };

    case "github":
      if (typeof window !== "undefined") {
        window.open(PROFILE.github, "_blank", "noopener,noreferrer");
      }
      return { lines: [`Opening ${PROFILE.github}`] };

    case "open": {
      const key = arg.toLowerCase();
      const id = APP_ALIASES[key];
      if (!id) {
        return {
          lines: [
            `Unknown app "${arg || ""}". Try: ${Object.keys(APP_ALIASES).join(", ")}`,
          ],
        };
      }
      ctx.openApp(id);
      return { lines: [`Opened ${id}.`] };
    }

    case "clear":
      return { lines: [], clear: true };

    case "history":
      return {
        lines:
          history.length === 0
            ? ["(empty)"]
            : history.map((h, i) => `${i + 1}  ${h}`),
      };

    case "todd": {
      const sub = (rest[0] || "help").toLowerCase() as ToddCommand;
      const allowed: ToddCommand[] = [
        "dance",
        "sleep",
        "come",
        "status",
        "chaos",
        "help",
        "pause",
        "resume",
      ];
      if (!allowed.includes(sub)) {
        return { lines: [`Unknown todd command. Try todd help.`] };
      }
      return { lines: [ctx.toddCommand(sub)] };
    }

    case "sudo": {
      const phrase = rest.map((s) => s.toLowerCase()).join(" ");
      if (phrase === "hire moosa") {
        return {
          lines: [
            "[sudo] authenticating…",
            "Access granted.",
            "",
            "Hiring packet assembled:",
            `  → Email ${PROFILE.email}`,
            `  → Resume ${PROFILE.resumePdf}`,
            `  → GitHub ${PROFILE.github}`,
            "",
            "Moosa is open to infra, cloud, and networking co-op roles.",
            "(This easter egg does not modify any site content.)",
          ],
        };
      }
      return {
        lines: [
          "Permission denied. Did you mean: sudo hire moosa",
          "(No real privileges exist in this terminal.)",
        ],
      };
    }

    default:
      return {
        lines: [
          `moosa: command not found: ${cmd}`,
          "Type `help` for available commands. This is not a system shell.",
        ],
      };
  }
}
