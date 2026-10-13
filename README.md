# MOOSA.OS — Moosa Alam

Interactive desktop-style portfolio for Moosa Alam, featuring **Todd**, a lime-green frog mascot. Built with Next.js (App Router), static export, deployed on Vercel.

## Tech stack

- **Next.js 15** — App Router, `output: "export"`
- **TypeScript · Tailwind CSS · Framer Motion**
- **@vercel/analytics**
- Three.js is installed but unused in MOOSA.OS (kept for possible future experiments)

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```

Static export is configured in `next.config.ts`.

Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://moosaalam.vercel.app`) for canonical / Open Graph URLs.

## Architecture

| Path | Role |
|------|------|
| `components/os/` | Desktop shell, status bar, dock, window frames, mobile sheets |
| `components/apps/` | About, Projects, Experience, Skills, Education, Terminal, Resume, Contact |
| `components/todd/` | Todd stage, layered rig, movement |
| `lib/portfolio/data.ts` | Single source of truth for profile content |
| `lib/os/window-store.tsx` | Window open/focus/minimize/maximize/close |
| `lib/terminal/commands.ts` | Safe frontend command interpreter |
| `lib/todd/todd-store.tsx` | Shared Todd state (UI + terminal) |
| `public/todd/` | Mascot artwork |

## Controls

**Desktop**

- Dock / desktop icons open apps
- Drag window title bars; traffic-light buttons close / minimize / maximize
- Escape minimizes the focused window
- Status bar: Pause Todd · clock · chaos indicator

**Terminal** (safe interpreter — never runs a real shell)

- `help`, `whoami`, `about`, `projects`, `experience`, `skills`, `education`
- `resume`, `contact`, `github`, `open <app>`, `clear`, `history`
- Todd: `todd dance | sleep | come | status | chaos | pause | resume | help`
- Easter eggs: `sudo hire moosa`, `todd dance`, `todd chaos`
- ↑/↓ history · Tab autocomplete

**Todd**

- Hover — pupils track cursor
- Click — startled hop (escalates if spam-clicked)
- Drag — wiggle, then land
- Idle — occasional explore / nap when chaos allows
- `prefers-reduced-motion` and Pause Todd freeze autonomous motion
- Stage is `pointer-events: none` except Todd and marked safe controls (`data-todd-safe`)

## Asset provenance

| File | Use |
|------|-----|
| `public/todd/todd-original.png` | Canonical transparent sprite (source of truth) |
| `public/todd/todd-walk-a.png` / `todd-walk-b.png` | Walk cycle poses |
| `public/todd/todd-jump.png` | Jump / airborne pose |
| `public/todd/todd-startled.png` / `todd-dance.png` | Reaction / dance poses |

Todd uses a **pose sprite set + layered eye/lid/bow overlays** on the canonical idle art, driven by a physics/FSM movement engine (velocity, gravity, jump arcs, landmarks). Pose frames were derived from the original art; artist-authored matching frames would further improve style consistency.

## Resume

- PDF: `public/Moosa_Alam_Networking_Resume.pdf`
- In-OS Resume app + route `/resume`

## Future: public SSH portfolio

Inbound SSH cannot run on static Vercel hosting. A separate restricted SSH service (e.g. Go + Wish/Bubble Tea) is a later project and may optionally sync state through an authenticated backend. Not part of phase 1.

## License

© 2026 Moosa Alam. All rights reserved.
