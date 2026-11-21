import { cn } from "@/lib/utils";

export function AnimatedGradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent animate-gradient-x",
        "bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)),hsl(var(--primary)))] bg-[length:200%_auto]",
        className,
      )}
    >
      {children}
    </span>
  );
}
