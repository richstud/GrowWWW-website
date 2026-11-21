import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  background?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, shimmerColor = "hsl(var(--primary-foreground))", background = "hsl(var(--primary))", ...props }, ref) => (
    <button
      ref={ref}
      style={{ ["--shimmer-color" as any]: shimmerColor, background }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-medium text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer-slide before:bg-gradient-to-r before:from-transparent before:via-[var(--shimmer-color)]/30 before:to-transparent",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  ),
);
ShimmerButton.displayName = "ShimmerButton";
