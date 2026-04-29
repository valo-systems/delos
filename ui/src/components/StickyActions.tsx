"use client";

import Link from "next/link";
import { Phone, MapPin, ShoppingBag, CalendarDays } from "@/components/icons";
import { siteConfig } from "@/lib/siteConfig";

export default function StickyActions() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="grid grid-cols-4 border-t border-gold/20 bg-black/95 backdrop-blur-md">
        <Link
          href="/bookings"
          className="flex flex-col items-center justify-center py-3 gap-1 text-gold hover:bg-gold/10 transition-colors"
        >
          <CalendarDays size={20} />
          <span className="text-[10px] tracking-wider uppercase">Book</span>
        </Link>
        <Link
          href="/order"
          className="flex flex-col items-center justify-center py-3 gap-1 text-cream/70 hover:text-gold hover:bg-gold/10 transition-colors"
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] tracking-wider uppercase">Order</span>
        </Link>
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="flex flex-col items-center justify-center py-3 gap-1 text-cream/70 hover:text-gold hover:bg-gold/10 transition-colors"
        >
          <Phone size={20} />
          <span className="text-[10px] tracking-wider uppercase">Call</span>
        </a>
        <a
          href={siteConfig.address.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 gap-1 text-cream/70 hover:text-gold hover:bg-gold/10 transition-colors"
        >
          <MapPin size={20} />
          <span className="text-[10px] tracking-wider uppercase">Directions</span>
        </a>
      </div>
    </div>
  );
}
