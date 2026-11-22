// Editable site content (admin panel -> Site content). Every key has a built-in default,
// so the site still renders correctly if the database is slow or unreachable.
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import seo from "@/seo/seo.config.json";

export type Hero = {
  eyebrow: string;
  headline: string;
  highlight: string;
  subheadline: string;
  primary_cta: string;
  secondary_cta: string;
};
export type Stat = { value: string; label: string };
export type Office = { city: string; region: string; address?: string };
export type Contact = { phone: string; whatsapp: string; email: string; hours: string; offices: Office[] };
export type Testimonial = { name: string; role?: string; company?: string; quote: string; rating?: number };
export type FormCopy = { success_title: string; success_message: string };
export type Social = { label: string; href: string };
export type Announcement = { enabled: boolean; text: string; link?: string };

export const DEFAULTS = {
  hero: {
    eyebrow: "Since 2015 · Mumbai · Navi Mumbai · Lucknow",
    headline: "Websites, apps and automation",
    highlight: "that bring you customers.",
    subheadline:
      "GrowWWW designs, builds and markets your business online - one team for your website, mobile app, AI automation and Google ranking.",
    primary_cta: "Get a free consultation",
    secondary_cta: "WhatsApp us",
  } as Hero,
  stats: [
    { value: "2015", label: "Building online since" },
    { value: "1 team", label: "For web, apps, AI automation, algo trading & marketing" },
    { value: "3 offices", label: "Mumbai, Navi Mumbai and Lucknow" },
    { value: "24–48 hrs", label: "Reply to every enquiry" },
  ] as Stat[],
  contact: {
    phone: seo.site.phone,
    whatsapp: seo.site.whatsapp,
    email: seo.site.email,
    hours: "Mon–Fri 8 AM–8 PM · Sat–Sun closed",
    offices: seo.site.offices.map(({ city, region }) => ({ city, region, address: "" })),
  } as Contact,
  testimonials: [] as Testimonial[],
  form: {
    success_title: "Form submitted!",
    success_message: "Thank you - we have received your details and will get back to you within 24–48 hours.",
  } as FormCopy,
  announcement: { enabled: false, text: "", link: "" } as Announcement,
  socials: seo.site.socials as Social[],
};

export type ContentKey = keyof typeof DEFAULTS;

export function useSiteContent<K extends ContentKey>(key: K): (typeof DEFAULTS)[K] {
  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      return Object.fromEntries((data || []).map((r) => [r.key, r.value])) as Record<string, unknown>;
    },
    staleTime: 5 * 60 * 1000,
  });
  const value = data?.[key];
  const fallback = DEFAULTS[key];
  if (value == null) return fallback;
  if (Array.isArray(fallback)) return (Array.isArray(value) ? value : fallback) as (typeof DEFAULTS)[K];
  return { ...(fallback as object), ...(value as object) } as (typeof DEFAULTS)[K];
}

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const waLink = (number: string, message = "Hi GrowWWW, I'd like to discuss a project.") =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
