# Design token contract

Every component in this kit reads color from CSS variables defined in `src/index.css`. Do not hardcode colors.

Required HSL tokens (values are just triples like `222 47% 11%`, no `hsl()` wrapper):

```
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--border
--ring
```

Optional but recommended for premium looks:

```
--primary-glow      /* lighter primary used by Spotlight and gradients */
--gradient-primary  /* e.g. linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow))) */
--shadow-elegant    /* e.g. 0 10px 30px -10px hsl(var(--primary) / 0.3) */
```

In components use `hsl(var(--primary))`, `bg-primary`, `text-foreground`, etc. Never `text-white`, `bg-black`, `bg-[#...]`.

Dark mode is toggled via the `.dark` class on `<html>` — token values swap there; components do not need conditional logic.
