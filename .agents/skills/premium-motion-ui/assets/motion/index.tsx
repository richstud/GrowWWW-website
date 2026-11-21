"use client";
import * as React from "react";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, HTMLMotionProps, Variants } from "framer-motion";

/* ---------- FadeIn ---------- */
export function FadeIn({
  children,
  delay = 0,
  y = 12,
  duration = 0.6,
  className,
  ...rest
}: { children: React.ReactNode; delay?: number; y?: number; duration?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Stagger ---------- */
const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={staggerChild} className={className}>{children}</motion.div>;
}

/* ---------- Magnetic ---------- */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Spotlight (aurora mouse-follow) ---------- */
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 50, y: 50 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, hsl(var(--primary) / 0.15), transparent 40%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------- TextReveal (word-by-word) ---------- */
export function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
}: { children: string; as?: any; className?: string }) {
  const words = children.split(" ");
  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ staggerChildren: 0.06 }}
        style={{ display: "inline-block" }}
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: "0.5em" },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >
            {w}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ---------- Parallax ---------- */
export function Parallax({ children, offset = 40, className }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

/* ---------- Reveal (scroll-triggered) ---------- */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ children, className = "", speed = 30 }: { children: React.ReactNode; className?: string; speed?: number }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-[marquee_var(--d)_linear_infinite]" style={{ ["--d" as any]: `${speed}s` }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
