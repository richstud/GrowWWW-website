# Library choices

Default toolkit. Pick the smallest set that ships the effect.

| Need | Library | Notes |
|---|---|---|
| Core motion, gestures, layout animation | `framer-motion` | Always installed. Use `motion.*`, `AnimatePresence`, `useScroll`, `useTransform`. |
| Scroll-linked reveals / parallax | `framer-motion` `useScroll` + `useTransform` | Prefer over GSAP. |
| Smooth scroll | `lenis` | Add only for long editorial/marketing sites. Wrap in a client-only effect. |
| Animated numbers | `@number-flow/react` | For stat counters. Falls back gracefully. |
| Icons | `lucide-react` | Already the Lovable default. |
| 3D visuals | `@react-three/fiber` + `@react-three/drei` | Opt-in only. Heavy bundle. |
| GSAP / ScrollTrigger | avoid | Only reach for it if framer-motion genuinely can't express the timeline. |

## Inspiration sources (patterns copied in, NOT installed)

- 21st.dev — component compositions
- MagicUI — border-beam, shimmer, marquee patterns
- React Bits — animated text/number patterns
- Motion Primitives — stagger/reveal patterns

Copy the pattern, adapt to the project's semantic tokens, never add these as dependencies.
