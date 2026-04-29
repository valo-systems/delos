# Delos Lounge & Dining — Website

**Premium African Dining, Shisanyama & Cocktail Lounge**
362 Lilian Ngoyi Road, Morningside, Durban, KwaZulu-Natal

Live site: [www.deloslounge.co.za](https://www.deloslounge.co.za)

---

## About

Marketing and booking website for Delos Lounge & Dining — a premium African restaurant, shisanyama, and cocktail lounge in Morningside, Durban. The site covers the full guest journey: discovery, menu browsing, table bookings, private function enquiries, delivery ordering, and event listings.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Hosting:** AWS Amplify
- **Domain:** deloslounge.co.za

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, highlights, CTA |
| `/menu` | Interactive menu with search and category filters |
| `/bookings` | Table booking options |
| `/events` | Weekly events listing |
| `/private-functions` | Private function packages and enquiry form |
| `/gallery` | Photo gallery |
| `/about` | About Delos |
| `/contact` | Contact info, map, and trading hours |
| `/order` | Direct order and delivery options |

SEO landing pages are also generated for suburb/keyword queries (e.g. `/shisanyama-durban`, `/african-restaurant-durban`).

---

## Key Config Files

| File | Purpose |
|------|---------|
| `src/lib/siteConfig.ts` | Contact info, hours, social links, delivery URLs, booking link |
| `src/lib/menu.ts` | Full menu — items, prices, descriptions, categories |
| `src/lib/events.ts` | Weekly events and private function packages |
| `src/app/sitemap.ts` | Auto-generated sitemap |
| `src/app/robots.ts` | robots.txt |
| `src/components/StructuredData.tsx` | JSON-LD schema markup |

---

## Contact & Social

| Channel | Detail |
|---------|--------|
| Phone | +27 81 506 5898 |
| WhatsApp | +27 81 506 5898 |
| Email | info@deloslounge.co.za |
| Bookings | bookings@deloslounge.co.za |
| Events | events@deloslounge.co.za |
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

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

---

Built by [Valo Systems](https://github.com/valo-systems)