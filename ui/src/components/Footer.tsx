import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "@/components/icons";
import BrandLogo from "@/components/brand/BrandLogo";
import BrandSeal from "@/components/brand/BrandSeal";
import { siteConfig } from "@/lib/siteConfig";

const footerLinks = {
  Explore: [
    { label: "Menu", href: "/menu" },
    { label: "Events", href: "/events" },
    { label: "Private Functions", href: "/private-functions" },
    { label: "Gallery", href: "/gallery" },
    { label: "About Us", href: "/about" },
  ],
  Order: [
    { label: "Book a Table", href: siteConfig.booking.url, external: true },
    { label: "Order Online", href: "/order" },
    { label: "Uber Eats", href: siteConfig.delivery.uberEats, external: true },
    { label: "Mr D Food", href: siteConfig.delivery.mrDelivery, external: true },
  ],
  Info: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shisanyama in Morningside", href: "/shisanyama-morningside" },
    { label: "African Restaurant Durban", href: "/african-restaurant-durban" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-charcoal border-t border-gold/20 overflow-hidden">
      {/* Subtle seal watermark behind footer content */}
      <div
        className="pointer-events-none absolute -right-16 -bottom-24 hidden md:block"
        aria-hidden="true"
      >
        <BrandSeal size={420} opacity={0.05} />
      </div>
      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label={`${siteConfig.name}. Home`}
              className="inline-block mb-4"
            >
              <BrandLogo variant="wordmark" height={48} className="h-10 md:h-12 w-auto" />
            </Link>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs mt-4">
              Premium African dining, shisanyama, cocktails and lounge culture in the heart of Morningside, Durban.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="p-2 border border-gold/30 text-gold/70 hover:text-gold hover:border-gold transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="p-2 border border-gold/30 text-gold/70 hover:text-gold hover:border-gold transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok"
                className="p-2 border border-gold/30 text-gold/70 hover:text-gold hover:border-gold transition-colors"
              >
                <span className="text-xs font-bold tracking-wider">TT</span>
              </a>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
              >
                <Phone size={14} />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
              >
                <Mail size={14} />
                {siteConfig.contact.email}
              </a>
              <a
                href={siteConfig.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
              >
                <MapPin size={14} />
                {siteConfig.address.full}
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-medium">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cream/60 hover:text-cream transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-cream/60 hover:text-cream transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Hours */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-medium flex items-center gap-2">
              <Clock size={14} />
              Hours
            </h4>
            <ul className="space-y-2">
              {siteConfig.hours.display.map((h) => (
                <li key={h.days} className="flex flex-col">
                  <span className="text-xs text-cream/50">{h.days}</span>
                  <span className="text-sm text-cream/70">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} Delos Lounge &amp; Dining. All rights reserved.
          </p>
          <p className="text-xs text-cream/30">
            Morningside, Durban, KwaZulu-Natal, South Africa
          </p>
        </div>
      </div>
    </footer>
  );
}
