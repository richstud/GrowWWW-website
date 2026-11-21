import { cn } from "@/lib/utils";

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[16rem]", className)}>{children}</div>;
}

export function BentoCard({
  children,
  className,
  span = "1x1",
}: { children: React.ReactNode; className?: string; span?: "1x1" | "2x1" | "1x2" | "2x2" }) {
  const spans: Record<string, string> = {
    "1x1": "",
    "2x1": "md:col-span-2",
    "1x2": "md:row-span-2",
    "2x2": "md:col-span-2 md:row-span-2",
  };
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg",
        spans[span],
        className,
      )}
    >
      {children}
    </div>
  );
}
