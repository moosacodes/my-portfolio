# Moosa's World — implementation brief

## Product goal

Turn the portfolio into a fast, original pixel adventure that feels like discovering a handcrafted late-1990s handheld game. A recruiter should understand Moosa's strengths within 45 seconds, while curious visitors can explore project rooms, dialogue, sound, secrets, and short cutscenes.

The experience uses original characters, art direction, interface language, sounds, and locations. It must not reproduce Pokemon names, maps, characters, sprites, music, logos, or UI assets.

## Experience principles

- The town map is the portfolio navigation. There is no generic landing page beneath the loading sequence.
- Navigation is click or tap based. Selecting a location makes the character hop along a short authored path before the destination opens.
- Every location answers a recruiter question: who Moosa is, what he built, what changed because of it, and where to verify it.
- The main route has five project stops and finishes in under 45 seconds when using Quick Tour.
- Exploration rewards curiosity through optional NPC dialogue, scene changes, collectible signal shards, and keyboard secrets.
- Sound is opt in, remembers the visitor's preference, and uses original procedural effects.
- Reduced motion turns travel and cutscenes into immediate, readable state changes.

## Visual direction

- Canvas: compact red, charcoal, warm cream, muted green, and signal blue palette with a 1-bit dither texture.
- World: an original infrastructure town arranged around a central signal relay, with utility pipes, rails, antennas, server lights, and hand-placed environmental details.
- Character: curly dark hair with a visible mid taper silhouette, oversized Y2K jacket, wide trousers, chunky sneakers, and a small crossbody tech bag.
- Animation states: idle breathing, impatient foot tap, two-frame hop, four-direction travel, inspect, celebrate, and arrival pose.
- Interface: pixel dialogue box, location card, compact quest tracker, sound toggle, Quick Tour button, and an always-visible Resume action.
- Motion: short camera pan on arrival, foreground parallax, blinking equipment, drifting clouds, and small scene-specific effects. No long blocking transition after the initial load.

## World map and recruiter route

| Stop | Location | Recruiter question | Featured proof |
| --- | --- | --- | --- |
| 0 | Signal Square | Who is this? | Cloud, infrastructure, backend, networking, and security focus; AWS Cloud Practitioner |
| 1 | Reliability Station | Can he run systems? | Cloud-Native Reliability Platform and InfraPulse |
| 2 | Radar Observatory | Can he build a useful product? | OpenRoleRadar |
| 3 | Worker Foundry | Can he handle distributed systems? | Distributed Job Processing Platform |
| 4 | Security Watchtower | Can he detect and reduce risk? | Cloud Security Detection Platform and Permission Guard |
| 5 | Tunnel Exchange | Does he understand networks? | User-Space VPN Tunnel and Virtualized Network Home Lab |
| 6 | Guild Hall | Has he shipped with teams? | Synk, Vibez Music, J Healthcare, and UofG Cloud Club |
| 7 | Comms Tower | How do I contact him? | Email, LinkedIn, GitHub, and resume download |

Quick Tour visits stops 0 through 5 using a short guided sequence. Guild Hall and Comms Tower remain one tap away.

## Verified project content

### Reliability Station

**Cloud-Native Reliability Platform**

- Kubernetes, AWS, Terraform, Docker
- 12,000+ requests per minute across five services
- Failed deployment recovery under 60 seconds
- More than 95% of injected failures detected within 45 seconds

**InfraPulse — Infrastructure Reliability Platform**

- Python, AWS, Terraform, Docker
- Complete AWS networking, compute, and IAM rebuild in under ten minutes
- Four injected failures detected in under 45 seconds
- Repository: https://github.com/moosacodes/InfraPulse

### Radar Observatory

**OpenRoleRadar**

- Python, PostgreSQL, REST APIs, Astro, GitHub Actions
- More than 1,400 job postings from six ATS providers
- Five-minute discovery latency through parallel ingestion
- More than 15 searchable fields
- Repository: https://github.com/moosacodes/Open-Role-Radar

### Worker Foundry

**Distributed Job Processing Platform**

- Java, Spring Boot, PostgreSQL, Redis, Docker
- More than 25,000 jobs processed at over 500 jobs per minute with eight workers
- More than 98% transient failure recovery
- More than 300 requests per second at less than 120 ms p95 latency
- Do not show a source button until an exact public repository is verified.

### Security Watchtower

**Cloud Security Detection Platform**

- AWS, Python, Splunk, Docker
- More than 50,000 authentication and network events per day across three AWS hosts
- Six simulated attack techniques and twelve MITRE-mapped correlation rules
- Investigation time under five minutes
- Repository: https://github.com/moosacodes/AI-Powered-Security-Log-Intelligence-Platform

**Permission Guard — AWS IAM Security Analyzer**

- Python, AWS IAM, Terraform, GitHub Actions
- More than twenty high-risk permission patterns
- Blocked all fifteen insecure test changes in CI
- Repository: https://github.com/moosacodes/Permission-Guard

### Tunnel Exchange

**User-Space VPN Tunnel**

- Linux networking, TCP/IP, UDP, NAT, firewall policy
- Repository: https://github.com/moosacodes/User-Space-VPN-Tunnel

**Virtualized Network Home Lab**

- More than 10,000 packets at over 20 Mbps across two hosts
- Six of six routing, NAT, and firewall failures resolved across more than fifteen tests
- Repository: https://github.com/moosacodes/Virtualized-Network-Home-Lab

## Interaction model

1. The existing loading sequence completes and dissolves into an overhead town scene.
2. A short opening cutscene introduces Moosa through two dialogue beats, then returns control in under five seconds.
3. Hover or focus previews a location and its recruiter question.
4. Click or tap queues a short route. The avatar travels, arrives, and opens the location panel.
5. Project panels present one sentence, three outcome stats, the stack, and verified source or case-study actions.
6. Closing a panel returns to the map at that location. Previously visited places remain lit.
7. Quick Tour advances through the strongest five project scenes and can be exited at any time.

## Progression and secrets

- Visiting each core project lights one segment of the central relay.
- Five segments unlock a short completion cutscene and a recruiter summary card.
- Optional signal shards appear after specific interactions and reveal small build notes.
- A Konami-style keyboard sequence can trigger a palette shift and character celebration.
- NPC dialogue should reveal engineering decisions or personality without sports or language references.
- A hidden maintenance hatch can reveal the site's technical stack and accessibility controls.

## Component plan

- `PortfolioGame`: state machine for intro, map, travel, location, quick tour, and completion.
- `TownMap`: scalable scene with semantic location buttons and authored route points.
- `PlayerSprite`: CSS or inline SVG sprite with direction and animation state props.
- `LocationScene`: shared shell for project and biography interiors.
- `DialogueBox`: typewriter text with instant-complete behavior on click.
- `ProjectDossier`: concise recruiter content and verified links.
- `QuickTour`: ordered scene controller with progress and skip controls.
- `SoundController`: opt-in Web Audio effects with persisted preference.
- `QuestTracker`: visited locations, relay progress, and optional secrets.

All project, location, route, dialogue, and metric content belongs in typed data rather than JSX.

## Accessibility and responsive behavior

- Every location is a real button with a visible focus state and descriptive label.
- Arrow keys move focus between locations; Enter and Space activate them.
- Dialogue can be advanced with pointer, Enter, or Space.
- Mobile uses a full-width map, large tap targets, and bottom-sheet location panels.
- Text remains selectable and important links remain reachable without completing game progression.
- The resume action stays available from the first interactive frame.
- `prefers-reduced-motion` removes route and typewriter timing.
- Sound never starts before a user gesture.

## Acceptance criteria

- The first interactive frame is the town map, not a conventional portfolio section layout.
- A visitor can reach any featured project with one location selection and a short travel animation.
- Quick Tour communicates five strong projects in 45 seconds or less.
- All displayed metrics match the supplied resumes.
- Every source button points to a verified public repository; unverified projects omit the button.
- The character visibly reads as curly hair, mid taper, oversized Y2K clothing, wide trousers, and chunky shoes at the delivered sprite scale.
- Desktop, tablet, and phone layouts preserve the map metaphor and usable controls.
- Keyboard-only and reduced-motion paths expose all recruiter content.
- The project contains no copied Pokemon assets, names, audio, or layouts.

## Delivery slices

1. Replace the current page shell with the game state machine and typed content model.
2. Build the town map, location focus behavior, authored routes, and custom avatar.
3. Build project scenes, Guild Hall, Comms Tower, and recruiter copy.
4. Add Quick Tour, relay progression, completion cutscene, sound, and secrets.
5. Finish responsive, keyboard, reduced-motion, and visual polish passes.

