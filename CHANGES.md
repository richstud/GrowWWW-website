# What changed (21 Oct 2026)

Two goals: make growwww.in readable by Google, and make the homepage look sharper and bring in more enquiries.
**No new npm packages were added.** Your Supabase setup, admin pages and contact form logic are unchanged.

## Run it on your computer

```sh
npm install        # same packages as before
npm run dev        # open http://localhost:8080
npm run build      # makes the dist/ folder to upload
```

## 1. SEO (search engines)

| File | New/changed | What it does |
|---|---|---|
| `src/seo/seo.config.json` | **new** | **The one file to edit** for page titles, descriptions, homepage FAQs, phone, email, WhatsApp number and business details for Google. |
| `src/components/Seo.tsx` | **new** | Sets each page's title, description, canonical URL and share tags while people browse. |
| `scripts/prerender-seo.mjs` | **new** | Runs after `vite build`. Writes a real HTML file per page (about.html, services/web-design.html…) with that page's own title/tags/text, plus `sitemap.xml`, `404.html` and `_spa.html`. |
| `package.json` | changed | `build` now runs `vite build && node scripts/prerender-seo.mjs`. |
| `index.html` | changed | Removed the Lovable placeholder title/share image, added the Inter + Sora fonts. |
| `public/robots.txt` | changed | Points to the sitemap and hides `/admin` from search engines. |
| `public/.htaccess` | **new** | For your Apache hosting: https + www redirect, clean URLs (/about → about.html), product pages, real 404s, caching and compression. |
| `public/images/logo.png`, `public/images/og-image.jpg` | **new** | Logo for Google and the preview image shown when your link is shared on WhatsApp/LinkedIn. |
| every page in `src/pages/` | changed | One line added: `<Seo path="/…" />`. Product pages use the product's own name; admin and 404 pages are hidden from Google. |
| `tsconfig.app.json` | changed | Allows importing the JSON config. |

## 2. Design and lead generation

| File | New/changed | What it does |
|---|---|---|
| `src/pages/Home.tsx` | rewritten | New hero with a keyword headline and a visual of your 4 services, client logo strip, services, "Who we help" industries, 4-step process, "Why GrowWWW", FAQ, and the enquiry form at the bottom. |
| `src/components/WhatsAppButton.tsx` | **new** | Floating "Chat on WhatsApp" button on every page (not on admin). The message says which page they came from. |
| `src/components/Footer.tsx` | rewritten | "Let's talk" strip with Call and WhatsApp buttons, clickable email/phone, social links, Products in the menu. |
| `src/components/ClientLogos.tsx` | changed | New slim "Trusted by" style. If the database has no logos (or can't be reached) it shows the logos in `src/assets/client-logos` so the section never disappears. |
| `src/components/InlineContactForm.tsx` | changed | Now also sends enquiries to your Google Sheet, like the Contact page already did. |
| `src/pages/NotFound.tsx` | rewritten | Branded 404 page with links to your services (the old one was a plain white page). |
| `src/components/ScrollToTop.tsx` | **new** | New pages now open at the top instead of mid-page. |
| `tailwind.config.ts`, `src/index.css` | changed | Added the Sora heading font (`font-display`) and smooth scrolling. |

## Things you should configure

1. **Your address and city.** In `src/seo/seo.config.json` change `"locationLabel": "India"` to your city, and add your exact Google Business Profile address inside `organization` like this:
   ```json
   "address": { "@type": "PostalAddress", "streetAddress": "…", "addressLocality": "…", "addressRegion": "…", "postalCode": "…", "addressCountry": "IN" },
   ```
   Use the same address as your Google Business Profile, character for character.
2. **Add your Google Business Profile and LinkedIn links** to the `sameAs` list in the same file.
3. **Check the FAQ answers** in `seo.config.json` (`faqs`). I kept them general (no prices or timelines). Add your real numbers if you want.
4. **WhatsApp number** is `918454075281` (in `site.whatsapp`). Change it there if needed.

## Deploying to your current hosting (Apache)

1. `npm run build`
2. Upload **everything inside `dist/`** to your web root, including the hidden `.htaccess` file (turn on "show hidden files" in your file manager/FTP).
3. Check:
   - `https://www.growwww.in/sitemap.xml` lists 10 pages
   - View Page Source on `https://www.growwww.in/about` shows "About GrowWWW | Web & Software Studio Since 2015"
   - `https://www.growwww.in/xyz` shows the 404 page
   - Paste your link in WhatsApp → the new preview image appears
4. Google Search Console → submit `sitemap.xml` → "Request indexing" for the homepage and service pages. Then Bing Webmaster Tools → import from Search Console.

**If you publish from Lovable instead of Apache:** the `.htaccess` file is ignored there, and Lovable may not run the extra build step. Ask Lovable support whether its build uses `npm run build`; if it does, everything works except the Apache-only rules.

## Note

- The `.env` file in this repo holds your Supabase project URL and *publishable* key. That key is meant to be public, so this is fine, but never commit the `service_role` key.
- The live site (last updated Oct 2025) is older than this code — it doesn't have the Products pages yet. Deploying this build will publish those too.
