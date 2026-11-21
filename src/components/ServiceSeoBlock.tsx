import { Link } from "react-router-dom";
import { CheckCircle2, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import seo from "@/seo/seo.config.json";

type ServicePage = { h1: string; included?: string[]; faqs?: { q: string; a: string }[] };

export const serviceFaqSchema = (path: string) => {
  const page = (seo.pages as Record<string, ServicePage>)[path];
  if (!page?.faqs?.length) return [];
  return [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
};

/** "What's included", locations and FAQs for a service page - keyword-rich, readable content for Google and visitors. */
export const ServiceSeoBlock = ({ path }: { path: string }) => {
  const page = (seo.pages as Record<string, ServicePage>)[path];
  if (!page) return null;
  return (
    <>
      {page.included && (
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <FadeIn>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">What's included</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                {page.h1} <span className="text-gradient-gold">done right</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need from one team, with offices in{" "}
                {seo.site.offices.map((o, i) => (
                  <span key={o.city}>
                    <Link to={o.slug} className="text-primary hover:underline">{o.city}</Link>
                    {i < seo.site.offices.length - 2 ? ", " : i === seo.site.offices.length - 2 ? " and " : ""}
                  </span>
                ))}
                .
              </p>
            </FadeIn>
            <StaggerContainer className="grid gap-3 sm:grid-cols-2">
              {page.included.map((item) => (
                <StaggerItem key={item}>
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {page.faqs && (
        <section className="border-t border-border/60 bg-card/40 px-4 py-16 md:py-20">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <FadeIn>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">FAQ</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                {page.h1}: <span className="text-gradient-gold">your questions</span>
              </h2>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {seo.site.offices.map((o) => (
                  <li key={o.city} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <Link to={o.slug} className="hover:text-primary">{page.h1} in {o.city}</Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <Accordion type="single" collapsible defaultValue="f-0" className="w-full">
              {page.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`f-${i}`} className="border-border/70">
                  <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </>
  );
};
