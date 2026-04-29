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
  title: "Restaurant in Morningside, Durban | Delos Lounge & Dining",
  description:
    "Delos Lounge & Dining is Morningside's premier restaurant. Premium African food, shisanyama, cocktails, and events. Book a table today.",
};

export default function RestaurantMorningsidePage() {
  const dishes = getSignatureDishes().slice(0, 4);

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Morningside</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Restaurant in
              <br />
              <span className="text-gold">Morningside, Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              If you are looking for a restaurant in Morningside, Durban. Delos Lounge & Dining is the answer. Premium food, a sophisticated atmosphere, and a dining experience unlike anywhere else in KwaZulu-Natal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book a Table</Button>
              <Button href="/menu" variant="outline" size="lg">View Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="What to Expect"
              title="Why Delos?"
              subtitle="Delos is not just another restaurant in Morningside. It is a full experience. From the food to the atmosphere to the service."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { title: "Premium African Food", desc: "Oxtail, lamb curry, shisanyama, seafood and more. All made with care and quality ingredients." },
                { title: "Cocktail Lounge", desc: "A sophisticated bar with signature cocktails, craft spirits, and a curated drinks list." },
                { title: "Events & Functions", desc: "The ideal venue for birthdays, group dining, corporate events, and private celebrations." },
              ].map((item) => (
                <div key={item.title} className="p-6 border border-gold/20 bg-charcoal">
                  <h3 className="text-lg text-cream mb-2" style={{ fontFamily: "var(--font-serif)" }}>{item.title}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <SectionHeader eyebrow="Signature Dishes" title="From Our Kitchen" />
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

        <section className="py-12 bg-charcoal border-t border-gold/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-2xl text-cream mb-2" style={{ fontFamily: "var(--font-serif)" }}>Find Us</h3>
            <p className="text-cream/50 text-sm mb-2">{siteConfig.address.full}</p>
            <a href={siteConfig.address.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold text-sm hover:text-gold-light">Get Directions →</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
