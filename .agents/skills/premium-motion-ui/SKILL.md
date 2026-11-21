---
name: premium-motion-ui
description: Automatically apply premium motion and modern UI polish to any project. Triggers on new projects, landing pages, portfolios, marketing sites, dashboards, app shells, or any request that mentions modern, premium, classy, impressive, animated, motion, framer-motion, 21st.dev, magicui, or "make it look good". Installs framer-motion and drops in a curated motion + UI kit (FadeIn, Stagger, Magnetic, Spotlight, TextReveal, Parallax, Marquee, BorderBeam, ShimmerButton, AnimatedGradientText, NumberTicker, BentoGrid, GlowCard) wired to semantic design tokens.
---

# Premium Motion UI

Apply this skill by default whenever building or significantly redesigning a UI. Do not wait for the user to ask for animation — cinematic motion and modern polish are the baseline.

## Setup checklist (run once per project)

1. Install: `bun add framer-motion`. Add `lenis` when smooth scroll is needed, `@number-flow/react` when animated numeric counters are needed. Do NOT add `@react-three/fiber` unless the project actually needs 3D.
2. Copy every file from `assets/motion/` into `src/components/motion/`.
3. Copy every file from `assets/ui/` into `src/components/ui/` (do not overwrite existing shadcn primitives — the filenames here are additive).
4. Merge the keyframes and animations from `assets/tailwind-keyframes.ts` into the project's `tailwind.config.ts` under `theme.extend.keyframes` and `theme.extend.animation`.
5. Confirm `src/index.css` defines HSL semantic tokens (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--accent`, `--muted`, `--border`, `--ring`). All motion/UI components read from these — never hardcode `text-white`, `bg-black`, or hex colors in components.

## Default application recipes

- Hero: wrap in `<Spotlight>`, title uses `<TextReveal>`, subtitle uses `<FadeIn delay={0.2}>`, CTA row uses `<ShimmerButton>` + `<Magnetic>`.
- Section headings: `<TextReveal>` for the H2, `<FadeIn>` for the supporting copy.
- Feature grids / card lists: `<StaggerContainer>` around the list, `<StaggerItem>` on each child. Add `<BorderBeam>` inside high-value cards.
- Stats blocks: `<NumberTicker value={n} />` for each metric.
- Logo strips / testimonial rows: `<Marquee>`.
- Scroll sections beyond the fold: `<Reveal>` wrapper. Use `<Parallax>` sparingly on decorative art.

## Rules

- Motion must serve the content. If a page already feels dense, prefer `<FadeIn>` and `<StaggerContainer>` over `<Spotlight>` + `<BorderBeam>` stacking.
- Respect `prefers-reduced-motion` — framer-motion honors it automatically; do not override.
- Keep the palette semantic. If the project theme is light, `<Spotlight>` and `<BorderBeam>` still work because they use `hsl(var(--primary))`.
- Do not import from `assets/` at runtime — always copy into `src/` first.

See `references/libraries.md` for library choices, `references/design-tokens.md` for the token contract, and `references/recipes.md` for full page-section templates.
