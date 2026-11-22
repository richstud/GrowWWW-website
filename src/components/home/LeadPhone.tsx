import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import logo from "@/assets/growww-logo-full.webp";

// Illustrative alerts - the kind of messages a client's phone receives after launch.
const ALERTS = [
  { source: "Website form", who: "Dental clinic, Thane", text: "Needs a website with online appointment booking." },
  { source: "Google Maps call", who: "Bakery, Lucknow", text: "Missed call returned automatically - wants a cake order page." },
  { source: "WhatsApp", who: "Exporter, Moradabad", text: "Asked for the brass catalogue PDF. Sent instantly." },
  { source: "Website form", who: "Coaching centre, Navi Mumbai", text: "Wants an admission form with fee payment." },
  { source: "Instagram ad", who: "Boutique, Bandra", text: "Interested in an online store with COD." },
];

const timeAgo = ["now", "2m", "9m", "21m", "1h"];

/** A phone that keeps receiving new-enquiry notifications - the outcome GrowWWW sells. */
export const LeadPhone = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? ALERTS.length : 1);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setCount((c) => (c >= ALERTS.length ? 1 : c + 1)), 2600);
    return () => clearInterval(t);
  }, [inView, reduce]);

  const visible = ALERTS.slice(0, count).reverse();
  const now = new Date();
  const clock = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: false });

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-[340px]">
      {/* Phone body */}
      <div className="relative rounded-[2.6rem] border border-[hsl(38_40%_40%/0.6)] bg-[hsl(30_10%_9%)] p-2.5 shadow-[0_40px_120px_-40px_hsl(38_65%_50%/0.55)]">
        <div className="relative h-[520px] overflow-hidden rounded-[2.1rem] bg-[radial-gradient(120%_70%_at_50%_0%,hsl(38_45%_22%),hsl(30_15%_6%)_70%)] sm:h-[560px]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-foreground/80">
            <span>{clock}</span>
            <span className="h-5 w-20 rounded-full bg-black" aria-hidden />
            <span aria-hidden>5G ▮▮▮</span>
          </div>
          {/* Lock screen clock */}
          <div className="mt-6 text-center">
            <p className="text-xs text-foreground/60">
              {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <p className="font-display text-6xl font-medium tracking-tight text-foreground/90">{clock}</p>
          </div>
          {/* Notifications */}
          <ul className="mt-6 space-y-2 px-3" aria-label="Example enquiry notifications">
            <AnimatePresence initial={false}>
              {visible.map((a) => {
                const i = ALERTS.indexOf(a);
                return (
                  <motion.li
                    key={a.who}
                    layout
                    initial={{ opacity: 0, y: -24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="rounded-2xl bg-[hsl(36_15%_88%/0.13)] p-3 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="" className="h-5 w-5 rounded-md bg-black object-contain" />
                      <span className="text-[11px] font-semibold text-foreground/85">GrowWWW Leads</span>
                      <span className="ml-auto text-[10px] text-foreground/50">{timeAgo[count - 1 - i] ?? ""}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] font-semibold leading-snug text-foreground">
                      {a.source}: {a.who}
                    </p>
                    <p className="text-[12px] leading-snug text-foreground/70">{a.text}</p>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-muted-foreground">Example: what your phone looks like once enquiries start coming in.</figcaption>
    </figure>
  );
};
