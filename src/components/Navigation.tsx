"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "@/components/icons";
import BrandLogo from "@/components/brand/BrandLogo";
import { siteConfig } from "@/lib/siteConfig";

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Order", href: "/order" },
  { label: "Shisanyama", href: "/shisanyama-morningside" },
  { label: "Events", href: "/events" },
  { label: "Private Functions", href: "/private-functions" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo: lion icon on small screens (legible at tiny size),
              full wordmark from sm+. Both link to /. */}
          <Link
            href="/"
            aria-label={`${siteConfig.name}. Home`}
            className="flex items-center group"
          >
            <span className="sm:hidden">
              <BrandLogo variant="lion" height={36} priority />
            </span>
            <span className="hidden sm:inline-flex">
              <BrandLogo
                variant="wordmark"
                height={scrolled ? 32 : 40}
                priority
                className="transition-all duration-300 group-hover:opacity-90"
              />
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm tracking-wider text-cream/80 hover:text-gold uppercase transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors"
            >
              <Phone size={14} />
              {siteConfig.contact.phone}
            </a>
            <Link
              href="/bookings"
              className="px-5 py-2 border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-all"
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-cream hover:text-gold transition-colors p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-gold/20">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base tracking-wider text-cream/80 hover:text-gold uppercase transition-colors py-2 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors"
              >
                <Phone size={16} />
                {siteConfig.contact.phone}
              </a>
              <Link
                href="/bookings"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-3 border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-all"
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
