import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { getSignatureDishes } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lounge and Dining in Durban | Delos Lounge & Dining, Morningside",
  description:
    "Premium lounge and dining in Durban. Delos Lounge & Dining in Morningside combines upscale African food, handcrafted cocktails, and a sophisticated lounge atmosphere.",
};

export default function LoungeAndDiningDurbanPage() {
  const dishes = getSignatureDishes().slice(0, 4);

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Premium Experience</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Lounge &amp; Dining
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Delos Lounge & Dining brings together premium African food, signature cocktails, and sophisticated lounge culture. All under one roof in Morningside, Durban.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book a Table</Button>
              <Button href="/menu" variant="outline" size="lg">View Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">The Concept</p>
                <h2 className="text-4xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                  Where Lounge Meets Dining
                </h2>
                <div className="divider-gold mb-6" />
                <p className="text-cream/60 leading-relaxed mb-4">
                  Delos is not just a restaurant, and it is not just a bar. It is a complete dining and lounge destination where you can start the evening with cocktails, move into a full African dining experience, and end the night in the lounge. All without leaving.
                </p>
                <p className="text-cream/60 leading-relaxed mb-6">
                  The design, the service, the music, and the food all work together to create something that Durban has not seen before. A premium African lounge and dining destination that honours culture while setting a new standard.
                </p>
                <Button href="/about" variant="outline" size="md">Our Story</Button>
              </div>
              <div className="space-y-4">
                {["Premium African Food", "Open-Flame Shisanyama", "Signature Cocktail Bar", "Events & Private Functions", "Delivery & Takeaway"].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 border border-gold/20 bg-charcoal">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-cream/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <SectionHeader eyebrow="Taste of Delos" title="Signature Dishes" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {dishes.map((dish) => (
                <div key={dish.id} className="p-6 border border-gold/20 bg-charcoal">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-cream font-medium" style={{ fontFamily: "var(--font-serif)" }}>{dish.name}</h3>
                    <span className="text-gold text-sm">{formatPrice(dish.price)}</span>
                  </div>
                  <p className="text-cream/50 text-sm">{dish.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button href="/menu" variant="outline" size="lg">Full Menu</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
