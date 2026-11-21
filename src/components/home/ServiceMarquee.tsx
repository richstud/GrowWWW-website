import { Link } from "react-router-dom";

const ITEMS = [
  { label: "Websites", to: "/services/web-design" },
  { label: "Mobile apps", to: "/services/software-solutions" },
  { label: "Custom software", to: "/services/software-solutions" },
  { label: "AI automation", to: "/services/automations" },
  { label: "Algo trading software", to: "/services/algo-trading" },
  { label: "SEO", to: "/services/digital-marketing" },
  { label: "Google Ads", to: "/services/digital-marketing" },
];

/**
 * Slow band of service names, alternating filled and outlined. It fades out at both edges, pauses on
 * hover, and for reduced-motion users it becomes a still, wrapped list so every name is visible.
 */
export const ServiceMarquee = () => {
  const row = (copy: boolean) =>
    ITEMS.map((it, i) => (
      <li key={`${copy}-${it.label}`} className="flex flex-shrink-0 items-center" data-copy={copy || undefined} aria-hidden={copy || undefined}>
        <Link
          to={it.to}
          tabIndex={copy ? -1 : undefined}
          className={`whitespace-nowrap px-5 font-display text-3xl leading-tight transition-colors sm:px-7 sm:text-5xl lg:text-6xl ${i % 2 ? "text-outline hover:text-primary" : "text-foreground hover:text-primary"}`}
        >
          {it.label}
        </Link>
        <span className="text-xl text-primary sm:text-2xl" aria-hidden>✦</span>
      </li>
    ));
  return (
    <section aria-label="What we do" className="marquee border-y border-border/70 py-6 sm:py-8" style={{ ["--marquee-speed" as string]: "48s" }}>
      <ul className="marquee-track">
        {row(false)}
        {row(true)}
      </ul>
    </section>
  );
};
