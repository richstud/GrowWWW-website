import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
}

export const FadeIn = ({ children, delay = 0, y = 24, x = 0, once = true, className, ...rest }: RevealProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className,
  delayChildren = 0.1,
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
}) => {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={variants} className={className}>
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className, y = 24 }: { children: ReactNode; className?: string; y?: number }) => {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
};

export const Magnetic = ({ children, className, strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className={cn("inline-block", className)}>
      <div ref={ref} className="transition-transform duration-300 ease-out will-change-transform">
        {children}
      </div>
    </div>
  );
};

export const Spotlight = ({ className }: { className?: string }) => (
  <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
    <div className="absolute -top-24 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full blur-3xl opacity-60 animate-aurora"
      style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.35), transparent 70%)" }}
    />
    <div className="absolute bottom-0 right-0 h-[380px] w-[600px] rounded-full blur-3xl opacity-40 animate-aurora"
      style={{ background: "radial-gradient(closest-side, hsl(var(--primary-glow) / 0.28), transparent 70%)", animationDelay: "-4s" }}
    />
  </div>
);

export const TextReveal = ({ text, className }: { text: string; className?: string }) => {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: "0.6em", filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: i * 0.06, ease }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </span>
  );
};
