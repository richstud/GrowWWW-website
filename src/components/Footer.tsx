import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle, Facebook, Instagram, Youtube, ArrowUpRight, Clock, Link2 } from "lucide-react";
import logo from "@/assets/growww-logo-full.webp";
import seo from "@/seo/seo.config.json";
import { telLink, useSiteContent, waLink } from "@/lib/content";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact Us" },
];

const serviceLinks = [
  { to: "/services/web-design", label: "Website Design & Development" },
  { to: "/services/software-solutions", label: "Mobile App & Software Development" },
  { to: "/services/automations", label: "AI & Business Automation" },
  { to: "/services/digital-marketing", label: "SEO & Digital Marketing" },
  { to: "/services/algo-trading", label: "Algo Trading Software" },
];

const socialIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("youtube")) return Youtube;
  if (l.includes("instagram")) return Instagram;
  if (l.includes("facebook")) return Facebook;
  return Link2;
};

export const Footer = () => {
  const contact = useSiteContent("contact");
  const socials = useSiteContent("socials");
  const officeSlug = (city: string) => seo.site.offices.find((o) => o.city === city)?.slug;

  return (
    <footer className="mt-20 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      {/* Contact strip */}
      <div className="border-b border-border/70">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-3xl">
              Have a project in mind? Let's talk.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Free consultation, and a reply within 24–48 hours.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={telLink(contact.phone)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              <Phone className="h-4 w-4" /> Call {contact.phone}
            </a>
            <a
              href={waLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.1fr]">
          <div className="space-y-4">
            <img src={logo} alt="GrowWWW - web design, app development and digital marketing" className="h-20 w-auto" loading="lazy" width={160} height={80} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Grow your business on "WWW". Website design & development, mobile apps, business automation and SEO - since 2015.
            </p>
            <div className="flex gap-2">
              {socials.map(({ href, label }) => {
                const Icon = socialIcon(label);
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`GrowWWW on ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="mb-4 font-display text-lg text-primary">Company</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="mb-4 font-display text-lg text-primary">Services</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 font-display text-lg text-primary">Offices</h3>
            <ul className="space-y-3 text-sm">
              {contact.offices.map((o) => {
                const slug = officeSlug(o.city);
                const inner = (
                  <>
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>
                      <span className="text-foreground">{o.city}</span>
                      {o.address ? <span className="block text-muted-foreground">{o.address}</span> : <span className="text-muted-foreground">, {o.region}</span>}
                    </span>
                  </>
                );
                return (
                  <li key={o.city}>
                    {slug ? (
                      <Link to={slug} className="flex items-start gap-3 transition-colors hover:text-primary">{inner}</Link>
                    ) : (
                      <span className="flex items-start gap-3">{inner}</span>
                    )}
                  </li>
                );
              })}
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-primary">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> {contact.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Services by city - helps visitors (and Google) find the right local page */}
        <div className="mt-12 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          {seo.site.offices.map((o) => {
            const slug = o.city.toLowerCase().replace(/\s+/g, "-");
            const links = [
              ["Web design", `/web-design-company-${slug}`],
              ["Software", `/software-development-company-${slug}`],
              ["AI automation", `/ai-automation-company-${slug}`],
              ["Algo trading", `/algo-trading-software-developer-${slug}`],
              ["Digital marketing", `/digital-marketing-agency-${slug}`],
            ].filter(([, to]) => to in seo.pages);
            return (
              <div key={o.city}>
                <p className="mb-2 text-sm font-medium text-foreground">{o.city}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {links.map(([label, to], i) => (
                    <span key={to}>
                      <Link to={to} className="hover:text-primary">{label}</Link>
                      {i < links.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} GrowWWW. All rights reserved.</p>
          <p>Websites, software, AI automation, algo trading software and digital marketing - for businesses across India.</p>
        </div>
      </div>
    </footer>
  );
};
