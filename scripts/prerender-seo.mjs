// GrowWWW - SEO step that runs after `vite build` (see "build" in package.json).
//
// For every page in src/seo/seo.config.json it writes a real HTML file
// (dist/about.html, dist/services/web-design.html, ...) that already contains:
//   - its own <title>, description, canonical URL, Open Graph / Twitter tags
//   - structured data (organisation, plus Service / FAQ where relevant)
//   - readable page text inside <div id="root"> for search engines, AI search and link previews
// React replaces that text as soon as the app loads, so visitors see the normal site.
// It also writes dist/sitemap.xml, dist/404.html and dist/_spa.html (used for /products/<slug>).
// Published portfolio projects and products are read from Supabase at build time, so each
// case study and product gets its own crawlable page and sitemap entry. Rebuild after adding them.
// No extra npm packages are needed.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(root, process.argv[2] || "dist");
const seo = JSON.parse(readFileSync(join(root, "src/seo/seo.config.json"), "utf8"));
const { site, pages, faqs } = seo;
const template = readFileSync(join(DIST, "index.html"), "utf8");

// Public Supabase values (same as the website uses) - read from .env if present.
const envFile = (() => {
  try {
    return readFileSync(join(root, ".env"), "utf8");
  } catch {
    return "";
  }
})();
const envVal = (k) => process.env[k] || (envFile.match(new RegExp(`^${k}="?([^"\\n]*)"?`, "m")) || [])[1] || "";
const SB_URL = envVal("VITE_SUPABASE_URL");
const SB_KEY = envVal("VITE_SUPABASE_PUBLISHABLE_KEY");
async function fetchRows(table, query) {
  if (!SB_URL || !SB_KEY) return [];
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?${query}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
    if (!res.ok) throw new Error(res.status + " " + (await res.text()));
    return await res.json();
  } catch (e) {
    console.warn(`  seo: couldn't load ${table} from Supabase (${e.message}) - skipping`);
    return [];
  }
}

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (obj, page = false) =>
  `<script type="application/ld+json"${page ? ' data-seo="page"' : ""}>${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const NAV = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/products", "Products"],
  ["/portfolio", "Portfolio"],
  ["/contact", "Contact"],
];
const SERVICE_LINKS = Object.entries(pages).filter(([p]) => p.startsWith("/services/"));

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

function serviceSchema(path, page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.service,
    description: page.description,
    url: site.origin + path,
    provider: { "@id": site.organization["@id"] },
    areaServed: page.city ? { "@type": "City", name: page.city } : { "@type": "Country", name: "India" },
  };
}

const cityFaqs = (city) => [
  { q: `Do you have an office in ${city}?`, a: `Yes. GrowWWW has a team in ${city}, along with our other offices, and we can meet in person or work over phone, WhatsApp and video calls.` },
  { q: `How much does a website cost in ${city}?`, a: "It depends on pages, features (like online payments or a product catalogue) and content. After a free consultation we send a written quote with a clear scope and no hidden charges." },
  { q: `Can you help my ${city} business show up on Google Maps?`, a: `Yes. We set up and optimise your Google Business Profile, build ${city}-focused service pages and collect reviews so you appear in local "near me" searches.` },
  { q: "How soon will you respond?", a: "We reply to every enquiry within 24–48 hours. For anything urgent, call or WhatsApp us." },
];
const faqLd = (list) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
const faqHtml = (list) => `<h2>Frequently asked questions</h2>${list.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}`;

function head({ path, title, description, noindex, keywords, image }) {
  const url = path ? site.origin + (path === "/" ? "/" : path) : null;
  const img = image || site.origin + site.shareImage;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : "",
    site.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}" />` : "",
    `<meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`,
    url && !noindex ? `<link rel="canonical" href="${url}" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    url ? `<meta property="og:url" content="${url}" />` : "",
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ]
    .filter(Boolean)
    .map((l) => "    " + l)
    .join("\n");
}

function body({ h1, intro, extra = "" }) {
  const nav = NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join(" | ");
  const services = SERVICE_LINKS.map(([href, p]) => `<li><a href="${href}">${esc(p.h1)}</a> - ${esc(p.intro)}</li>`).join("");
  return `<div id="root"><div class="seo-shell"><div class="seo-bar" aria-hidden="true"></div><header><nav>${nav}</nav></header><main><h1>${esc(h1)}</h1><p>${esc(intro)}</p>${extra}<h2>Our services</h2><ul>${services}</ul></main><footer><p>${esc(site.name)} | <a href="mailto:${site.email}">${site.email}</a> | <a href="tel:${site.phone.replace(/\s/g, "")}">${esc(site.phone)}</a> | ${esc(site.locationLabel)}</p></footer></div></div>`;
}

function render({ path, page, noindex = false, schemas = [], extra = "" }) {
  // Drop SEO tags from the base template so each page has exactly one set.
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+(name|property)="(description|keywords|robots|google-site-verification|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, "");
  const scripts = [ld(site.organization), ...schemas.map((s) => ld(s, true))].map((s) => "    " + s).join("\n");
  html = html.replace(/<\/head>/i, `${head({ path, title: page.title, description: page.description, noindex, keywords: page.keywords, image: page.image })}\n${scripts}\n  </head>`);
  // Safe to run twice: replaces whatever is inside the root element.
  html = html.replace(/<div id="root">[\s\S]*<\/div>(\s*<\/body>)/i, (_, end) => body({ h1: page.h1, intro: page.intro, extra }) + end);
  return html;
}

const write = (file, html) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("  seo:", file.replace(DIST + "/", "dist/"));
};

console.log("Prerendering SEO pages...");
const extraUrls = [];
for (const [path, page] of Object.entries(pages)) {
  const schemas = [];
  let extra = "";
  if (page.service) schemas.push(serviceSchema(path, page));
  if (page.included) extra += `<h2>What's included</h2><ul>${page.included.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  if (page.faqs) {
    schemas.push(faqLd(page.faqs));
    extra += faqHtml(page.faqs);
  }
  if (page.city) {
    // City + service pages carry their own FAQs (above); the web design city pages use the general city FAQs.
    const list = page.serviceBase ? [] : cityFaqs(page.city);
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${site.origin}${path}#office`,
      name: `GrowWWW ${page.city}`,
      parentOrganization: { "@id": site.organization["@id"] },
      url: site.origin + path,
      telephone: site.organization.telephone,
      image: site.origin + site.shareImage,
      priceRange: "₹₹",
      address: { "@type": "PostalAddress", addressLocality: page.city, addressCountry: "IN" },
      areaServed: [{ "@type": "City", name: page.city }, ...page.areas.map((a) => ({ "@type": "Place", name: `${a}, ${page.city}` }))],
    });
    if (list.length) schemas.push(faqLd(list));
    extra += `<h2>Areas we serve in ${esc(page.city)}</h2><p>${page.areas.map(esc).join(", ")}</p><h2>${page.serviceBase ? "Who we help" : "Industries"}</h2><ul>${page.industries.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>${faqHtml(list)}`;
  }
  if (path === "/") {
    schemas.push(faqLd(faqs));
    extra += faqHtml(faqs);
  }
  const file = path === "/" ? join(DIST, "index.html") : join(DIST, path.slice(1) + ".html");
  write(file, render({ path, page, schemas, extra }));
}

// Portfolio case studies and products from Supabase
const projects = await fetchRows("portfolio_projects", "select=*&is_published=eq.true&order=display_order");
for (const p of projects) {
  const path = `/portfolio/${p.slug}`;
  const desc = (p.summary || p.challenge || `${(p.services || []).join(", ")} for ${p.client_name} by GrowWWW.`).slice(0, 155);
  const extra = [
    ["The issue", p.challenge],
    ["What we fixed", p.solution],
    ["The result", p.result],
  ]
    .filter(([, t]) => t)
    .map(([h, t]) => `<h2>${h}</h2><p>${esc(t)}</p>`)
    .join("");
  write(
    join(DIST, path.slice(1) + ".html"),
    render({
      path,
      page: { title: `${p.title} - ${p.client_name} | GrowWWW Case Study`, description: desc, h1: p.title, intro: p.summary || "", image: p.cover_url || undefined },
      schemas: [{ "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: desc, image: p.cover_url || undefined, url: site.origin + path, creator: { "@id": site.organization["@id"] } }],
      extra,
    })
  );
  extraUrls.push({ path, priority: 0.7, lastmod: (p.updated_at || "").slice(0, 10) });
}
const products = await fetchRows("products", "select=*&is_active=eq.true&order=display_order");
for (const p of products) {
  const path = `/products/${p.slug}`;
  const desc = (p.short_description || p.description || `${p.name} by GrowWWW`).slice(0, 155);
  write(
    join(DIST, path.slice(1) + ".html"),
    render({
      path,
      page: { title: `${p.name.trim()} | GrowWWW`, description: desc, h1: p.name, intro: p.description || desc, image: p.thumbnail_url || undefined },
      schemas: [{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: p.name, description: desc, applicationCategory: "BusinessApplication", url: site.origin + path, publisher: { "@id": site.organization["@id"] } }],
    })
  );
  extraUrls.push({ path, priority: 0.6, lastmod: (p.updated_at || "").slice(0, 10) });
}

// Shell for dynamic routes such as /products/<slug>. The page sets its own tags at runtime.
write(
  join(DIST, "_spa.html"),
  render({ path: null, page: { ...pages["/products"], h1: "GrowWWW", intro: pages["/"].intro } })
);

// Real 404 page (served with status 404 by public/.htaccess).
write(
  join(DIST, "404.html"),
  render({
    path: null,
    noindex: true,
    page: {
      title: "Page not found | GrowWWW",
      description: "This page doesn't exist. Visit GrowWWW for websites, apps, automation and digital marketing.",
      h1: "Page not found",
      intro: "The page you're looking for doesn't exist.",
    },
  })
);

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...Object.entries(pages).map(([path, p]) => ({ path, priority: p.priority ?? 0.7, lastmod: today })),
  ...extraUrls,
]
  .map(
    ({ path, priority, lastmod }) =>
      `  <url>\n    <loc>${site.origin}${path === "/" ? "/" : path}</loc>\n    <lastmod>${lastmod || today}</lastmod>\n    <priority>${Number(priority).toFixed(1)}</priority>\n  </url>`
  )
  .join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log("  seo: dist/sitemap.xml");
console.log("Done.");
