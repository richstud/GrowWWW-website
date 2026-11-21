import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { InlineContactForm } from "@/components/InlineContactForm";
import { PageHero } from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { withClientLogoDisplayUrls } from "@/lib/clientLogoUrls";
import { projectImage, usePortfolio, type Project } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { LogoWall } from "@/components/LogoWall";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** One client's case study: logo, issue and what we fixed - opens the full story. */
const CaseCard = ({ p }: { p: Project }) => (
  <Link to={`/portfolio/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card transition-colors hover:border-primary/60">
    <div className="relative aspect-[16/10] overflow-hidden bg-[hsl(30_12%_6%)]">
      {p.cover_url ? (
        <img src={projectImage(p.cover_url)} alt={`${p.title} for ${p.client_name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      ) : (
        <div className="flex h-full items-center justify-center">
          {p.logo_url ? (
            <img src={projectImage(p.logo_url)} alt={`${p.client_name} logo`} loading="lazy" className="max-h-[55%] max-w-[55%] object-contain" />
          ) : (
            <span className="font-display text-3xl text-primary">{p.client_name}</span>
          )}
        </div>
      )}
      {p.logo_url && p.cover_url && (
        <span className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-background/90 p-1.5">
          <img src={projectImage(p.logo_url)} alt={`${p.client_name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" />
        </span>
      )}
    </div>
    <div className="flex flex-1 flex-col p-6">
      <p className="text-sm text-primary">
        {p.client_name}
        {p.industry && <span className="text-muted-foreground"> - {p.industry}</span>}
      </p>
      <h2 className="mt-2 font-display text-2xl leading-snug">{p.title}</h2>
      {(p.challenge || p.summary) && (
        <dl className="mt-4 space-y-3 text-sm">
          {p.challenge && (
            <div>
              <dt className="font-semibold text-foreground">The issue</dt>
              <dd className="mt-0.5 line-clamp-2 text-muted-foreground">{p.challenge}</dd>
            </div>
          )}
          {p.solution && (
            <div>
              <dt className="font-semibold text-foreground">What we fixed</dt>
              <dd className="mt-0.5 line-clamp-2 text-muted-foreground">{p.solution}</dd>
            </div>
          )}
          {!p.challenge && p.summary && <dd className="line-clamp-3 text-muted-foreground">{p.summary}</dd>}
        </dl>
      )}
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary">
        Read the full story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </div>
  </Link>
);

export default function Portfolio() {
  const { data: projects = [], isLoading } = usePortfolio();
  const { data: clients = [] } = useQuery({
    queryKey: ["client-logos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_logos").select("*").order("display_order");
      if (error) throw error;
      return withClientLogoDisplayUrls(data || []);
    },
  });

  const filters = useMemo(() => ["All", ...new Set(projects.flatMap((p) => p.services))], [projects]);
  const [active, setActive] = useState("All");
  const shown = active === "All" ? projects : projects.filter((p) => p.services.includes(active));
  const projectFor = (name: string) => projects.find((p) => norm(p.client_name) === norm(name));

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path="/portfolio"
        schema={
          projects.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `https://www.growwww.in/portfolio/${p.slug}`, name: p.title })),
                },
              ]
            : []
        }
      />
      <Navbar />

      <PageHero
        title="Our portfolio isn't a gallery. It's stories of entrepreneurs."
        intro="What was holding each business back, what we fixed, and what changed - for clients in Mumbai, Lucknow, across India and abroad."
        current="Portfolio"
      />

      {/* Every client - logos link to their story when one is published */}
      {clients.length > 0 && (
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-7xl">
            <h2 className="font-display text-4xl md:text-5xl">Brands we've worked with</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {projects.length > 0 ? "Hover to pause. Click a logo with a story to read what we did for them." : "Businesses across India that trust us with their websites, apps and marketing."}
            </p>
            <div className="mt-10">
              <LogoWall
                clients={clients}
                storyFor={(name) => {
                  const p = projectFor(name);
                  return p ? `/portfolio/${p.slug}` : undefined;
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Case studies */}
      {(isLoading || projects.length > 0) && (
        <section className="border-t border-border px-4 py-20">
          <div className="container mx-auto max-w-7xl">
            <h2 className="mb-8 font-display text-4xl md:text-5xl">Client stories</h2>
            {filters.length > 2 && (
              <div className="-mx-4 mb-8 overflow-x-auto px-4 [scrollbar-width:none]">
                <div className="flex w-max gap-2" role="tablist" aria-label="Filter by service">
                  {filters.map((f) => (
                    <button
                      key={f}
                      role="tab"
                      aria-selected={active === f}
                      onClick={() => setActive(f)}
                      className={cn(
                        "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
                        active === f ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-card" />)}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((p) => <CaseCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="px-4 pt-8">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm heading="Want to be our next story?" subheading="Tell us what's holding your business back. We'll reply within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
