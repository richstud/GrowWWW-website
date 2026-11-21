import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Monitor, Search, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlgoDemo } from "@/components/home/AlgoDemo";

const Tile = ({ href, title, text, children, className }: { href: string; title: string; text: string; children: ReactNode; className?: string }) => (
  <article className={cn("group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card", className)}>
    <div className="relative flex-1 overflow-hidden border-b border-border/70 bg-[hsl(30_12%_6%)]">{children}</div>
    <div className="flex items-end justify-between gap-4 p-5 sm:p-6">
      <div className="max-w-md">
        <h3 className="font-display text-2xl font-medium leading-tight sm:text-[1.7rem]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{text}</p>
      </div>
      <Link
        to={href}
        aria-label={`More about ${title}`}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
      >
        <ArrowUpRight className="h-5 w-5" />
      </Link>
    </div>
    <Link to={href} className="absolute inset-0" aria-hidden tabIndex={-1} />
  </article>
);

const useStart = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  return { ref, on: inView || !!reduce, reduce: !!reduce };
};

/* 1. A website assembling itself, with a desktop / phone switch */
export const WebsiteDemo = () => {
  const { ref, on } = useStart();
  const [phone, setPhone] = useState(false);
  const block = (d: number, cls: string) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={on ? { opacity: 1, y: 0 } : {}} transition={{ delay: d, duration: 0.5 }} className={cls} />
  );
  return (
    <div ref={ref} className="flex h-[280px] flex-col items-center justify-center gap-3 p-5 sm:h-[300px]">
      <div className="relative z-10 flex self-end rounded-full border border-border bg-background/80 p-1 text-xs">
        {[
          { v: false, icon: Monitor, l: "Desktop" },
          { v: true, icon: Smartphone, l: "Phone" },
        ].map(({ v, icon: Icon, l }) => (
          <button
            key={l}
            onClick={(e) => {
              e.preventDefault();
              setPhone(v);
            }}
            className={cn("relative z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1", phone === v ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            aria-pressed={phone === v}
          >
            <Icon className="h-3.5 w-3.5" /> {l}
          </button>
        ))}
      </div>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        className={cn("overflow-hidden rounded-xl border border-border bg-[hsl(36_20%_93%)] shadow-2xl", phone ? "h-[220px] w-[118px] sm:h-[250px]" : "h-[190px] w-full max-w-[440px] sm:h-[220px]")}
      >
        <div className="flex items-center gap-1 border-b border-black/10 bg-white/70 px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
          <span className="ml-2 h-2 flex-1 rounded bg-black/10" />
        </div>
        <div className={cn("space-y-2 p-3", phone && "p-2")}>
          {block(0.1, "h-2.5 w-1/3 rounded bg-[hsl(30_15%_12%)]")}
          {block(0.3, cn("rounded-lg bg-[linear-gradient(120deg,hsl(38_55%_55%),hsl(32_50%_38%))]", phone ? "h-16" : "h-16 sm:h-20"))}
          <div className={cn("grid gap-2", phone ? "grid-cols-1" : "grid-cols-3")}>
            {block(0.5, "h-10 rounded-md bg-black/10")}
            {block(0.6, "h-10 rounded-md bg-black/10")}
            {block(0.7, cn("h-10 rounded-md bg-black/10", phone && "hidden"))}
          </div>
          {block(0.9, "mx-auto h-5 w-24 rounded-full bg-[hsl(154_34%_20%)]")}
        </div>
      </motion.div>
    </div>
  );
};

/* 2. An app screen */
export const AppDemo = () => {
  const { ref, on } = useStart();
  const rows = ["Order #1042 · Delivered", "Order #1043 · Out for delivery", "Order #1044 · Packed", "Order #1045 · New"];
  return (
    <div ref={ref} className="flex h-[260px] items-end justify-center pt-6 sm:h-[300px]">
      <div className="h-[250px] w-[150px] rounded-t-[1.6rem] border border-b-0 border-[hsl(38_40%_40%/0.6)] bg-[hsl(30_10%_10%)] p-2 pb-0 sm:h-[280px] sm:w-[165px]">
        <div className="h-full rounded-t-[1.2rem] bg-[hsl(36_20%_93%)] p-3 text-[hsl(30_15%_12%)]">
          <p className="text-[10px] font-semibold opacity-60">Good morning</p>
          <p className="font-display text-lg leading-tight">Today's orders</p>
          <div className="mt-3 space-y-1.5">
            {rows.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: 16 }}
                animate={on ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 text-[9px] shadow-sm"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-emerald-600" : i === 3 ? "bg-[hsl(38_60%_50%)]" : "bg-black/30")} />
                {r}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 3. An AI agent replying to a customer */
export const AutomationDemo = () => {
  const { ref, on, reduce } = useStart();
  const [step, setStep] = useState(reduce ? 3 : 0);
  useEffect(() => {
    if (!on || reduce) return;
    const ts = [600, 1700, 2900].map((d, i) => setTimeout(() => setStep(i + 1), d));
    return () => ts.forEach(clearTimeout);
  }, [on, reduce]);
  return (
    <div ref={ref} className="flex h-[260px] flex-col justify-end gap-2 bg-[hsl(154_20%_8%)] p-5 text-[13px] sm:h-[300px]">
      {step >= 1 && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-[hsl(30_8%_18%)] px-3 py-2">
          Hi, what's the price for a 5-page website?
        </motion.p>
      )}
      {step >= 2 && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-[hsl(154_34%_24%)] px-3 py-2">
          Thanks for asking! Here's our price list and 3 recent sites. Shall we call you today at 4 PM?
        </motion.p>
      )}
      {step >= 3 && (
        <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 self-center rounded-full border border-primary/40 px-3 py-1 text-[11px] text-primary">
          <Check className="h-3.5 w-3.5 flex-shrink-0" /> Added to your lead sheet, reminder set
        </motion.p>
      )}
      {step === 0 && <span className="self-center text-xs text-muted-foreground">Waiting for a customer…</span>}
    </div>
  );
};

/* 4. Climbing Google results */
export const SeoDemo = () => {
  const { ref, on } = useStart();
  const others = ["A1 Web Solutions", "CityDesign Studio", "Bright Pixels", "WebCraft India", "Sai Infotech"];
  const pos = on ? 0 : 5;
  const list = [...others];
  list.splice(pos, 0, "Your business");
  return (
    <div ref={ref} className="h-[260px] p-5 sm:h-[300px] sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">website designer in navi mumbai</span>
        </div>
        <ol className="mt-3 space-y-1.5">
          {list.map((name, i) => (
            <motion.li
              key={name}
              layout
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: name === "Your business" ? 0.4 : 0 }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                name === "Your business" ? "border border-primary/50 bg-primary/10 text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="w-4 text-xs tabular-nums opacity-60">{i + 1}</span>
              <span className="truncate">{name}</span>
              {name === "Your business" && <span className="ml-auto hidden whitespace-nowrap text-[11px] text-primary sm:inline">★ 4.9, open now</span>}
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
};

/** Bento grid of the services, each showing the thing it builds. */
export const ServiceBento = () => (
  <div className="grid gap-4 md:grid-cols-6 md:gap-5">
    <Tile className="md:col-span-4" href="/services/web-design" title="Websites & online stores" text="Fast, mobile-first sites and stores with UPI and COD, built to turn visitors into enquiries.">
      <WebsiteDemo />
    </Tile>
    <Tile className="md:col-span-2" href="/services/software-solutions" title="Mobile apps & software" text="Android, iOS and custom software around how your team works.">
      <AppDemo />
    </Tile>
    <Tile className="md:col-span-2" href="/services/automations" title="AI & software automation" text="AI agents that reply to customers, follow up and update your lead sheet on their own.">
      <AutomationDemo />
    </Tile>
    <Tile className="md:col-span-4" href="/services/digital-marketing" title="SEO, Google Maps & ads" text="Get found when people nearby search for what you sell - then turn those searches into calls.">
      <SeoDemo />
    </Tile>
    <Tile className="md:col-span-6" href="/services/algo-trading" title="Algo trading software" text="Your trading strategy turned into a bot that watches the market, places orders through your broker and alerts you on Telegram.">
      <AlgoDemo />
    </Tile>
  </div>
);
