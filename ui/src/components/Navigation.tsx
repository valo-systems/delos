"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "@/components/icons";
import BrandLogo from "@/components/brand/BrandLogo";
import { siteConfig } from "@/lib/siteConfig";

const primaryLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book", href: "/bookings" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Visit", href: "/contact" },
];

const moreLinks = [
  { label: "Order Online", href: "/order" },
  { label: "Shisanyama", href: "/shisanyama-morningside" },
  { label: "Private Functions", href: "/private-functions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book", href: "/bookings" },
  { label: "Order Online", href: "/order" },
  { label: "Shisanyama", href: "/shisanyama-morningside" },
  { label: "Events", href: "/events" },
  { label: "Private Functions", href: "/private-functions" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Visit / Contact", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close More dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-12">
          {/* Logo */}
          <Link
            href="/"
            aria-label={`${siteConfig.name}. Home`}
            className="flex items-center shrink-0 group"
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

          {/* Desktop primary nav — gap-12 on the flex parent already gives logo breathing room */}
          <ul className="hidden lg:flex items-center gap-7 flex-1">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm tracking-wider text-cream/80 hover:text-gold uppercase transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* More dropdown */}
            <li className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-sm tracking-wider text-cream/80 hover:text-gold uppercase transition-colors"
              >
                More
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {moreOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-52 bg-black/98 border border-gold/20 shadow-xl shadow-black/60 backdrop-blur-md"
                  role="menu"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className="block px-5 py-3 text-sm tracking-wider text-cream/75 hover:text-gold hover:bg-gold/5 uppercase transition-colors border-b border-white/5 last:border-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block shrink-0 ml-auto">
            <Link
              href="/bookings"
              className="px-5 py-2 border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-all"
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden ml-auto text-cream hover:text-gold transition-colors p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-gold/20 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base tracking-wider text-cream/80 hover:text-gold uppercase transition-colors py-3.5 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/bookings"
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full text-center px-5 py-3.5 border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-all"
            >
              Book a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
