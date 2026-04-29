import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { Instagram } from "@/components/icons";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Delos Lounge & Dining through our gallery. Food, atmosphere, shisanyama, cocktails and events in Morningside, Durban.",
};

const galleryCategories = ["All", "Food", "Shisanyama", "Cocktails", "Venue", "Events"];

const placeholderSlots = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: ["Signature Dish", "Shisanyama", "Cocktail", "Interior", "Event Night", "Platter"][i % 6],
}));

export default function GalleryPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Visual Story"
              title="Gallery"
              subtitle="A look inside Delos. The food, the fire, the cocktails, and the atmosphere that makes Morningside's finest dining destination."
            />
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="section-padding bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
                    cat === "All"
                      ? "bg-gold text-black border-gold"
                      : "border-gold/30 text-cream/60 hover:border-gold/60 hover:text-cream"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo grid. Placeholders until photoshoot complete */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {placeholderSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`bg-charcoal border border-gold/10 flex items-center justify-center ${
                    slot.id === 1 || slot.id === 7
                      ? "col-span-2 row-span-2 aspect-square"
                      : "aspect-square"
                  }`}
                >
                  <div className="text-center p-4">
                    <p className="text-cream/20 text-xs tracking-wider uppercase">{slot.label}</p>
                    <p className="text-cream/10 text-[10px] mt-1">Photo Coming Soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram CTA */}
        <section className="py-16 bg-charcoal border-t border-gold/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Instagram size={32} className="text-gold mx-auto mb-4" />
            <h2
              className="text-3xl text-cream mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Follow Us on Instagram
            </h2>
            <p className="text-cream/50 mb-6">
              For the latest food, events, and behind-the-scenes content from Delos, follow us on Instagram.
            </p>
            <Button href={siteConfig.social.instagram} external variant="outline" size="lg">
              @deloslounge
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
