import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { InlineContactForm } from "@/components/InlineContactForm";
import { supabase } from "@/integrations/supabase/client";
import { youTubeThumb } from "@/lib/youtube";

export default function Products() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Seo path="/products" />
      <Navbar />
      <PageHero title="Ready-made software for growing businesses" intro="Tools we've built and refined for our clients, ready to set up for your business." current="Products" />

      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-border p-10 text-center">
              <p className="font-display text-2xl">Our products are being added.</p>
              <p className="mt-2 text-muted-foreground">Tell us what you need below and we'll show you what's available.</p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}>
                  <Link to={`/products/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card transition-colors hover:border-primary/60">
                    <div className="aspect-[16/10] overflow-hidden bg-[hsl(30_12%_6%)]">
                      {p.thumbnail_url || youTubeThumb(p.video_url) ? (
                        <img src={p.thumbnail_url || youTubeThumb(p.video_url)!} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-display text-3xl text-primary">{p.name}</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-display text-2xl">{p.name}</h2>
                      {p.short_description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short_description}</p>}
                      <div className="mt-auto flex items-center justify-between pt-6 text-sm">
                        <span className="text-foreground/80">{p.price_label || ""}</span>
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          See details <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm heading="Want a demo?" subheading="Tell us which product interests you - we'll set up a quick call within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
