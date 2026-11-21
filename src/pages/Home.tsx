import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientLogos } from "@/components/ClientLogos";
import { InlineContactForm } from "@/components/InlineContactForm";
import { Seo, seoConfig } from "@/components/Seo";
import { CountUp } from "@/components/HeroBits";
import { FeaturedWork, Testimonials } from "@/components/HomeSections";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { ServiceBento } from "@/components/home/ServiceBento";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteContent, waLink } from "@/lib/content";
import { QuoteLink } from "@/components/QuoteLink";
import { GoldSilk } from "@/components/GoldSilk";
import { ServiceMarquee } from "@/components/home/ServiceMarquee";

const industries = [
  { name: "Manufacturers & exporters", need: "Product catalogues and export enquiry forms buyers can find on Google." },
  { name: "Retail & D2C brands", need: "Online stores with payments, WhatsApp ordering and ads that sell." },
  { name: "Clinics & hospitals", need: "Appointment booking, reminders and a trustworthy local presence." },
  { name: "Schools & coaching", need: "Admission funnels, course pages and automatic lead follow-ups." },
  { name: "Real estate", need: "Project microsites with enquiry capture handed to your sales team." },
  { name: "Startups", need: "MVP apps and websites built quickly, ready to grow with you." },
  { name: "Traders & trading desks", need: "Algo trading bots on your broker's API, with backtesting, risk limits and Telegram alerts." },
];

const steps = [
  { title: "Discover", copy: "We learn your business and goals, then send a written scope and quote." },
  { title: "Design", copy: "You see the look and flow before a line of code is written." },
  { title: "Build", copy: "We develop, test on real phones and set up SEO, analytics and automation." },
  { title: "Launch & grow", copy: "We go live, get you found on Google and keep improving with you." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: seoConfig.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const hero = useSiteContent("hero");
  const stats = useSiteContent("stats");
  const contact = useSiteContent("contact");
  const reduce = useReducedMotion();
  const headline = `${hero.headline} ${hero.highlight}`.replace(/\s+/g, " ").trim();
  const words = headline.split(" ");
  const cities = contact.offices.map((o) => o.city);
  const cityText = cities.length > 1 ? `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}` : cities[0];

  return (
    <div className="min-h-screen bg-background">
      <Seo path="/" schema={[faqSchema]} />
      <Navbar />

      {/* Hero: the promise on the left, the result (a phone full of enquiries) on the right */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:pt-32 md:pb-24 lg:pt-36">
        <GoldSilk />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />
        <div className="container relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
          <div className="min-w-0">
            <h1 className="font-display text-[2.7rem] font-medium leading-[1.02] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[5.4rem]">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block pr-[0.22em]"
                  initial={reduce ? false : { opacity: 0, y: "0.4em", filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.08 + i * 0.06, ease }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + words.length * 0.06, duration: 0.6 }}
            >
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{hero.subheadline}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <QuoteLink className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary-glow))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  {hero.primary_cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </QuoteLink>
                <a
                  href={waLink(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-[15px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" /> {hero.secondary_cta}
                </a>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
                Building for businesses since 2015, from our offices in {cityText}. We reply to every enquiry within 24–48 hours.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
          >
            <HeroShowcase />
          </motion.div>
        </div>
      </section>

      <ServiceMarquee />

      <ClientLogos variant="compact" />

      {/* Services as working demos */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-2 md:items-end">
            <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">One studio for everything your business does online</h2>
            <p className="max-w-md text-muted-foreground md:justify-self-end">
              Design, development, automation and marketing under one roof - so the website, the app and the ads all work towards the same thing: more customers.
            </p>
          </div>
          <ServiceBento />
        </div>
      </section>

      {/* Stats as plain figures */}
      <section className="relative overflow-hidden border-y border-primary/25 bg-[hsl(32_18%_7%)] px-4 py-14 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,hsl(38_60%_40%/0.14),transparent)]" aria-hidden />
        <dl className="container relative mx-auto grid max-w-7xl grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={i % 2 === 1 ? "border-l border-primary/20 pl-6 lg:pl-8" : i > 0 ? "lg:border-l lg:border-primary/20 lg:pl-8" : ""}>
              <dd className="text-gold-gradient font-display text-4xl leading-none sm:text-6xl">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <FeaturedWork />

      {/* Who we help - a typographic list on ivory paper */}
      <section className="bg-paper px-4 py-20 text-paper-foreground md:py-28">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">Built around how your business wins customers</h2>
            <p className="mt-5 max-w-sm text-paper-muted">Whether you sell to buyers abroad or to people down the street, the site and the systems behind it are shaped around your trade.</p>
          </div>
          <ul className="divide-y divide-paper-border border-y border-paper-border">
            {industries.map((ind) => (
              <li key={ind.name} className="group grid gap-1 py-5 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
                <span className="font-display text-2xl transition-colors group-hover:text-primary sm:text-3xl">{ind.name}</span>
                <span className="text-sm leading-relaxed text-paper-muted sm:pt-2">{ind.need}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process - a real sequence, on the racing-green band */}
      <section className="bg-racing px-4 py-20 text-racing-foreground md:py-24">
        <div className="container mx-auto max-w-7xl">
          <h2 className="max-w-2xl font-display text-4xl leading-[1.05] md:text-5xl">From first call to launch, in four steps</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-[hsl(40_35%_90%/0.25)] pt-5">
                <span className="font-display text-5xl text-primary">{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-racing-foreground/75">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Testimonials />

      {/* Offices */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-display text-4xl md:text-5xl">Find us in</h2>
          <ul className="mt-8 border-t border-border">
            {contact.offices.map((o) => {
              const slug = seoConfig.site.offices.find((x) => x.city === o.city)?.slug;
              const inner = (
                <>
                  <span className="font-display text-4xl transition-colors group-hover:text-primary sm:text-6xl lg:text-7xl">{o.city}</span>
                  <span className="text-sm text-muted-foreground sm:text-right">
                    {o.address || o.region}
                    {slug && <span className="mt-1 block text-primary">Web design in {o.city}</span>}
                  </span>
                </>
              );
              return (
                <li key={o.city} className="border-b border-border">
                  {slug ? (
                    <Link to={slug} className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center">{inner}</Link>
                  ) : (
                    <div className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border px-4 py-20 md:py-24">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">Questions we often hear</h2>
            <p className="mt-4 text-muted-foreground">
              Can't find your answer? Call or WhatsApp us on <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="text-primary hover:underline">{contact.phone}</a>.
            </p>
          </div>
          <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
            {seoConfig.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm heading="Tell us what you want to build" subheading="Share a few details. We'll reply within 24–48 hours with ideas and a clear quote." />
        </div>
      </section>

      <Footer />
    </div>
  );
}
