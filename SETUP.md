# GrowWWW website – setup guide (Nov 2026)

Everything below is already done in your new Supabase project **"GrowWWW Website 2026 Novemeber"** (`aryvikihjbpedoytwkxc`):
database tables, photo storage, security rules, the `submit-enquiry` function and starter site content.
You only need to do the 4 steps marked **YOU**.

---

## 1. YOU – create your admin login (2 min)

1. Open Supabase → **Authentication → Users → Add user → Create new user**.
2. Email: `anxsriv173@gmail.com`, type your password, tick **Auto Confirm User**, press **Create user**.
3. Your account becomes admin automatically (only that email, and only once it's confirmed).
4. **Turn off public sign-ups:** Authentication → Sign In / Providers → Email → switch off **Allow new users to sign up**.
5. **Authentication → URL Configuration:** Site URL = `https://www.growwww.in`, add `https://www.growwww.in/**` and `http://localhost:8080/**` to Redirect URLs (needed for "Forgot password").
6. Log in at **/admin**. Because your password was typed in a chat, change it under **Admin → Settings** after the first login.

## 2. YOU – connect Telegram alerts (5 min)

1. Telegram → **@BotFather** → `/newbot` → copy the **token**.
2. Open your new bot and press **Start**.
3. Telegram → **@userinfobot** → it replies with your **chat ID** (a group ID starts with `-100`; add the bot to the group first).
4. Supabase → **Edge Functions → Secrets** → add:
   - `TELEGRAM_BOT_TOKEN` = the token
   - `TELEGRAM_CHAT_ID` = the chat ID
   - `SITE_ADMIN_URL` = `https://www.growwww.in/admin/dashboard` (optional, adds an "Open inbox" button)
5. Log in to the admin panel → **Settings → Send test alert**.

Don't paste the token into any chat or into the code.

What happens on every form submit: spam check → saved in **Admin → Enquiries** → Telegram message with name, phone, email, service, budget, message and a WhatsApp button → the visitor sees *"Form submitted! … we will get back to you within 24–48 hours."*

## 3. Run it on your computer (Windows, no typing needed)

In **Documents → GrowWWW-website** there are two files next to `GrowWWW-website-latest.zip`:

- **Start-GrowWWW.bat** – double-click to run the site at http://localhost:8080 (admin at /admin). Keep the black window open while you use it.
- **Build-for-hosting.bat** – double-click to build the version you upload. When it finishes, it opens the `dist` folder.

Both need **Node.js (LTS)** installed once from nodejs.org – the files open the download page if it's missing. When you get a newer zip, put it in the same folder with the same name; the files unpack it automatically.

Developers can use the usual commands instead: `npm install`, `npm run dev`, `npm run build`.

## 4. YOU – deploy

Run **Build-for-hosting.bat** (or `npm run build`). It writes a real HTML page for every URL, plus `sitemap.xml` and `404.html`.

Upload **everything inside `dist/`** (including the hidden `.htaccess`) to your hosting's `public_html`, replacing the old files. Rebuild and upload again after you publish portfolio stories or products, so they get their own Google-readable pages and sitemap entries.

If you deploy with Lovable / Vercel / Netlify instead: the build command is `npm run build`, output folder `dist`. (`.htaccess` is only used by Apache hosting.)

---

## The admin panel (`/admin`)

| Tab | What you can do |
|---|---|
| **Enquiries** | Every form submission, live. Search, filter, call/WhatsApp in one tap, set status (new → contacted → proposal → won/lost), private notes. |
| **Portfolio** | Add case studies: client logo (auto-fitted), cover screenshot, gallery, services, challenge / what we built / result. Star = show on homepage. Each gets its own page `/portfolio/<name>`. |
| **Products** | Name, descriptions, thumbnail, demo video upload or YouTube link, price label, button link. |
| **Client logos** | The "Trusted by" logo strip. Upload any image - it's fitted onto a dark tile. |
| **Site content** | Homepage headline & buttons, the 4 stats, phone / WhatsApp / email / hours, **office addresses**, social links, testimonials, form thank-you message, announcement bar. |
| **Settings** | Telegram test, change password. |

Works on phone, tablet and desktop.

Please replace placeholder content with real facts: add real project counts to the stats only if true, add real client testimonials (with permission), and add each office's full street address (needed for Google Maps).

---

## Google: how to get found

No website can be guaranteed the #1 spot - Google ranks on relevance, reviews, links and time. This build gives you everything Google needs technically; the steps below and steady content/reviews do the rest.

**Already built in:** separate title/description/keywords for every page, structured data (organisation with 3 offices, services, FAQ, case studies, breadcrumbs), real HTML for every URL, sitemap, robots.txt, fast mobile-first pages, 3 city pages:
`/web-design-company-mumbai`, `/web-design-company-navi-mumbai`, `/web-design-company-lucknow`.

1. **Google Search Console** - https://search.google.com/search-console → *Add property* → **Domain** → `growwww.in` → copy the TXT record → add it in your domain registrar's DNS → Verify.
   *(Alternative: choose "URL prefix", pick "HTML tag", paste only the `content="…"` code into `"googleSiteVerification"` in `src/seo/seo.config.json`, rebuild, upload, Verify.)*
   Then **Sitemaps** → submit `https://www.growwww.in/sitemap.xml`, and **URL inspection → Request indexing** for the homepage, 4 service pages and 3 city pages.
2. **Google Analytics 4** - https://analytics.google.com → create a property for growwww.in → Web stream → copy the **Measurement ID** (`G-…`) → put it in `.env` as `VITE_GA_MEASUREMENT_ID="G-…"` → rebuild. Form submissions are tracked as the `generate_lead` event. In Search Console → Settings → Associations, link Analytics.
3. **Google Business Profile** - one profile per real office address (Mumbai, Navi Mumbai, Lucknow). Category: *Website designer* (add *Software company*, *Internet marketing service*). Use the exact same name, phone and website as the site; link each profile to its city page. Ask every happy client for a review.
4. **Bing Webmaster Tools** - https://www.bing.com/webmasters → *Import from Google Search Console* (also feeds ChatGPT/Copilot search).
5. **Keep going:** add a portfolio case study every month, collect reviews, and get listed on Clutch, GoodFirms, JustDial and IndiaMART with the same details.

SEO text, keywords and FAQs live in **`src/seo/seo.config.json`** (one place for every page).

---

## What changed in the code

- **New:** `src/components/EnquiryForm.tsx` (live form), `GoldField.tsx` (animated gold "web" background), `HeroBits.tsx`, `HomeSections.tsx` (featured work, testimonials, offices), `ServiceSeoBlock.tsx`, `Analytics.tsx`, `src/pages/PortfolioDetail.tsx`, `LocationPage.tsx`, `src/components/admin/*`, `src/lib/content.ts`, `src/lib/portfolio.ts`, `supabase/functions/submit-enquiry/`, `supabase/migrations/2026111018*`.
- **Rewritten:** Home hero, Portfolio, Contact, Footer, Admin login & dashboard, InlineContactForm.
- **Updated:** Navbar (announcement bar, mobile menu on tablets), service pages (what's included + FAQ + keyword content), `seo.config.json`, `scripts/prerender-seo.mjs`, Supabase client/types/.env, `.htaccess`.
- **Removed:** the fake auto-increasing stats counter (`StatsCounter.tsx`).
- **Archived:** old project's migrations → `supabase/archive-old-project/`. The old Google Sheets function is kept but no longer called.
- **No new npm packages.**

### November 21 update

- **New service:** Algo trading software (`/services/algo-trading`, `src/pages/services/AlgoTrading.tsx`, `src/components/home/AlgoDemo.tsx`), added to the homepage, Services, city pages, footer, form and sitemap. It includes a risk note (no investment advice, no promised returns, SEBI retail algo rules).
- **AI automation:** the automation service is now presented as AI & business automation (page title, keywords, copy).
- **SEO:** new homepage title "Website, Software & AI Automation Company in India", plus software development, AI automation and algo trading keywords and Google structured data.
- **Design:** an animated liquid-gold background behind page headers (`src/components/GoldSilk.tsx`, WebGL, pauses off-screen, still image for reduced motion), a scrolling band of service names (`ServiceMarquee.tsx`), a gold figures band, and ivory "paper" sections (`--paper` colours in `index.css` / `bg-paper` in Tailwind).
- Windows helpers: `Start-GrowWWW.bat` and `Build-for-hosting.bat` live next to the zip in Documents → GrowWWW-website.
- **No new npm packages.**

### November 21 (later)

- Calmer, consistent look: the bright gold figures band and ivory sections are now warm dark tones with gold numbers (`--paper` colours in `index.css`).
- Services band and client logos move in every browser (`.marquee` styles in `index.css`). Portfolio logos are two rows drifting in opposite directions with a gold light sweep (`src/components/LogoWall.tsx`). If a computer has animations turned off, they show as a still, tidy list.
- Products: paste a YouTube link in **Admin → Products → YouTube video link**. It plays on the product page and its thumbnail is used on the product card. The description field turns blank lines into paragraphs and lines starting with "-" into bullet points.

## Google Sheet for leads

Every real enquiry (not spam) is added as a row to the "GrowWWW Website 2026 leads" sheet: date and time (IST), name, phone, email, company, service, budget, message, page, status and an empty "Follow-up notes" column for you.

1. Open the sheet → **Extensions → Apps Script**. Delete what's there, paste all of `docs/google-sheet-leads.gs`, and press **Save**.
2. In the function menu at the top choose **setup** and press **Run**. Google asks you to approve access; choose your account → **Advanced → Go to (project) → Allow**. A **Leads** header row appears in the sheet.
3. **Deploy → New deployment →** gear icon **→ Web app**. Set *Execute as*: **Me** and *Who has access*: **Anyone**, then **Deploy**. Copy the **Web app URL** (it ends in `/exec`).
4. In Supabase **Edge Functions → Secrets** add:
   - `GOOGLE_SHEET_WEBHOOK_URL` = the URL from step 3
   - `GOOGLE_SHEET_SECRET` = the value of `SECRET` at the top of the script
5. In **Admin → Settings**, press **Send test alert**. A "TEST - please delete" row should appear in the sheet.

If you change the script later, use **Deploy → Manage deployments → Edit → Version: New version** so the URL stays the same.
