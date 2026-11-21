import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
  size = 200,
  duration = 12,
  delay = 0,
}: { className?: string; size?: number; duration?: number; delay?: number }) {
  return (
    <div
      style={{
        ["--size" as any]: size,
        ["--duration" as any]: `${duration}s`,
        ["--delay" as any]: `-${delay}s`,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,hsl(var(--primary)),transparent)] after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  );
}
