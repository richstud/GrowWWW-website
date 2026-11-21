import { Phone, MessageCircle, Clock } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { telLink, useSiteContent, waLink } from "@/lib/content";

interface Props {
  service?: string;
  heading?: string;
  subheading?: string;
}

/** Enquiry section used at the bottom of the homepage and service pages. */
export function InlineContactForm({
  service,
  heading = "Let's talk",
  subheading = "Tell us about your project and we'll get back within 24–48 hours.",
}: Props) {
  const contact = useSiteContent("contact");
  return (
    <div id="enquiry" className="relative scroll-mt-28 overflow-hidden rounded-3xl border border-primary/25 bg-card p-5 shadow-elegant sm:p-8 md:p-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div>
          <h2 className="font-display text-3xl font-medium leading-tight md:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{subheading}</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a href={telLink(contact.phone)} className="inline-flex items-center gap-3 text-foreground/90 hover:text-primary">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border"><Phone className="h-4 w-4 text-primary" /></span>
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-foreground/90 hover:text-primary">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border"><MessageCircle className="h-4 w-4 text-primary" /></span>
                WhatsApp us
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-muted-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border"><Clock className="h-4 w-4 text-primary" /></span>
              {contact.hours}
            </li>
          </ul>
        </div>
        <EnquiryForm service={service} compact idPrefix={`enq-${(service || "home").toLowerCase().replace(/\W+/g, "-")}`} />
      </div>
    </div>
  );
}
