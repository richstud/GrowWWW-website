import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { InlineContactForm } from "@/components/InlineContactForm";
import { PageHero, primaryBtn, secondaryBtn } from "@/components/PageHero";
import { serviceFaqSchema } from "@/components/ServiceSeoBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteContent, waLink } from "@/lib/content";
import seo from "@/seo/seo.config.json";
import { QuoteLink } from "@/components/QuoteLink";

type Cfg = { h1: string; intro: string; included?: string[]; faqs?: { q: string; a: string }[] };

export const SERVICE_LINKS = [
  { to: "/services/web-design", label: "Websites & online stores" },
  { to: "/services/software-solutions", label: "Mobile apps & software" },
  { to: "/services/automations", label: "AI & software automation" },
  { to: "/services/digital-marketing", label: "SEO, Google Maps & ads" },
  { to: "/services/algo-trading", label: "Algo trading software" },
];

export const STEPS = [
  { title: "Discover", copy: "We learn your business and goals, then send a written scope and quote." },
  { title: "Design", copy: "You see the look and flow before a line of code is written." },
  { title: "Build", copy: "We develop, test on real phones and set up SEO, analytics and automation." },
  { title: "Launch & grow", copy: "We go live, get you found on Google and keep improving with you." },
];

export const ProcessBand = ({ title = "How a project runs" }: { title?: string }) => (
  <section className="bg-racing px-4 py-20 text-racing-foreground md:py-24">
    <div className="container mx-auto max-w-7xl">
      <h2 className="max-w-2xl font-display text-4xl leading-[1.05] md:text-5xl">{title}</h2>
      <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {STEPS.map((s, i) => (
          <li key={s.title} className="border-t border-[hsl(40_35%_90%/0.25)] pt-5">
            <span className="font-display text-5xl text-primary">{i + 1}</span>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-racing-foreground/75">{s.copy}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/** Two-column typographic list with a heading on the left. */
export const ListSection = ({ title, intro, rows, paper = false }: { title: string; intro?: string; rows: { name: string; text?: string }[]; paper?: boolean }) => (
  <section className={`px-4 py-20 md:py-24 ${paper ? "bg-paper text-paper-foreground" : ""}`}>
    <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">{title}</h2>
        {intro && <p className={`mt-5 max-w-sm ${paper ? "text-paper-muted" : "text-muted-foreground"}`}>{intro}</p>}
      </div>
      <ul className={`divide-y border-y ${paper ? "divide-paper-border border-paper-border" : "divide-border border-border"}`}>
        {rows.map((r) => (
          <li key={r.name} className={`grid gap-1 py-5 ${r.text ? "sm:grid-cols-[1fr_1.3fr] sm:gap-8" : ""}`}>
            <span className={r.text ? "font-display text-2xl" : "text-base leading-relaxed sm:text-lg"}>{r.name}</span>
            {r.text && <span className={`text-sm leading-relaxed sm:pt-1.5 ${paper ? "text-paper-muted" : "text-muted-foreground"}`}>{r.text}</span>}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

interface Props {
  path: string;
  title?: string;
  demo: ReactNode;
  formService: string;
  formHeading: string;
  extra?: { title: string; intro?: string; rows: { name: string; text?: string }[] };
  /** Short note shown under the lists, e.g. a risk disclaimer. */
  note?: string;
}

/** Shared layout for the four service pages. Copy, "what's included" and FAQs come from src/seo/seo.config.json. */
export function ServicePage({ path, title, demo, formService, formHeading, extra, note }: Props) {
  const cfg = (seo.pages as Record<string, Cfg>)[path];
  const contact = useSiteContent("contact");
  const others = SERVICE_LINKS.filter((s) => s.to !== path);

  return (
    <div className="min-h-screen bg-background">
      <Seo path={path} schema={serviceFaqSchema(path)} />
      <Navbar />

      <PageHero
        title={title || cfg.h1}
        intro={cfg.intro}
        trail={[{ label: "Services", to: "/services" }]}
        current={cfg.h1}
        actions={
          <>
            <QuoteLink className={primaryBtn}>
              Get a free quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </QuoteLink>
            <a href={waLink(contact.whatsapp, `Hi GrowWWW, I'm interested in ${cfg.h1.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </>
        }
        aside={<div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-[hsl(30_12%_6%)]">{demo}</div>}
      />

      {cfg.included && (
        <ListSection
          title="What's included"
          intro={`Everything you need from one team, with offices in ${seo.site.offices.map((o) => o.city).join(", ").replace(/, ([^,]*)$/, " and $1")}.`}
          rows={cfg.included.map((name) => ({ name }))}
          paper
        />
      )}

      {extra && (
        <div className="border-t border-border">
          <ListSection {...extra} />
        </div>
      )}

      {note && (
        <div className="px-4 pb-16">
          <p className="container mx-auto max-w-7xl border-l-2 border-primary pl-5 text-sm leading-relaxed text-muted-foreground">{note}</p>
        </div>
      )}

      <ProcessBand />

      {cfg.faqs && (
        <section className="px-4 py-20 md:py-24">
          <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-4xl md:text-5xl">Common questions</h2>
              <ul className="mt-6 space-y-2 text-sm">
                {seo.site.offices.map((o) => (
                  <li key={o.city}>
                    <Link to={o.slug} className="text-muted-foreground hover:text-primary">
                      {cfg.h1} in {o.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Accordion type="single" collapsible defaultValue="f-0" className="w-full">
              {cfg.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`f-${i}`} className="border-border">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section className="border-t border-border px-4 py-16">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-display text-3xl md:text-4xl">Often paired with</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.to}>
                <Link to={o.to} className="group flex items-center justify-between gap-3 rounded-2xl border border-border p-5 transition-colors hover:border-primary">
                  <span className="font-display text-xl">{o.label}</span>
                  <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm service={formService} heading={formHeading} subheading="Share a few details. We'll reply within 24–48 hours with a plan and a clear quote." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
