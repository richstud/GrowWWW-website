import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ExternalLink, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { InlineContactForm } from "@/components/InlineContactForm";
import { projectImage, usePortfolio, useProject } from "@/lib/portfolio";
import NotFound from "./NotFound";

export default function PortfolioDetail() {
  const { slug } = useParams();
  const { data: p, isLoading } = useProject(slug);
  const { data: all = [] } = usePortfolio({ limit: 4 });
  const more = all.filter((x) => x.slug !== slug).slice(0, 3);

  if (!isLoading && (!p || !p.is_published)) return <NotFound />;

  const story = p
    ? [
        { label: "The issue", text: p.challenge },
        { label: "What we fixed", text: p.solution },
        { label: "The result", text: p.result },
      ].filter((b) => b.text)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {p && (
        <Seo
          title={`${p.title} - ${p.client_name} | GrowWWW Case Study`}
          description={(p.summary || p.challenge || `${p.services.join(", ")} for ${p.client_name} by GrowWWW.`).slice(0, 155)}
          canonicalPath={`/portfolio/${p.slug}`}
          image={p.cover_url ? projectImage(p.cover_url) : undefined}
          schema={[
            {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: p.title,
              about: p.services.join(", "),
              description: p.summary || p.challenge || "",
              image: p.cover_url ? projectImage(p.cover_url) : undefined,
              url: `https://www.growwww.in/portfolio/${p.slug}`,
              creator: { "@id": "https://www.growwww.in/#organization" },
              sourceOrganization: { "@type": "Organization", name: p.client_name, url: p.website_url || undefined },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Portfolio", item: "https://www.growwww.in/portfolio" },
                { "@type": "ListItem", position: 2, name: p.title, item: `https://www.growwww.in/portfolio/${p.slug}` },
              ],
            },
          ]}
        />
      )}
      <Navbar />

      {isLoading || !p ? (
        <div className="container mx-auto max-w-5xl px-4 pt-36">
          <div className="h-12 w-2/3 animate-pulse rounded bg-card" />
          <div className="mt-8 aspect-[16/9] animate-pulse rounded-3xl bg-card" />
        </div>
      ) : (
        <>
          <section className="px-4 pb-12 pt-28 sm:pt-32 lg:pt-36">
            <div className="container mx-auto max-w-7xl">
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> All work
              </Link>
              <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                <div>
                  <p className="text-primary">{p.client_name}</p>
                  <h1 className="mt-3 font-display text-[2.5rem] font-medium leading-[1.04] sm:text-6xl">{p.title}</h1>
                  {p.summary && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{p.summary}</p>}
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 text-sm lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  {p.logo_url && (
                    <div className="col-span-2">
                      <img src={projectImage(p.logo_url)} alt={`${p.client_name} logo`} className="h-16 w-16 rounded-xl border border-border bg-[hsl(30_12%_6%)] object-contain p-1.5" />
                    </div>
                  )}
                  {p.industry && (
                    <div>
                      <dt className="text-muted-foreground">Industry</dt>
                      <dd className="mt-1">{p.industry}</dd>
                    </div>
                  )}
                  {p.location && (
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="mt-1 inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" />{p.location}</dd>
                    </div>
                  )}
                  {p.services.length > 0 && (
                    <div className="col-span-2">
                      <dt className="text-muted-foreground">What we did</dt>
                      <dd className="mt-1">{p.services.join(", ")}</dd>
                    </div>
                  )}
                  {p.website_url && (
                    <div className="col-span-2">
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        Visit their website <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </section>

          {p.cover_url && (
            <div className="container mx-auto max-w-7xl px-4">
              <img src={projectImage(p.cover_url)} alt={`${p.title} screenshot`} className="w-full rounded-[1.75rem] border border-border object-cover" />
            </div>
          )}

          {story.length > 0 && (
            <section className="px-4 py-16 md:py-24">
              <div className="container mx-auto max-w-7xl">
                {story.map((b) => (
                  <div key={b.label} className="grid gap-4 border-t border-border py-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-10">
                    <h2 className="font-display text-3xl md:text-4xl">{b.label}</h2>
                    <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-foreground/85 md:text-xl">{b.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.gallery.length > 0 && (
            <section className="px-4 pb-16">
              <div className="container mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
                {p.gallery.map((g, i) => (
                  <img key={g} src={projectImage(g)} alt={`${p.title} - image ${i + 1}`} loading="lazy" className="w-full rounded-2xl border border-border object-cover" />
                ))}
              </div>
            </section>
          )}

          {more.length > 0 && (
            <section className="border-t border-border px-4 py-16">
              <div className="container mx-auto max-w-7xl">
                <h2 className="font-display text-3xl md:text-4xl">More stories</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {more.map((m) => (
                    <li key={m.id}>
                      <Link to={`/portfolio/${m.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl border border-border p-5 transition-colors hover:border-primary">
                        <span>
                          <span className="block text-sm text-primary">{m.client_name}</span>
                          <span className="font-display text-xl">{m.title}</span>
                        </span>
                        <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}

      <section className="px-4 pt-8">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm heading="Want results like this?" subheading="Share a few details - we'll get back to you within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
