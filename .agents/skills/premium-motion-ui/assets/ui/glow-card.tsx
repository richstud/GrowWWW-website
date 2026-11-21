"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function GlowCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos({ x: -100, y: -100 })}
      className={cn("group relative overflow-hidden rounded-2xl border bg-card p-6", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary) / 0.15), transparent 40%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
