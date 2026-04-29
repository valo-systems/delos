# Delos Website. Launch Checklist

## Phase 8: Launch Preparation

### Before Going Live. Update These First

#### `src/lib/siteConfig.ts`
- [ ] Replace `+27 31 000 0000` with real phone number
- [ ] Replace WhatsApp number
- [ ] Replace email addresses (info@, bookings@, events@)
- [ ] Replace street address with exact address
- [ ] Replace Google Maps URL with actual pin URL
- [ ] Update trading hours if different
- [ ] Update social media URLs (Instagram, Facebook, TikTok)
- [ ] Update Uber Eats and Mr D Food links with real restaurant URLs
- [ ] Update booking URL with real WhatsApp or booking platform link
- [ ] Update `siteConfig.url` with actual domain

#### `src/app/sitemap.ts`
- [ ] Ensure domain URL is correct

#### Domain & Hosting
- [ ] Domain registered and pointed to hosting
- [ ] SSL certificate active (HTTPS)
- [ ] Hosting provider configured (Vercel recommended for Next.js)

#### Content
- [ ] Replace all "Photo Coming Soon" placeholders with real food photography
- [ ] Replace homepage hero (currently gradient) with video or hero photo
- [ ] Add real menu photos to dish cards
- [ ] Add real venue photos to gallery
- [ ] Update menu prices. Confirm directly with Delos team
- [ ] Update menu descriptions if needed

---

## Phase 9: Public Launch

### Technical Launch
- [ ] Run `npm run build`. Confirm zero errors
- [ ] Deploy to production
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on Desktop (Chrome, Safari, Edge)
- [ ] Test all forms submit correctly
- [ ] Test WhatsApp link opens correctly
- [ ] Test call link works on mobile
- [ ] Test Google Maps link opens correctly
- [ ] Test Uber Eats / Mr D links
- [ ] Test sticky bottom bar on mobile
- [ ] Verify all menu categories filter correctly
- [ ] Verify menu search works

### Google Setup
- [ ] Submit website to Google Search Console
- [ ] Submit sitemap: `https://www.deloslounge.co.za/sitemap.xml`
- [ ] Update Google Business Profile with:
  - Correct website URL
  - Booking link
  - Menu link: `https://www.deloslounge.co.za/menu`
  - Delivery links (Uber Eats, Mr D)
  - All photos
  - Correct hours
- [ ] Install Google Analytics (add GA4 measurement ID to layout.tsx)

### Analytics Setup
Add your GA4 measurement ID to `src/app/layout.tsx`:
```html
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

### Social Launch
- [ ] Update Instagram bio with website link
- [ ] Update Facebook page with website link
- [ ] Update TikTok bio with website link
- [ ] Post launch content on all platforms
- [ ] Update WhatsApp auto-reply with website link

### Physical
- [ ] QR codes printed and placed on tables
- [ ] QR code on front-of-house poster
- [ ] Staff trained to share the website

---

## Phase 10: Ongoing Growth

### Weekly
- [ ] Post on Google Business Profile
- [ ] Respond to all Google reviews
- [ ] Share weekly events on social
- [ ] Update specials if any

### Monthly
- [ ] Add new food/venue photos to gallery
- [ ] Review Google Search Console. Check which queries are bringing traffic
- [ ] Review Google Analytics. Check top pages and bounce rate
- [ ] Update menu if needed
- [ ] Check competitor sites
- [ ] Collect new customer reviews

### Review Collection
Create a short Google review link and share with:
- Birthday bookings (day after)
- Group dining (next day)
- Happy customers at point of service
- WhatsApp follow-ups

---

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/siteConfig.ts` | All contact, hours, social, delivery, booking links |
| `src/lib/menu.ts` | Full menu. All items, prices, descriptions |
| `src/lib/events.ts` | Weekly events + private function packages |
| `src/app/page.tsx` | Homepage |
| `src/app/menu/page.tsx` | Interactive menu with search + filters |
| `src/app/bookings/page.tsx` | Booking options |
| `src/app/events/page.tsx` | Events listing |
| `src/app/private-functions/page.tsx` | Private functions + enquiry form |
| `src/app/gallery/page.tsx` | Photo gallery |
| `src/app/about/page.tsx` | About page |
| `src/app/contact/page.tsx` | Contact + map + hours |
| `src/app/order/page.tsx` | Delivery options |
| `src/app/sitemap.ts` | Auto-generated sitemap |
| `src/app/robots.ts` | Robots.txt |
| `src/components/StructuredData.tsx` | JSON-LD schema markup |
