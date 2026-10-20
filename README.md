# MOOSAALAM.DEV

Personal portfolio for Moosa Alam, a Computer Science student at the University of Guelph. The site is a pixel-art field journal inspired by classic handheld RPGs, with original map and network diagrams for systems, networking, cloud infrastructure, automation, and software projects.

## Stack

- Next.js App Router with static export
- TypeScript and CSS Modules
- Framer Motion and Vercel Analytics retained for existing project compatibility

## Development

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
```

## Structure

| Path | Role |
|------|------|
| `app/page.tsx` | Interactive pixel-art field journal homepage |
| `components/portfolio/` | Production portfolio and case-study presentation |
| `components/prototypes/` | Isolated design directions used during the redesign selection phase |
| `lib/portfolio/data.ts` | Verified profile, work, education, project, and contact data |
| `app/projects/user-space-vpn-tunnel/` | Detailed VPN project case study |
| `public/Moosa_Alam_Networking_Resume.pdf` | Résumé download |

## Design directions

The production direction is a **classic handheld RPG field journal**: route exploration, encounter cards, and a trainer profile rendered in original pixel-inspired CSS and SVG. The temporary comparison routes remain available:

- `/directions/archive`
- `/directions/workshop`
- `/directions/internet`

These routes are prototypes, not alternate production homepages.

## Content integrity

Project descriptions are based on the source repositories and résumé. The User-Space VPN Tunnel is presented as a learning implementation with framed UDP transport; it is not described as a production-secure or authenticated-encryption system.

© 2026 Moosa Alam. All rights reserved.
