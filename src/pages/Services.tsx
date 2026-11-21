import { ArrowRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { InlineContactForm } from "@/components/InlineContactForm";
import { PageHero, primaryBtn, secondaryBtn } from "@/components/PageHero";
import { ServiceBento } from "@/components/home/ServiceBento";
import { ListSection, ProcessBand } from "@/components/ServicePage";
import { useSiteContent, waLink } from "@/lib/content";
import { QuoteLink } from "@/components/QuoteLink";

const promises = [
  { name: "A written quote first", text: "Scope, timeline and price in writing before any work starts. No surprises later." },
  { name: "Built for phones", text: "Most of your customers arrive on a phone, so we design and test there first." },
  { name: "Ready for Google", text: "Titles, structured data, sitemaps and speed are part of every build, not an add-on." },
  { name: "You own everything", text: "Domain, code, content and accounts are in your name." },
  { name: "Support after launch", text: "Changes, updates and new features when you need them, on WhatsApp or a call." },
];

export default function Services() {
  const contact = useSiteContent("contact");
  return (
    <div className="min-h-screen bg-background">
      <Seo path="/services" />
      <Navbar />

      <PageHero
        title="Everything your business needs online, from one team"
        intro="Websites and online stores, mobile apps and custom software, AI and business automation, algo trading software, and the SEO and ads that bring customers to all of it."
        current="Services"
        actions={
          <>
            <QuoteLink className={primaryBtn}>
              Get a free quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </QuoteLink>
            <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </>
        }
      />

      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <ServiceBento />
        </div>
      </section>

      <div className="border-t border-border">
        <ListSection title="What you can count on" intro="However big or small the project, these never change." rows={promises} paper />
      </div>

      <ProcessBand />

      <section className="px-4 pt-20">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm heading="Not sure which service you need?" subheading="Tell us what you want to achieve and we'll suggest the simplest way to get there. We reply within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
