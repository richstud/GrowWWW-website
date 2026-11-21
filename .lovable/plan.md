# Premium Motion UI — Always-On Skill

Goal: bake the Framer Motion + 21st.dev-style UI system into a Lovable skill that triggers automatically on any new project or "build me a site/app" request — no manual prompt needed. Also expand the toolkit with the best modern motion/UI libraries so output is consistently classy and impressive.

## What the skill will do (automatically)

Whenever a new UI is being built (landing page, portfolio, dashboard, marketing site, app shell, etc.), the agent will:

1. Install `framer-motion` (and, when the design calls for it, `lenis` for smooth scroll, `@number-flow/react` for animated numbers).
2. Drop in a reusable **motion kit** under `src/components/motion/`:
   - `FadeIn`, `StaggerContainer`, `StaggerItem`
   - `Magnetic` (cursor-magnet buttons)
   - `Spotlight` (aurora mouse-follow background)
   - `TextReveal` (word-by-word cinematic reveal)
   - `Parallax` (scroll-linked translate)
   - `Marquee` (infinite logo/testimonial strip)
   - `Reveal` (scroll-triggered viewport reveal)
3. Drop in **21st.dev-style UI primitives** under `src/components/ui/`:
   - `BorderBeam` (animated glow border)
   - `ShimmerButton` (gradient shimmer CTA)
   - `AnimatedGradientText`
   - `NumberTicker` (count-up stats)
   - `BentoGrid` (mixed-size feature grid)
   - `GlowCard` (hover glow surface)
4. Extend `tailwind.config.ts` with the required keyframes (`aurora`, `border-beam`, `shimmer-slide`, `gradient-x`, `marquee`, `shine`).
5. Enforce **semantic tokens** — every color pulls from `index.css` HSL variables so the effects re-theme per project (no hardcoded whites/blacks/purples).
6. Apply the effects tastefully by default: hero gets `Spotlight` + `TextReveal`, sections get `StaggerContainer`, CTAs get `ShimmerButton` + `Magnetic`, cards get subtle `BorderBeam` on hover.

## Auto-trigger (no manual prompt required)

The skill description will match broad UI-building intents so Lovable loads it automatically:
- "build a landing page / portfolio / marketing site / app / dashboard"
- "make it look premium / modern / impressive / classy"
- any new project scaffolding

You will not need to say "add framer motion" — it's applied by default.

## Library shortlist (best-in-class, curated)

Included in the skill's reference so the agent picks the right tool per situation:

| Need | Library |
|---|---|
| Core motion | `framer-motion` |
| Scroll-linked / timelines | `framer-motion` (useScroll) — GSAP only when truly needed |
| Smooth scroll | `lenis` |
| Animated numbers | `@number-flow/react` |
| Icons | `lucide-react` (already default) |
| 3D / hero visuals | `@react-three/fiber` + `@react-three/drei` (opt-in) |
| Component inspiration | 21st.dev, MagicUI, React Bits, Motion Primitives (patterns copied in, not installed as deps) |

## Files created by the skill setup

```
.agents/skills/premium-motion-ui/
├── SKILL.md                    # auto-trigger description + usage rules
├── references/
│   ├── libraries.md            # when to use which lib
│   ├── design-tokens.md        # semantic HSL token rules
│   └── recipes.md              # hero, features, CTA, testimonial patterns
└── assets/
    ├── motion/                 # FadeIn, Stagger, Magnetic, Spotlight, TextReveal, Parallax, Marquee, Reveal
    ├── ui/                     # BorderBeam, ShimmerButton, AnimatedGradientText, NumberTicker, BentoGrid, GlowCard
    └── tailwind-keyframes.ts   # keyframes to merge into tailwind.config.ts
```

On any new project, the agent copies the `assets/` into `src/`, merges the keyframes, and installs `framer-motion`.

## Technical notes

- Skill is activated via `skills--apply_draft` so it persists across all your future projects.
- Description is written broad enough ("modern UI", "landing page", "premium look", "new project") that Lovable's skill retrieval surfaces it automatically for essentially every new build.
- All components are self-contained React + Tailwind — zero lock-in, easy to extend per project.
- Semantic-token discipline is enforced in `SKILL.md` so the same components look different (and correct) in every project's theme.

## Out of scope (for now)

- Not enabling `@react-three/fiber` by default — only when a project asks for 3D. Keeps bundles lean.
- Not switching the default icon set or fonts — those stay per-project design decisions.
