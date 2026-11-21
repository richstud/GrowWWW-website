import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-full",
          "px-7 py-3.5 text-[15px] font-semibold",
          "text-primary-foreground bg-gradient-gold shadow-elegant",
          "transition-transform duration-300 hover:scale-[1.03] active:scale-100",
          className
        )}
        {...rest}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
