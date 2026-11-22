import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CandlestickChart, Code, MapPin, MessageCircle, Phone, Smartphone, TrendingUp, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { PageHero, primaryBtn, secondaryBtn } from "@/components/PageHero";
import { QuoteLink } from "@/components/QuoteLink";
import { InlineContactForm } from "@/components/InlineContactForm";
import { ListSection, ProcessBand } from "@/components/ServicePage";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { telLink, useSiteContent, waLink } from "@/lib/content";
import seo from "@/seo/seo.config.json";
import NotFound from "./NotFound";

/**
 * City landing pages. Two kinds, both driven by src/seo/seo.config.json:
 *  - /web-design-company-<city>: the general page for a city (all services)
 *  - /<service>-<city> (has `serviceBase`): one service in one city, with its own FAQs and "who we help" list
 */
type CityPage = {
  h1: string; intro: string; city: string; areas: string[]; industries: string[];
  service?: string; serviceBase?: string; formService?: string; included?: string[]; faqs?: { q: string; a: string }[];
};
const PAGES = seo.pages as Record<string, Partial<CityPage>>;

const services = [
  { icon: Code, title: "Website design & development", href: "/services/web-design", copy: "Business websites, e-commerce stores and landing pages that load fast and rank.", city: "web-design-company" },
  { icon: Smartphone, title: "Software & app development", href: "/services/software-solutions", copy: "Android & iOS apps, web apps, CRMs, ERPs and custom software.", city: "software-development-company" },
  { icon: Zap, title: "AI & business automation", href: "/services/automations", copy: "AI agents and chatbots, WhatsApp automation, workflow and CRM automation.", city: "ai-automation-company" },
  { icon: CandlestickChart, title: "Algo trading software", href: "/services/algo-trading", copy: "Trading bots on your broker's API, TradingView alerts to orders, backtesting and Telegram alerts.", city: "algo-trading-software-developer" },
  { icon: TrendingUp, title: "Digital marketing & SEO", href: "/services/digital-marketing", copy: "Local SEO, Google Business Profile, Google Ads and social media marketing.", city: "digital-marketing-agency" },
];
const citySlug = (city: string) => city.toLowerCase().replace(/\s+/g, "-");
/** Link to a service's page for a given city, if that page exists. */
const cityServiceUrl = (prefix: string, city: string) => {
  const url = `/${prefix}-${citySlug(city)}`;
  return PAGES[url] ? url : undefined;
};

export const cityFaqs = (city: string) => [
  { q: `Do you have an office in ${city}?`, a: `Yes. GrowWWW has a team in ${city}, along with our other offices, and we can meet in person or work over phone, WhatsApp and video calls.` },
  { q: `How much does a website cost in ${city}?`, a: "It depends on pages, features (like online payments or a product catalogue) and content. After a free consultation we send a written quote with a clear scope and no hidden charges." },
  { q: `Can you help my ${city} business show up on Google Maps?`, a: `Yes. We set up and optimise your Google Business Profile, build ${city}-focused service pages and collect reviews so you appear in local "near me" searches.` },
  { q: "How soon will you respond?", a: "We reply to every enquiry within 24–48 hours. For anything urgent, call or WhatsApp us." },
];

export default function LocationPage() {
  const { pathname } = useLocation();
  const page = PAGES[pathname] as CityPage | undefined;
  const contact = useSiteContent("contact");
  if (!page?.city) return <NotFound />;

  const isService = !!page.serviceBase;
  const office = contact.offices.find((o) => o.city === page.city);
  const faqs = isService ? [...(page.faqs || []), { q: "How soon will you respond?", a: "We reply to every enquiry within 24–48 hours. For anything urgent, call or WhatsApp us." }] : cityFaqs(page.city);
  const thisService = services.find((s) => s.href === page.serviceBase);
  const otherCities = seo.site.offices.filter((o) => o.city !== page.city);
  const title = page.h1.charAt(0).toUpperCase() + page.h1.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path={pathname}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "@id": `https://www.growwww.in${pathname}#office`,
            name: `GrowWWW ${page.city}`,
            parentOrganization: { "@id": "https://www.growwww.in/#organization" },
            url: `https://www.growwww.in${pathname}`,
            telephone: "+91-8454075281",
            image: "https://www.growwww.in/images/og-image.jpg",
            priceRange: "₹₹",
            address: { "@type": "PostalAddress", streetAddress: office?.address || undefined, addressLocality: page.city, addressRegion: office?.region, addressCountry: "IN" },
            areaServed: [{ "@type": "City", name: page.city }, ...page.areas.map((a) => ({ "@type": "Place", name: `${a}, ${page.city}` }))],
            knowsAbout: isService ? [page.service] : services.map((s) => s.title),
          },
          ...(isService
            ? [{ "@context": "https://schema.org", "@type": "Service", name: page.service, url: `https://www.growwww.in${pathname}`, provider: { "@id": "https://www.growwww.in/#organization" }, areaServed: { "@type": "City", name: page.city } }]
            : []),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
      <Navbar />

      <PageHero
        title={title}
        intro={page.intro}
        trail={isService && thisService ? [{ label: thisService.title, to: thisService.href }] : []}
        current={page.city}
        actions={
          <>
            <QuoteLink className={primaryBtn}>
              Get a free quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </QuoteLink>
            <a href={telLink(contact.phone)} className={secondaryBtn}>
              <Phone className="h-4 w-4" /> {contact.phone}
            </a>
            <a href={waLink(contact.whatsapp, `Hi GrowWWW ${page.city}, I'd like to discuss ${isService ? page.service?.toLowerCase() : "a project"}.`)} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </>
        }
      />

      {isService ? (
        <ListSection title={`What we build for ${page.city} businesses`} intro={thisService?.copy} rows={(page.included || []).map((name) => ({ name }))} paper />
      ) : (
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <FadeIn className="mb-10 max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl">Services for {page.city} businesses</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title: t, href, copy, city }) => (
                <StaggerItem key={href}>
                  <Link to={cityServiceUrl(city, page.city) && city !== "web-design-company" ? cityServiceUrl(city, page.city)! : href} className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 transition-colors hover:border-primary/60">
                    <Icon className="mb-5 h-6 w-6 text-primary" />
                    <h3 className="font-display text-2xl leading-snug">{t} in {page.city}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      <section className="border-y border-border/60 bg-card/40 px-4 py-16">
        <div className="container mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-4xl">Areas we serve in {page.city}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {page.areas.map((a) => (
                <span key={a} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm text-muted-foreground">{a}</span>
              ))}
            </div>
            {office?.address && <p className="mt-6 flex items-start gap-2 text-sm"><MapPin className="mt-0.5 h-4 w-4 text-primary" />{office.address}</p>}
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl">{isService ? "Who we help" : "Industries we work with"}</h2>
            <ul className={`mt-5 grid gap-2 ${isService ? "" : "sm:grid-cols-2"}`}>
              {page.industries.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-[0.55em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" /> {i}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {isService && <ProcessBand />}

      <section className="px-4 py-16">
        <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <h2 className="font-display text-4xl md:text-5xl">Questions from {page.city}</h2>
            {isService && thisService && (
              <p className="mt-4 text-sm text-muted-foreground">
                More about our <Link to={thisService.href} className="text-primary hover:underline">{thisService.title.toLowerCase()}</Link> service.
              </p>
            )}
          </FadeIn>
          <Accordion type="single" collapsible defaultValue="c-0">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`c-${i}`} className="border-border/70">
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Links to the same service in other cities, and other services in this city */}
      <section className="border-t border-border/60 px-4 py-14">
        <div className="container mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">{isService ? `${page.service} in other cities` : "Our other offices"}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {otherCities.map((o) => {
                const url = isService && thisService ? cityServiceUrl(thisService.city, o.city) : o.slug;
                return url ? (
                  <li key={o.city}><Link to={url} className="text-muted-foreground hover:text-primary">{isService ? `${page.service} in ${o.city}` : `GrowWWW ${o.city}`}</Link></li>
                ) : null;
              })}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">More services in {page.city}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {services.filter((s) => s.href !== page.serviceBase).map((s) => {
                const url = cityServiceUrl(s.city, page.city) || s.href;
                return url === pathname ? null : (
                  <li key={s.href}><Link to={url} className="text-muted-foreground hover:text-primary">{s.title} in {page.city}</Link></li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-6xl">
          <InlineContactForm
            service={page.formService}
            heading={isService ? `Talk to us about ${page.service?.toLowerCase()} in ${page.city}` : `Grow your ${page.city} business online`}
            subheading="Tell us what you need - we'll get back to you within 24–48 hours."
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
