import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, MapPin, Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { projectImage, usePortfolio, type Project } from "@/lib/portfolio";
import { useSiteContent } from "@/lib/content";
import seo from "@/seo/seo.config.json";

/** A portfolio card used on the homepage and the portfolio page. */
export const ProjectCard = ({ p, large = false }: { p: Project; large?: boolean }) => (
  <Link to={`/portfolio/${p.slug}`} className="group block h-full">
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/60 hover:shadow-gold-glow"
    >
      <div className={`relative overflow-hidden bg-[hsl(0_0%_10%)] ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {p.cover_url ? (
          <img src={projectImage(p.cover_url)} alt={`${p.title} - ${p.client_name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-gold-soft">
            {p.logo_url ? (
              <img src={projectImage(p.logo_url)} alt={`${p.client_name} logo`} loading="lazy" className="max-h-[45%] max-w-[55%] object-contain" />
            ) : (
              <span className="font-display text-2xl font-bold text-gradient-gold">{p.client_name}</span>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        {p.logo_url && p.cover_url && (
          <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-background/90 p-1.5 backdrop-blur">
            <img src={projectImage(p.logo_url)} alt={`${p.client_name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-primary">
          <span>{p.client_name}</span>
          {p.industry && <span className="text-muted-foreground">{p.industry}</span>}
        </div>
        <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
        {p.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>}
        {p.services.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.services.slice(0, 4).map((s) => (
              <span key={s} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">{s}</span>
            ))}
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-primary">
          Read the case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </motion.article>
  </Link>
);

/** Featured projects from the admin panel. Hidden until at least one project is published. */
export const FeaturedWork = () => {
  const { data = [] } = usePortfolio({ limit: 3 });
  if (data.length === 0) return null;
  return (
    <section className="px-4 py-20 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <FadeIn className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-4xl md:text-6xl">Recent work</h2>
          </div>
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            See all projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </FadeIn>
        <StaggerContainer className={`grid gap-6 ${data.length === 1 ? "" : data.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {data.map((p) => (
            <StaggerItem key={p.id}>
              <ProjectCard p={p} large={data.length === 1} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

/** Client testimonials from the admin panel. Hidden while the list is empty. */
export const Testimonials = () => {
  const items = useSiteContent("testimonials");
  if (!items.length) return null;
  const track = items.length < 3 ? items : [...items, ...items];
  return (
    <section className="overflow-hidden border-y border-border/60 bg-card/40 py-20">
      <FadeIn className="mx-auto mb-10 max-w-2xl px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl">What clients say</h2>
      </FadeIn>
      <div
        className={items.length < 3 ? "container mx-auto grid max-w-5xl gap-5 px-4 md:grid-cols-2" : "flex w-max gap-5 px-4 hover:[animation-play-state:paused] motion-safe:animate-scroll-left-slow"}
      >
        {track.map((t, i) => (
          <figure key={i} className="w-[85vw] max-w-[380px] flex-shrink-0 rounded-3xl border border-border bg-background/70 p-6 sm:w-[380px]" aria-hidden={i >= items.length}>
            <Quote className="mb-3 h-6 w-6 text-primary" />
            {t.rating ? (
              <div className="mb-3 flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className={`h-4 w-4 ${k < (t.rating || 0) ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
            ) : null}
            <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold">{t.name}</span>
              {(t.role || t.company) && <span className="text-muted-foreground"> · {[t.role, t.company].filter(Boolean).join(", ")}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

/** The three offices, each linking to its city page (good for local SEO). */
export const OfficesBand = () => {
  const contact = useSiteContent("contact");
  const slugFor = (city: string) => seo.site.offices.find((o) => o.city === city)?.slug;
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <FadeIn className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Our offices</p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Local teams in <span className="text-gradient-gold">{contact.offices.map((o) => o.city).join(", ").replace(/, ([^,]*)$/, " & $1")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Meet us in person or work with us online - we serve businesses across India and worldwide.</p>
        </FadeIn>
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contact.offices.map((o) => {
            const slug = slugFor(o.city);
            const body = (
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/60">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <MapPin className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-display text-xl font-bold">{o.city}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{o.address || o.region}</p>
                {slug && (
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary">
                    Web design in {o.city} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </div>
            );
            return <StaggerItem key={o.city}>{slug ? <Link to={slug} className="block h-full">{body}</Link> : body}</StaggerItem>;
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};
