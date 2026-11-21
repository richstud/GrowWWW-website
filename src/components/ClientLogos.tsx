import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { withClientLogoDisplayUrls } from "@/lib/clientLogoUrls";

interface ClientLogo {
  id: string;
  company_name: string;
  logo_url: string;
  display_logo_url?: string;
  display_order: number;
}

// Fallback: the logo files bundled in src/assets/client-logos are shown if the
// database is empty or can't be reached, so the section never disappears.
const bundled = import.meta.glob("@/assets/client-logos/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const FALLBACK_NAMES: Record<string, string> = {
  claimensuure: "Claim en Suure",
  "indalkar-gold-empire": "Indalkar Gold Empire",
  "smart-protocol-solutions": "Smart Protocol Solutions",
  vs: "VS",
  wizard: "Wizard Company",
  "circle-logo": "Circle Logo Company",
};

const fallbackLogos: ClientLogo[] = Object.entries(bundled).map(([path, url], i) => {
  const file = path.split("/").pop()!.replace(/\.[^.]+$/, "");
  return { id: `local-${file}`, company_name: FALLBACK_NAMES[file] ?? file, logo_url: url, display_logo_url: url, display_order: i };
});

interface Props {
  /** "compact" = slim strip under the hero; "full" = original large section. */
  variant?: "compact" | "full";
}

export const ClientLogos = ({ variant = "full" }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["client-logos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_logos").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return withClientLogoDisplayUrls((data || []) as ClientLogo[]);
    },
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "client_logos" }, () => {
        queryClient.invalidateQueries({ queryKey: ["client-logos"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const logos = data && data.length > 0 ? data : isLoading && !isError ? [] : fallbackLogos;
  const compact = variant === "compact";

  if (!isLoading && logos.length === 0) return null;

  // Repeat enough times for a seamless loop; the animation moves by exactly half the track.
  const half = Array.from({ length: Math.max(2, Math.ceil(8 / Math.max(logos.length, 1))) }, () => logos).flat();
  const track = [...half, ...half];

  return (
    <section className={compact ? "border-y border-border/60 bg-card/30 py-10" : "py-20 bg-secondary overflow-hidden"}>
      <div className="container mx-auto px-4">
        {compact ? (
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Brands that grew with us
          </p>
        ) : (
          <h2 className="mb-12 text-center text-4xl font-bold text-gradient-gold">Our Trusted Clients</h2>
        )}
        <div
          className="relative mx-auto max-w-6xl overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          }}
        >
          {isLoading && logos.length === 0 ? (
            <div className="flex gap-8 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`flex-shrink-0 rounded-xl bg-muted ${compact ? "h-16 w-40" : "h-24 w-48"}`} />
              ))}
            </div>
          ) : (
            <div className={`flex w-max animate-scroll-left-slow hover:[animation-play-state:paused] ${compact ? "gap-6" : "gap-16"}`}>
              {track.map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className={`flex flex-shrink-0 items-center justify-center rounded-xl border border-border/60 bg-[hsl(0_0%_10%)] ${
                    compact ? "h-20 w-48 p-3" : "h-40 w-96 p-4"
                  }`}
                  aria-hidden={index >= logos.length}
                >
                  <img
                    src={logo.display_logo_url || logo.logo_url}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    loading="lazy"
                    alt={index < logos.length ? `${logo.company_name} logo` : ""}
                    className="max-h-[80%] max-w-[85%] object-contain opacity-90 transition-opacity hover:opacity-100"
                    title={logo.company_name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
