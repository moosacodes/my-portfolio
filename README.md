# Moosa Alam — portfolio

An illustrated engineering workbench for Moosa Alam: a University of Guelph Computer Science co-op student interested in systems, Linux, networking, cloud infrastructure, and automation. Built with Next.js (App Router), static export, and Vercel deployment foundations.

## Tech stack

- **Next.js 15** — App Router, `output: "export"`
- **TypeScript · Tailwind CSS**
- **@vercel/analytics**

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

## Design system

- Warm off-white paper, deep ink, and a single moss green accent.
- Georgia display type paired with Outfit body copy and small JetBrains Mono annotations.
- Lightweight SVG drawings use topology, cables, ruled marks, and labeled inspection points.
- Motion is limited to Todd's explicit reactions and the user-controlled packet journey; reduced motion disables character movement.

## Architecture

| Path | Role |
|------|------|
| `components/site/Portfolio.tsx` | Workbench homepage, illustrations, project explanations, and interactions |
| `app/projects/user-space-vpn-tunnel/` | Source-backed VPN case study |
| `components/os/` | Existing desktop experiments and supporting routes |
| `components/todd/` | Existing Todd stage, layered rig, and lab route |
| `lib/portfolio/data.ts` | Single source of truth for profile content |
| `lib/os/window-store.tsx` | Window open/focus/minimize/maximize/close |
| `lib/terminal/commands.ts` | Safe frontend command interpreter |
| `lib/todd/todd-store.tsx` | Shared Todd state (UI + terminal) |
| `public/todd/` | Mascot artwork |

## Interactions

- Select the router, packet, or service host in the hero illustration for a concise explanation.
- Click Todd once to wake him, then again to trigger a short hop inside his reserved ledge.
- Start/reset the packet journey in the VPN project section. It is explicitly an illustrative simulation.
- All controls are keyboard reachable and support reduced-motion preferences.

## Asset provenance

| File | Use |
|------|-----|
| `public/todd/todd-original.png` | Canonical transparent sprite (source of truth) |
| `public/todd/todd-walk-a.png` / `todd-walk-b.png` | Walk cycle poses |
| `public/todd/todd-jump.png` | Jump / airborne pose |
| `public/todd/todd-startled.png` / `todd-dance.png` | Reaction / dance poses |

The homepage deliberately uses the existing canonical idle and jump assets only. It does not claim blinking, walking, or articulated movement from the flattened artwork.

## Resume

- PDF: `public/Moosa_Alam_Networking_Resume.pdf`
- In-OS Resume app + route `/resume`

## Future: public SSH portfolio

Inbound SSH cannot run on static Vercel hosting. A separate restricted SSH service (e.g. Go + Wish/Bubble Tea) is a later project and may optionally sync state through an authenticated backend. Not part of phase 1.

## License

© 2026 Moosa Alam. All rights reserved.
