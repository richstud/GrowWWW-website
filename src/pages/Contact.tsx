import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/motion";
import { telLink, useSiteContent, waLink } from "@/lib/content";
import seo from "@/seo/seo.config.json";

export default function Contact() {
  const contact = useSiteContent("contact");
  const slugFor = (city: string) => seo.site.offices.find((o) => o.city === city)?.slug;

  const channels = [
    { icon: Phone, label: "Call", value: contact.phone, href: telLink(contact.phone) },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: waLink(contact.whatsapp), external: true },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path="/contact"
        schema={[{ "@context": "https://schema.org", "@type": "ContactPage", url: "https://www.growwww.in/contact", about: { "@id": "https://www.growwww.in/#organization" } }]}
      />
      <Navbar />

      <PageHero
        title="Let's build something great together"
        intro="Tell us about your website, app, automation or marketing project. We reply to every enquiry within 24–48 hours."
        current="Contact"
      />

      <section className="px-4 pb-10">
        <div className="container mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <FadeIn className="scroll-mt-28 rounded-[1.75rem] border border-border bg-card p-5 sm:p-8 md:p-10">
            <div id="enquiry" className="scroll-mt-28" />
            <h2 className="mb-6 font-display text-3xl sm:text-4xl">Send us your requirements</h2>
            <EnquiryForm idPrefix="contact" />
          </FadeIn>

          <div className="grid gap-6">
            <FadeIn delay={0.1} className="grid gap-3">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/60"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-border">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted-foreground">{label}</span>
                    <span className="block truncate font-medium group-hover:text-primary">{value}</span>
                  </span>
                </a>
              ))}
            </FadeIn>

            <FadeIn delay={0.2} className="rounded-3xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-2xl">Our offices</h2>
              <ul className="space-y-4">
                {contact.offices.map((o) => {
                  const slug = slugFor(o.city);
                  return (
                    <li key={o.city} className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">{slug ? <Link to={slug} className="hover:text-primary">{o.city}</Link> : o.city}</p>
                        <p className="text-sm text-muted-foreground">{o.address || o.region}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 flex items-start gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" /> {contact.hours}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
