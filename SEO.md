# SEO set-up: Sande Technologies website

What the site now does, and the steps that have to be done outside the code.

## How the site is built

- Every page is **pre-rendered to plain HTML** at build time (`npm run build`), so search engines and social apps see the full text, headings, links and structured data without running JavaScript. React then "hydrates" the page for animations and the contact form.
- One place to edit business details: **`src/site.js`** (domain, email, phone, social links, verification codes).
- One place to edit page titles, descriptions and addresses: **`src/routes.js`**.
- Service page content: **`src/content/services.js`** (one entry per page).
- The build writes `dist/sitemap.xml` and `dist/robots.txt` automatically from `src/routes.js`, so new pages are always listed.

## Pages and the searches they target

| Address | Main searches it's written for |
|---|---|
| `/` | software development company Malawi / Africa, software company Lilongwe |
| `/services/` | software development services Africa / Malawi, IT company Lilongwe |
| `/web-development/` | web development Malawi / Africa, website design Lilongwe, e-commerce website Malawi |
| `/mobile-app-development/` | mobile app development Malawi / Africa, Android/iOS app developers Lilongwe |
| `/custom-software-development/` | custom software development Africa / Malawi, business/management systems |
| `/ai-automation/` | AI development Africa / Malawi, AI chatbot Africa, business automation |
| `/ui-ux-design/` | UI UX design Malawi, app design Lilongwe |
| `/cloud-hosting-support/` | website hosting and maintenance Malawi, software support |
| `/hire-remote-developers/` | hire remote developers, hire African developers, dedicated development team |
| `/software-development-outsourcing-africa/` | software development outsourcing Africa, outsource software development to Africa, nearshore developers UK / Europe |
| `/products/` | apps made in Malawi |
| `/products/vepifind/` | job search app Malawi, jobs in Malawi, AI cover letter |
| `/about/`, `/contact/` | brand searches: Sande Technologies, Sande Tech |

## Who the pages target

- **Malawi:** every service page names Malawi or Lilongwe in its description and page text, so local searches stay strong.
- **Africa:** titles and descriptions say "Malawi & Africa" or "Africa", and the business data lists Africa as an area served. The outsourcing page has a section for companies across Africa.
- **UK, Europe and beyond:** the remote developers and outsourcing pages, written around working-hour overlap.

## What's in place (on-page and technical)

- Unique title (under 60 characters) and meta description (under 160) on every page; no duplicates.
- One H1 per page, then H2/H3 in order (checked automatically, no skipped levels).
- Short, readable addresses (`/web-development/`), one canonical URL per page, `hreflang` for English.
- Open Graph and X/Twitter card tags, with a 1200×630 share image per page in `public/og/`.
- Structured data (schema.org): Organization, WebSite, WebPage, BreadcrumbList, Service, FAQPage, SoftwareApplication (VepiFind, Belo, Hospr), AboutPage, ContactPage.
- Visible breadcrumbs on inner pages; header and footer link every service; each service page links to three related services; descriptive link text (no "click here").
- Images: WebP, resized (10× smaller than before), descriptive file names, alt text, width and height (no layout shift), lazy-loaded below the fold.
- Fonts self-hosted and preloaded; CSS inlined; the rotating globe starts after the page loads and shows a still frame on devices without a graphics card.
- XML sitemap (with images for product pages) and robots.txt.
- Custom 404 page; `/thank-you/` is set to `noindex` and excluded from the sitemap.
- 301 redirects from every old address (`home.html`, `services.html`, `products.html`, `vepifind.html`, the VepiFind policy pages) and from `www`, in `netlify.toml`.
- Security headers: HTTPS-only (HSTS), content security policy, no framing, no MIME sniffing, strict referrer policy.
- Contact form uses **Netlify Forms** (spam honeypot included), with a fallback to email.

Last test (Lighthouse, mobile, simulated slow 4G): see the results table in the reply, or run `npx lighthouse` against the live site after launch.

## Steps only you can do

### 1. Check the domain (do this first)
When this was set up, `sandetechnologies.com` did not resolve to any server (DNS lookup failed). Confirm the domain is registered and renewed, then point it at Netlify.

### 2. Netlify
1. Create a site from the GitHub repository (`sande11/Lithu`). Build settings are read from `netlify.toml`.
2. **Domain management:** add `sandetechnologies.com` as the primary domain and `www.sandetechnologies.com` as an alias. Netlify issues the HTTPS certificate automatically.
3. **Forms:** turn on form detection, then add an email notification to `sandetechnologiesmw@gmail.com` (Site configuration → Forms → Form notifications).
4. Send a test enquiry from `/contact/` and check it arrives.

### 3. Google Search Console
1. Go to search.google.com/search-console and add a **Domain** property for `sandetechnologies.com` (verify with the DNS TXT record), or a **URL prefix** property and use the HTML tag method: paste only the `content="…"` value into `googleSiteVerification` in `src/site.js`, then redeploy.
2. **Sitemaps:** submit `https://sandetechnologies.com/sitemap.xml`.
3. **URL inspection:** request indexing for the home page and each service page.
4. After a week, check **Pages** (indexing) and **Enhancements** (breadcrumbs, FAQ) for errors.

### 4. Bing Webmaster Tools
Go to bing.com/webmasters, choose **Import from Google Search Console** (fastest), or verify with the meta tag (`bingSiteVerification` in `src/site.js`). Submit the sitemap. Bing also powers DuckDuckGo, Yahoo and ChatGPT search results.

### 5. Google Business Profile (for Google Maps and local results)
Because there's no public office, set it up as a **service-area business**:
1. business.google.com → add "Sande Technologies".
2. Category: **Software company** (add "Website designer" and "Mobile app developer" as extra categories if offered).
3. When asked about a location customers can visit, choose **No**, then add service areas (Lilongwe, Blantyre, Malawi).
4. Google may still ask for an address to verify; it stays hidden from the public.
5. Add the website link, phone, hours (Mon–Fri 08:00–17:00), services and a logo.
6. Ask happy clients for Google reviews; reviews are the strongest local ranking signal.

### 6. Consistent listings and profiles
Use exactly the same name, phone and website everywhere: LinkedIn company page, Facebook page, X, Malawi business directories, Clutch, GoodFirms. Add the profile links to `social` in `src/site.js` and redeploy (they feed the Organization `sameAs` data).

### 7. Check the structured data
After launch, test a few pages at search.google.com/test/rich-results and validator.schema.org.

### 8. Analytics (optional)
If you add Google Analytics or Plausible, add its domain to the `Content-Security-Policy` line in `netlify.toml`, or the browser will block it.

## Keep growing traffic
- Add **case studies** for client projects (problem, what we built, results), one page each. They're the best proof for "web development Malawi"-type searches and convert well.
- A short **blog or guides** section answering real questions (e.g. "How much does an app cost in Malawi?", "Accepting mobile money on your website").
- Update `lastmod` by rebuilding when content changes (the build does this automatically).
