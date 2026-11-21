import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { InlineContactForm } from "@/components/InlineContactForm";
import { PageHero, primaryBtn } from "@/components/PageHero";
import { ListSection, ProcessBand } from "@/components/ServicePage";
import { useSiteContent } from "@/lib/content";
import seo from "@/seo/seo.config.json";
import logo from "@/assets/growww-logo-full.png";

const values = [
  { name: "Results over decoration", text: "A beautiful site that brings no enquiries has failed. We measure calls, forms and sales." },
  { name: "Plain talk", text: "Clear quotes, honest timelines and no jargon. You always know what happens next." },
  { name: "One team", text: "Design, code, automation and marketing work together instead of passing the blame." },
  { name: "In it for the long run", text: "Support carries on after launch - updates, new features and advice whenever you need them." },
];

export default function About() {
  const contact = useSiteContent("contact");
  return (
    <div className="min-h-screen bg-background">
      <Seo path="/about" />
      <Navbar />

      <PageHero
        title="We help businesses grow on the web - since 2015"
        intro="GrowWWW is a web design, app development, automation and digital marketing studio with offices in Mumbai, Navi Mumbai and Lucknow."
        current="About"
        aside={
          <div className="mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center rounded-full border border-primary/30 bg-[#0a0907] shadow-[0_40px_120px_-40px_hsl(38_65%_50%/0.5)]">
            <img src={logo} alt="GrowWWW logo - two horses, since 2015" className="h-[82%] w-[82%] rounded-full object-contain" />
          </div>
        }
      />

      <section className="border-t border-border px-4 py-20 md:py-24">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">Our story</h2>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              GrowWWW started in 2015 with a simple idea: help businesses grow through the World Wide Web - the "WWW" in our name.
              What began as a small team of developers is now a full-service studio working with manufacturers, exporters, clinics,
              schools, retailers and startups.
            </p>
            <p>
              We noticed most businesses juggle a web designer, an app developer, a marketing agency and someone who "knows WhatsApp".
              Nothing connects. So we built one team that does all of it - and makes sure the website, the app, the automation and the ads
              all work towards the same goal: more customers.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-border">
        <ListSection title="How we work" rows={values} paper />
      </div>

      <ProcessBand title="What working with us looks like" />

      <section className="px-4 py-20 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-display text-4xl md:text-5xl">Our offices</h2>
          <ul className="mt-8 border-t border-border">
            {contact.offices.map((o) => {
              const slug = seo.site.offices.find((x) => x.city === o.city)?.slug;
              return (
                <li key={o.city} className="border-b border-border">
                  <Link to={slug || "/contact"} className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                    <span className="font-display text-4xl transition-colors group-hover:text-primary sm:text-6xl">{o.city}</span>
                    <span className="text-sm text-muted-foreground sm:text-right">{o.address || o.region}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link to="/portfolio" className={`${primaryBtn} mt-10`}>
            See our work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          <InlineContactForm heading="Let's talk about your business" subheading="Tell us where you want to grow. We'll reply within 24–48 hours." />
        </div>
      </section>
      <Footer />
    </div>
  );
}
