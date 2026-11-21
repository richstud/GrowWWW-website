import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

/** Cycles through words with a soft slide, e.g. "Built for manufacturers & exporters". */
export const RotatingWord = ({ words, interval = 2400 }: { words: string[]; interval?: number }) => {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || words.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval, reduce]);
  return (
    <span className="relative inline-flex min-w-[10ch] justify-center overflow-hidden align-bottom text-primary lg:justify-start" aria-live="off">
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap"
          aria-hidden
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/** Counts up the number inside a stat like "2015", "500+" or "24–48 hrs" when it scrolls into view. */
export const CountUp = ({ value, duration = 1400 }: { value: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const m = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const isYear = m && /^\d{4}$/.test(m[2]) && !m[1] && !m[3];
  const [n, setN] = useState(reduce || !m ? target : isYear ? target - 10 : 0);

  useEffect(() => {
    if (!inView || reduce || !m || Number.isNaN(target)) return;
    const from = isYear ? target - 10 : 0;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target]);

  if (!m) return <span ref={ref}>{value}</span>;
  const shown = isYear ? String(n) : n.toLocaleString("en-IN");
  return (
    <span ref={ref} className="tabular-nums">
      {m[1]}
      {shown}
      {m[3]}
    </span>
  );
};
