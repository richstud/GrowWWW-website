"use client";
import * as React from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export function NumberTicker({
  value,
  decimals = 0,
  className,
}: { value: number; decimals?: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: "0px" });

  React.useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  React.useEffect(() =>
    spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }),
  [spring, decimals]);

  return <span ref={ref} className={className}>0</span>;
}
