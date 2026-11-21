// Merge into tailwind.config.ts theme.extend.keyframes and theme.extend.animation.
export const premiumMotionKeyframes = {
  "border-beam": {
    "100%": { "offset-distance": "100%" },
  },
  "shimmer-slide": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
  "gradient-x": {
    "0%,100%": { "background-position": "0% 50%" },
    "50%": { "background-position": "100% 50%" },
  },
  aurora: {
    "0%,100%": { transform: "translate(0,0) scale(1)" },
    "50%": { transform: "translate(3%,-3%) scale(1.05)" },
  },
  marquee: {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-50%)" },
  },
  shine: {
    "0%": { "background-position": "200% 0" },
    "100%": { "background-position": "-200% 0" },
  },
} as const;

export const premiumMotionAnimations = {
  "border-beam": "border-beam var(--duration) infinite linear",
  "shimmer-slide": "shimmer-slide 2.5s infinite",
  "gradient-x": "gradient-x 6s ease infinite",
  aurora: "aurora 8s ease-in-out infinite",
  shine: "shine 3s linear infinite",
  // marquee uses inline --d duration, so class is `animate-[marquee_var(--d)_linear_infinite]`
} as const;
