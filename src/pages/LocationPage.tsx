import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CandlestickChart, Code, MapPin, MessageCircle, Phone, Smartphone, TrendingUp, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { PageHero, primaryBtn, secondaryBtn } from "@/components/PageHero";
import { InlineContactForm } from "@/components/InlineContactForm";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { telLink, useSiteContent, waLink } from "@/lib/content";
import seo from "@/seo/seo.config.json";
import NotFound from "./NotFound";
import { QuoteLink } from "@/components/QuoteLink";

type CityPage = { h1: string; intro: string; city: string; areas: string[]; industries: string[] };

const services = [
  { icon: Code, title: "Website design & development", href: "/services/web-design", copy: "Business websites, e-commerce stores and landing pages that load fast and rank." },
  { icon: Smartphone, title: "Mobile app & software", href: "/services/software-solutions", copy: "Android & iOS apps, web apps, CRMs and custom software." },
  { icon: Zap, title: "AI & software automation", href: "/services/automations", copy: "AI agents and chatbots, workflow automation, lead alerts and CRM automation." },
  { icon: TrendingUp, title: "SEO & digital marketing", href: "/services/digital-marketing", copy: "Local SEO, Google Business Profile, Google Ads and social media marketing." },
  { icon: CandlestickChart, title: "Algo trading software", href: "/services/algo-trading", copy: "Trading bots on your broker's API, TradingView alerts to orders, backtesting and Telegram alerts." },
];

export const cityFaqs = (city: string) => [
  { q: `Do you have an office in ${city}?`, a: `Yes. GrowWWW has a team in ${city}, along with our other offices, and we can meet in person or work over phone, WhatsApp and video calls.` },
  { q: `How much does a website cost in ${city}?`, a: "It depends on pages, features (like online payments or a product catalogue) and content. After a free consultation we send a written quote with a clear scope and no hidden charges." },
  { q: `Can you help my ${city} business show up on Google Maps?`, a: `Yes. We set up and optimise your Google Business Profile, build ${city}-focused service pages and collect reviews so you appear in local "near me" searches.` },
  { q: "How soon will you respond?", a: "We reply to every enquiry within 24–48 hours. For anything urgent, call or WhatsApp us." },
];

export default function LocationPage() {
  const { pathname } = useLocation();
  const page = (seo.pages as Record<string, Partial<CityPage>>)[pathname] as CityPage | undefined;
  const contact = useSiteContent("contact");
  if (!page?.city) return <NotFound />;
  const office = contact.offices.find((o) => o.city === page.city);
  const faqs = cityFaqs(page.city);
  const others = seo.site.offices.filter((o) => o.city !== page.city);

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
            address: {
              "@type": "PostalAddress",
              streetAddress: office?.address || undefined,
              addressLocality: page.city,
              addressRegion: office?.region,
              addressCountry: "IN",
            },
            areaServed: [{ "@type": "City", name: page.city }, ...page.areas.map((a) => ({ "@type": "Place", name: `${a}, ${page.city}` }))],
            knowsAbout: services.map((s) => s.title),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
      <Navbar />

      <PageHero
        title={page.h1.charAt(0).toUpperCase() + page.h1.slice(1)}
        intro={page.intro}
        current={page.city}
        actions={
          <>
            <QuoteLink className={primaryBtn}>
              Get a free quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </QuoteLink>
            <a href={telLink(contact.phone)} className={secondaryBtn}>
              <Phone className="h-4 w-4" /> {contact.phone}
            </a>
            <a href={waLink(contact.whatsapp, `Hi GrowWWW ${page.city}, I'd like to discuss a project.`)} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </>
        }
      />

      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-10 max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl">Services for {page.city} businesses</h2>
          </FadeIn>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, href, copy }) => (
              <StaggerItem key={href}>
                <Link to={href} className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 transition-colors hover:border-primary/60">
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-display text-2xl leading-snug">{title} in {page.city}</h3>
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
            <h2 className="font-display text-3xl md:text-4xl">Industries we work with</h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {page.industries.map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {i}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <h2 className="font-display text-4xl md:text-5xl">Questions from {page.city}</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Also see:{" "}
              {others.map((o, i) => (
                <span key={o.city}>
                  <Link to={o.slug} className="text-primary hover:underline">web design in {o.city}</Link>
                  {i < others.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
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

      <section className="px-4">
        <div className="container mx-auto max-w-6xl">
          <InlineContactForm heading={`Grow your ${page.city} business online`} subheading="Tell us what you need - we'll get back to you within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
