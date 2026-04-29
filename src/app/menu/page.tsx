"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { menuItems, menuCategories } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";
import { Search, Flame, Star } from "@/components/icons";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        {/* Header */}
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Delos Kitchen"
              title="Our Menu"
              subtitle="From traditional African classics to premium grills, seafood, cocktails and more. Browse by category or search for your favourite."
            />
            {/* Search */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
              <input
                type="text"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 pl-10 pr-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
                    activeCategory === cat.id
                      ? "bg-gold text-black border-gold"
                      : "border-gold/30 text-cream/60 hover:border-gold/60 hover:text-cream"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="section-padding bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-cream/40 text-lg">No items found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="menu-card p-6 border border-gold/20 hover:border-gold/50 bg-charcoal group"
                  >
                    {/* Photo placeholder */}
                    <div className="w-full h-44 bg-charcoal-light mb-4 flex items-center justify-center border border-gold/10">
                      <span className="text-cream/20 text-xs tracking-wider uppercase">
                        Photo Coming Soon
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3
                        className="text-lg text-cream group-hover:text-gold transition-colors leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {item.name}
                      </h3>
                      <span className="text-gold font-semibold text-sm whitespace-nowrap">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-sm text-cream/50 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.servingInfo && (
                        <span className="text-[10px] text-cream/40 border border-cream/20 px-2 py-0.5">
                          {item.servingInfo}
                        </span>
                      )}
                      {item.tags.includes("signature") && (
                        <span className="flex items-center gap-1 text-[10px] tracking-wider text-gold border border-gold/30 px-2 py-0.5 uppercase">
                          <Star size={10} /> Signature
                        </span>
                      )}
                      {item.tags.includes("bestseller") && (
                        <span className="text-[10px] tracking-wider text-copper border border-copper/30 px-2 py-0.5 uppercase">
                          Bestseller
                        </span>
                      )}
                      {item.tags.includes("spicy") && (
                        <span className="flex items-center gap-1 text-[10px] text-wine border border-wine/30 px-2 py-0.5 uppercase">
                          <Flame size={10} /> Spicy
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-cream/30 mt-2 italic">{item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-charcoal border-t border-gold/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2
              className="text-3xl text-cream mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ready to Order?
            </h2>
            <p className="text-cream/50 mb-8">
              Book a table to dine in, or order delivery straight to your door.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">
                Book a Table
              </Button>
              <Button href="/order" variant="outline" size="lg">
                Order Delivery
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
