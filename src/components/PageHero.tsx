import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { GoldSilk } from "@/components/GoldSilk";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  title: string;
  intro?: ReactNode;
  /** Breadcrumb trail, e.g. [{ label: "Services", to: "/services" }]. The current page is added automatically. */
  trail?: { label: string; to: string }[];
  current?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}

/** Shared editorial page header: large serif title, short intro, optional visual on the right. */
export const PageHero = ({ title, intro, trail = [], current, actions, aside, children }: Props) => {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:pt-32 md:pb-20 lg:pt-36">
      <GoldSilk strength={0.75} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden />
      <div className={`container relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 ${aside ? "lg:grid-cols-[1.15fr_0.85fr]" : ""}`}>
        <div className="min-w-0">
          {(trail.length > 0 || current) && (
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              {trail.map((t) => (
                <span key={t.to} className="inline-flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link to={t.to} className="hover:text-primary">{t.label}</Link>
                </span>
              ))}
              {current && (
                <span className="inline-flex items-center gap-1 text-foreground/80">
                  <ChevronRight className="h-3.5 w-3.5" /> {current}
                </span>
              )}
            </nav>
          )}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="max-w-4xl font-display text-[2.6rem] font-medium leading-[1.03] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>
          {(intro || actions || children) && (
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{intro}</div>}
              {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>}
              {children}
            </motion.div>
          )}
        </div>
        {aside && (
          <motion.div initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="min-w-0">
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const primaryBtn =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary-glow))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-[15px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary";
