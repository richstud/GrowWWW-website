import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

// Illustrative price series and the bot's activity log - an example of the software, not a trading result.
const CANDLES = [
  [52, 58, 49, 56], [56, 60, 53, 54], [54, 57, 50, 51], [51, 55, 47, 53], [53, 59, 52, 58],
  [58, 63, 57, 61], [61, 62, 55, 57], [57, 64, 56, 63], [63, 70, 62, 68], [68, 72, 64, 66],
  [66, 71, 65, 70], [70, 78, 69, 76],
];
const LOG = [
  "Signal: breakout above day high",
  "Risk check passed - size 1 lot, stop-loss set",
  "Order sent through broker API",
  "Telegram alert sent to your phone",
];

/** A candlestick chart with the bot's actions appearing step by step. */
export const AlgoDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? LOG.length : 0);
  useEffect(() => {
    if (!on || reduce) return;
    const ts = LOG.map((_, i) => setTimeout(() => setStep(i + 1), 700 + i * 900));
    return () => ts.forEach(clearTimeout);
  }, [on, reduce]);

  const lo = 44, hi = 80, H = 120, W = 12 * 22;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;

  return (
    <div ref={ref} className="grid h-full min-h-[260px] gap-4 p-5 sm:min-h-[300px] sm:grid-cols-[1.2fr_1fr] sm:p-6">
      <div className="flex flex-col rounded-xl border border-border bg-background/60 p-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">NIFTY · 5 min</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">Bot running</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 10}`} className="mt-2 h-full min-h-[130px] w-full" preserveAspectRatio="none" aria-hidden>
          <line x1="0" x2={W} y1={y(64)} y2={y(64)} stroke="hsl(38 65% 62%)" strokeDasharray="4 4" strokeWidth="1" opacity="0.7" />
          {CANDLES.map(([o, h, l, c], i) => {
            const up = c >= o;
            const x = i * 22 + 11;
            const color = up ? "hsl(152 55% 48%)" : "hsl(0 65% 58%)";
            return (
              <motion.g key={i} initial={reduce ? false : { opacity: 0 }} animate={on ? { opacity: 1 } : {}} transition={{ delay: i * 0.05 }}>
                <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={color} strokeWidth="1.5" />
                <rect x={x - 6} width="12" y={y(Math.max(o, c))} height={Math.max(2, Math.abs(y(o) - y(c)))} fill={color} rx="1.5" />
              </motion.g>
            );
          })}
          {step >= 1 && <circle cx={11 * 22 + 11} cy={y(78) - 6} r="5" fill="hsl(38 65% 62%)" />}
        </svg>
      </div>
      <ol className="flex flex-col justify-center gap-2 text-[13px]">
        {LOG.map((t, i) => (
          <motion.li
            key={t}
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={step > i ? { opacity: 1, x: 0 } : { opacity: 0.25, x: 0 }}
            className="flex items-start gap-2 rounded-lg border border-border bg-card/80 px-3 py-2"
          >
            <Check className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${step > i ? "text-primary" : "text-muted-foreground"}`} />
            {t}
          </motion.li>
        ))}
      </ol>
    </div>
  );
};
