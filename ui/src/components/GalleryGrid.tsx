"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Food", "Shisanyama", "Cocktails", "Venue", "Events"];

const LABEL_TO_CATEGORY: Record<string, string> = {
  "Signature Dish": "Food",
  Shisanyama: "Shisanyama",
  Cocktail: "Cocktails",
  Interior: "Venue",
  "Event Night": "Events",
  Platter: "Food",
};

const LABELS = [
  "Signature Dish",
  "Shisanyama",
  "Cocktail",
  "Interior",
  "Event Night",
  "Platter",
];

const ALL_SLOTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: LABELS[i % LABELS.length],
  category: LABEL_TO_CATEGORY[LABELS[i % LABELS.length]],
  // slots 1 and 7 span 2 cols + rows in "All" view
  featured: i === 0 || i === 6,
}));

export default function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const slots =
    activeCategory === "All"
      ? ALL_SLOTS
      : ALL_SLOTS.filter((s) => s.category === activeCategory);

  return (
    <section className="section-padding bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
                cat === activeCategory
                  ? "bg-gold text-black border-gold"
                  : "border-gold/30 text-cream/60 hover:border-gold/60 hover:text-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {slots.length === 0 ? (
          <p className="text-center py-20 text-cream/40">
            No photos in this category yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`bg-charcoal border border-gold/10 flex items-center justify-center aspect-square ${
                  slot.featured && activeCategory === "All"
                    ? "col-span-2 row-span-2"
                    : ""
                }`}
              >
                <div className="text-center p-4">
                  <p className="text-cream/20 text-xs tracking-wider uppercase">
                    {slot.label}
                  </p>
                  <p className="text-cream/10 text-[10px] mt-1">
                    Photo Coming Soon
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
