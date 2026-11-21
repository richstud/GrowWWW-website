import { useEffect } from "react";
import seo from "@/seo/seo.config.json";

type SeoPage = { title: string; description: string; service?: string; keywords?: string };
const pages = seo.pages as Record<string, SeoPage>;

interface SeoProps {
  /** Route key from src/seo/seo.config.json, e.g. "/about". */
  path?: string;
  /** Override or supply title/description (used for dynamic pages like products). */
  title?: string;
  description?: string;
  /** Canonical path if different from `path` (e.g. "/products/my-product"). */
  canonicalPath?: string;
  image?: string;
  /** Hide this page from search engines (admin, 404). */
  noindex?: boolean;
  /** Extra JSON-LD objects for this page (FAQ, Service, Product...). */
  schema?: object[];
}

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href: string | null) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

/**
 * Sets the page title, description, canonical URL, social tags and structured data.
 * Renders nothing. The same text is baked into the HTML at build time by
 * scripts/prerender-seo.mjs, so search engines see it without running JavaScript.
 */
export const Seo = ({ path, title, description, canonicalPath, image, noindex, schema = [] }: SeoProps) => {
  const page = path ? pages[path] : undefined;
  const finalTitle = title ?? page?.title ?? seo.site.name;
  const finalDescription = description ?? page?.description ?? "";
  const canonical = canonicalPath ?? path;
  const schemaKey = JSON.stringify(schema);

  useEffect(() => {
    const url = canonical ? seo.site.origin + (canonical === "/" ? "/" : canonical) : null;
    const img = image && /^https?:/.test(image) ? image : seo.site.origin + (image ?? seo.site.shareImage);

    document.title = finalTitle;
    setMeta("name", "description", finalDescription);
    if (page?.keywords) setMeta("name", "keywords", page.keywords);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setCanonical(noindex ? null : url);
    setMeta("property", "og:title", finalTitle);
    setMeta("property", "og:description", finalDescription);
    setMeta("property", "og:image", img);
    if (url) setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", finalTitle);
    setMeta("name", "twitter:description", finalDescription);
    setMeta("name", "twitter:image", img);

    // Page-specific structured data (the organisation schema lives in the built HTML).
    document.head.querySelectorAll('script[data-seo="page"]').forEach((n) => n.remove());
    const extra: object[] = [...JSON.parse(schemaKey)];
    if (page?.service && canonical) {
      extra.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.service,
        description: finalDescription,
        url: seo.site.origin + canonical,
        provider: { "@id": seo.site.organization["@id"] },
        areaServed: { "@type": "Country", name: "India" },
      });
    }
    extra.forEach((obj) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seo = "page";
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
    });
  }, [finalTitle, finalDescription, canonical, image, noindex, schemaKey, page?.service]);

  return null;
};

export const seoConfig = seo;
