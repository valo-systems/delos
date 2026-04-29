# Delos Lounge & Dining — Website

**Premium African Dining, Shisanyama & Cocktail Lounge**
362 Lilian Ngoyi Road, Morningside, Durban, KwaZulu-Natal

Live site: [d1t1afsdwlqzlq.cloudfront.net](https://d1t1afsdwlqzlq.cloudfront.net) · Custom domain: www.deloslounge.co.za (pending DNS)

---

## About

Marketing and booking website for Delos Lounge & Dining — a premium African restaurant, shisanyama, and cocktail lounge in Morningside, Durban. The site covers the full guest journey: discovery, menu browsing, table bookings, private function enquiries, delivery ordering, and event listings.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, `output: export`) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI hosting | AWS S3 (`delos-lounge-website`, `af-south-1`) |
| UI CDN | AWS CloudFront (`E2LH36Y7GBUMP7`, `d1t1afsdwlqzlq.cloudfront.net`) |
| API | Spring Boot 3 on Elastic Beanstalk (`delos-api-prod`, `us-east-1`) |
| API CDN | AWS CloudFront (`E32E3P4G7LNI8Q`, `d16miif1gijvhu.cloudfront.net`) |
| Domain | deloslounge.co.za (pending alias setup on UI distribution) |

---

## Deploy — UI

The UI is a Next.js static export (`out/`) served from S3 via CloudFront.

```bash
cd ui
npm run build                              # generates out/
aws s3 sync out/ s3://delos-lounge-website/ --delete --region af-south-1
aws cloudfront create-invalidation \
  --distribution-id E2LH36Y7GBUMP7 \
  --paths "/*"
```

Or use the helper script from the repo root:

```bash
./deploy-ui.sh
```

## Deploy — API

```bash
./deploy.sh    # builds JAR, uploads to S3, deploys to Elastic Beanstalk
```

---

## CloudFront Configuration Notes

**UI distribution `E2LH36Y7GBUMP7`:**
- Origin: `delos-lounge-website.s3.af-south-1.amazonaws.com` with OAC `E1O17WGMT3DQC2`
- Default root object: `index.html`
- Error pages:
  - `403` → `/index.html` (200) — S3 OAC returns 403 for missing files; this
    enables SPA-style routing so direct hits to `/order/{id}` work after a page
    refresh or from a shared link.
  - `404` → `/404/index.html` (404) — standard missing page

**If the custom domain `www.deloslounge.co.za` needs to be wired up:**
```bash
aws cloudfront update-distribution \
  --id E2LH36Y7GBUMP7 \
  # add Aliases: ["www.deloslounge.co.za", "deloslounge.co.za"]
  # and attach the ACM certificate for that domain
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, highlights, CTA |
| `/menu` | Interactive menu with search and category filters |
| `/bookings` | Table booking form |
| `/events` | Weekly events listing |
| `/private-functions` | Private function packages and enquiry form |
| `/gallery` | Photo gallery with category filters |
| `/about` | About Delos |
| `/contact` | Contact info, map, and trading hours |
| `/order` | Multi-step direct order flow (Menu → Fulfilment → Address → Details → Review) |
| `/order/[id]` | Live order tracking (client-side polling, SPA shell at `/order/pending/`) |
| `/shisanyama-morningside` | Shisanyama feature page |
| `/private-functions` | Private functions / events enquiry |

SEO landing pages for suburb/keyword queries: `/shisanyama-durban`, `/african-restaurant-durban`, `/traditional-food-durban`, etc.

---

## Key Config Files

| File | Purpose |
|------|---------|
| `ui/src/lib/siteConfig.ts` | Contact info, hours, social links, delivery URLs, booking link |
| `ui/src/lib/menu.ts` | Full menu — items, prices, descriptions, categories |
| `ui/src/lib/events.ts` | Weekly events and private function packages |
| `ui/src/app/sitemap.ts` | Auto-generated sitemap |
| `ui/src/app/robots.ts` | robots.txt |
| `ui/src/components/StructuredData.tsx` | JSON-LD schema markup |
| `ui/.env.production` | `NEXT_PUBLIC_API_URL` — API CloudFront domain |

---

## Local Development

```bash
cd ui
npm install
npm run dev      # http://localhost:3000
```

The dev server proxies API calls to `NEXT_PUBLIC_API_URL` (set in `.env.production`
or override with a local `.env.local`).

---

## Contact & Social

| Channel | Detail |
|---------|--------|
| Phone | +27 81 506 5898 |
| WhatsApp | +27 81 506 5898 |
| Email | info@deloslounge.co.za |
| Instagram | [@lions_of_delos](https://www.instagram.com/lions_of_delos/) |
| Facebook | [DELOS Lounge](https://www.facebook.com/p/DELOS-Lounge-61566014750224/) |
| TikTok | [@delos.lounge](https://www.tiktok.com/@delos.lounge) |
| Uber Eats | [Order on Uber Eats](https://www.ubereats.com/za/store/delos-lounge-and-dining/kqV-rQj5Qe2jo9IDb_Fqyg) |
| Mr Delivery | [Order on Mr D](https://www.mrd.com/delivery/restaurant/delos-lounge-dining-morningside/33228) |

---

## Trading Hours

| Day | Hours |
|-----|-------|
| Monday | 08:00 – 20:00 |
| Tue – Thu | 10:00 – 20:45 |
| Friday | 10:00 – 21:15 |
| Saturday | 10:00 – 21:30 |
| Sunday | 10:00 – 21:00 |

---

Built by [Valo Systems](https://github.com/valo-systems)
