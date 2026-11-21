import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Globe, Megaphone, Pause, Play, Smartphone, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* Four illustrated examples of what GrowWWW builds. They rotate on their own; the tabs pick one. */

const SLIDES = [
  { id: "web", label: "Websites", icon: Globe, caption: "a business website that takes orders online" },
  { id: "app", label: "Mobile apps", icon: Smartphone, caption: "your own app, live on the Play Store" },
  { id: "ai", label: "AI automation", icon: Bot, caption: "an AI agent that answers customers and books work" },
  { id: "ads", label: "Digital marketing", icon: Megaphone, caption: "ads and Google ranking that bring in enquiries" },
] as const;

const DURATION = 4500;

/* ---------- 1. Website in a browser window ---------- */
const WebsiteScene = () => (
  <div className="flex h-full items-center justify-center p-4 sm:p-6">
    <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-[hsl(36_20%_95%)] text-[hsl(30_14%_10%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-1.5 border-b border-black/10 bg-white px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-black/5 px-2 py-0.5 text-[10px] text-black/50">sharmasweets.in</span>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 text-[10px]">
        <span className="font-display text-sm font-semibold">Sharma Sweets</span>
        <span className="flex gap-3 text-black/60"><span>Menu</span><span>Gifting</span><span>Visit</span></span>
      </div>
      <div className="grid grid-cols-[1.3fr_0.7fr] items-start gap-3 px-4 pb-4">
        <div className="pt-2">
          <p className="font-display text-[18px] leading-[1.05] sm:text-[22px]">Fresh mithai, delivered today.</p>
          <p className="mt-2 text-[10px] leading-snug text-black/60">Order before 2 PM for same-day delivery across Lucknow.</p>
          <span className="mt-3 inline-block rounded-full bg-[hsl(14_70%_45%)] px-3 py-1.5 text-[10px] font-semibold text-white">Order now</span>
        </div>
        <div className="mt-2 aspect-[4/5] rounded-lg" style={{ background: "radial-gradient(circle at 35% 35%, hsl(40 90% 70%), hsl(24 80% 45%))" }} />
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-black/10 px-4 py-3">
        {["Kaju katli", "Motichoor", "Gift box"].map((n, i) => (
          <div key={n} className="rounded-lg bg-white p-1.5 text-[9px]">
            <div className={cn("mb-1 h-9 rounded", ["bg-[hsl(40_40%_82%)]", "bg-[hsl(30_85%_62%)]", "bg-[hsl(350_45%_55%)]"][i])} />
            {n}
            <span className="block font-semibold">₹{[480, 320, 950][i]}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------- 2. App store listing on a phone ---------- */
const AppScene = () => (
  <div className="flex h-full items-center justify-center p-4">
    <div className="w-[230px] rounded-[2rem] border border-[hsl(38_40%_40%/0.6)] bg-[hsl(30_10%_9%)] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="overflow-hidden rounded-[1.6rem] bg-white px-4 pb-5 pt-3 text-[hsl(220_10%_15%)]">
        <div className="mx-auto mb-4 h-4 w-16 rounded-full bg-black" />
        <div className="flex gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(150 60% 40%), hsl(170 70% 30%))" }}>F</div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-tight">FreshKart</p>
            <p className="text-[11px] text-[hsl(150_60%_32%)]">Grocery delivery in 30 min</p>
            <p className="text-[10px] text-black/50">Contains ads</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-black/10 text-center text-[10px]">
          <div><p className="flex items-center justify-center gap-0.5 font-semibold">4.6 <Star className="h-2.5 w-2.5 fill-current" /></p><p className="text-black/50">2K reviews</p></div>
          <div><p className="font-semibold">10K+</p><p className="text-black/50">Downloads</p></div>
          <div><p className="font-semibold">3+</p><p className="text-black/50">Rated</p></div>
        </div>
        <span className="mt-4 block rounded-full bg-[hsl(165_98%_27%)] py-2 text-center text-[12px] font-semibold text-white">Install</span>
        <div className="mt-4 flex gap-2">
          {["hsl(150 50% 88%)", "hsl(40 80% 85%)", "hsl(200 60% 88%)"].map((c, i) => (
            <div key={i} className="h-28 flex-1 rounded-lg p-1.5" style={{ background: c }}>
              <div className="h-2 w-3/4 rounded bg-black/15" />
              <div className="mt-1.5 h-10 rounded bg-white/70" />
              <div className="mt-1.5 h-2 w-1/2 rounded bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ---------- 3. AI agent robot handling a customer ---------- */
const Robot = () => (
  <svg viewBox="0 0 160 160" className="h-36 w-36 sm:h-40 sm:w-40" aria-hidden>
    <defs>
      <linearGradient id="hs-shell" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="hsl(38 30% 92%)" />
        <stop offset="1" stopColor="hsl(36 12% 68%)" />
      </linearGradient>
      <radialGradient id="hs-eye">
        <stop offset="0" stopColor="hsl(44 100% 80%)" />
        <stop offset="1" stopColor="hsl(38 65% 55%)" />
      </radialGradient>
    </defs>
    <line x1="80" y1="18" x2="80" y2="36" stroke="hsl(36 12% 68%)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="80" cy="14" r="7" fill="url(#hs-eye)" className="animate-pulse" />
    <rect x="30" y="36" width="100" height="78" rx="30" fill="url(#hs-shell)" />
    <rect x="18" y="62" width="14" height="28" rx="7" fill="hsl(36 12% 60%)" />
    <rect x="128" y="62" width="14" height="28" rx="7" fill="hsl(36 12% 60%)" />
    <rect x="44" y="54" width="72" height="40" rx="20" fill="hsl(30 14% 8%)" />
    <circle cx="64" cy="74" r="8" fill="url(#hs-eye)" />
    <circle cx="96" cy="74" r="8" fill="url(#hs-eye)" />
    <path d="M70 102 Q80 108 90 102" stroke="hsl(30 14% 30%)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="52" y="118" width="56" height="30" rx="12" fill="url(#hs-shell)" />
    <circle cx="80" cy="133" r="5" fill="hsl(154 45% 40%)" />
  </svg>
);

const AiScene = ({ reduce }: { reduce: boolean | null }) => {
  const steps = ["New enquiry on your website", "AI agent replies in 5 seconds", "Meeting booked, CRM updated"];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-5" style={{ background: "radial-gradient(70% 50% at 50% 30%, hsl(154 34% 16%), transparent)" }}>
      <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <Robot />
      </motion.div>
      <ol className="w-full max-w-[300px] space-y-2">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.6 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px]",
              i === 2 ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-card/90 text-foreground/85"
            )}
          >
            <span className={cn("flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold", i === 2 ? "bg-primary text-primary-foreground" : "bg-[hsl(30_8%_18%)] text-foreground/70")}>{i + 1}</span>
            {s}
          </motion.li>
        ))}
      </ol>
    </div>
  );
};

/* ---------- 4. Marketing results ---------- */
const AdsScene = ({ reduce }: { reduce: boolean | null }) => {
  const bars = [22, 30, 28, 41, 52, 64, 78, 92];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5 sm:p-6">
      <div className="rounded-xl bg-white p-3 text-[hsl(220_10%_15%)] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)]">
        <div className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] text-black/60">best interior designer in navi mumbai</div>
        <div className="mt-3 rounded-lg border border-[hsl(38_65%_55%)] bg-[hsl(40_80%_96%)] p-2.5">
          <p className="text-[10px] text-black/50"><span className="font-semibold text-black/80">Sponsored</span> · urbannest.in</p>
          <p className="text-[13px] font-medium text-[hsl(225_70%_40%)]">Urban Nest Interiors - Free design visit</p>
          <p className="text-[10px] text-black/60">★ 4.8 · Open now · Vashi</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card/90 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-semibold">Enquiries per month</p>
          <p className="text-[11px] text-muted-foreground">Jan - Aug</p>
        </div>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              className={cn("flex-1 rounded-t", i === bars.length - 1 ? "bg-primary" : "bg-[hsl(38_40%_40%/0.6)]")}
              style={reduce ? { height: `${h}%` } : undefined}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {["Google Ads", "Instagram", "Google Maps"].map((c) => (
            <span key={c} className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HeroShowcase = () => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const running = !paused && !hover;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(t);
  }, [index, running]);

  const slide = SLIDES[index];

  return (
    <figure
      className="relative mx-auto w-full max-w-[440px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      aria-roledescription="carousel"
      aria-label="Examples of what we build"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[hsl(38_40%_40%/0.6)] shadow-[0_40px_120px_-40px_hsl(38_65%_50%/0.55)]" style={{ background: "radial-gradient(120% 80% at 50% 0%, hsl(38 45% 18%), hsl(30 15% 6%) 70%)" }}>
        <div className="relative h-[440px] sm:h-[480px]" aria-live={running ? "off" : "polite"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${SLIDES.length}: ${slide.label}`}
            >
              {slide.id === "web" && <WebsiteScene />}
              {slide.id === "app" && <AppScene />}
              {slide.id === "ai" && <AiScene reduce={reduce} />}
              {slide.id === "ads" && <AdsScene reduce={reduce} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tabs with a progress line for the active one */}
        <div className="grid grid-cols-4 border-t border-border/70 bg-background/70" role="tablist" aria-label="Choose an example">
          {SLIDES.map((s, i) => {
            const Icon = s.icon;
            const active = i === index;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-1 py-3 text-[11px] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:text-xs",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-center">{s.label}</span>
                {active && (
                  <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-border">
                    <span
                      key={`${index}-${running}`}
                      className="block h-full bg-primary"
                      style={running ? { animation: `hs-progress ${DURATION}ms linear forwards` } : { width: "100%" }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <figcaption className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span>Example: {slide.caption}</span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary"
          aria-label={paused ? "Play examples" : "Pause examples"}
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </button>
      </figcaption>
      <style>{`@keyframes hs-progress{from{width:0}to{width:100%}}`}</style>
    </figure>
  );
};
