import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { getSignatureDishes } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";
import { LocalBusinessStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "African Restaurant in Durban | Delos Lounge & Dining, Morningside",
  description:
    "Looking for an African restaurant in Durban? Delos Lounge & Dining in Morningside serves premium African food. Oxtail, lamb curry, shisanyama, traditional dishes, cocktails and more.",
};

export default function AfricanRestaurantDurbanPage() {
  const dishes = getSignatureDishes().slice(0, 4);

  return (
    <>
      <LocalBusinessStructuredData />
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Morningside, Durban</p>
            <h1
              className="text-5xl md:text-6xl font-bold text-cream mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              African Restaurant
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Delos Lounge & Dining is Durban's premium African restaurant. Celebrating the richness of African food culture in a modern, sophisticated setting in Morningside.
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
              eyebrow="What We Serve"
              title="A Full African Dining Experience"
              subtitle="From slow-braised oxtail and Durban lamb curry to open-flame shisanyama and fresh seafood. The Delos menu is a celebration of African culinary tradition."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {dishes.map((dish) => (
                <div key={dish.id} className="p-6 border border-gold/20 bg-charcoal">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg text-cream" style={{ fontFamily: "var(--font-serif)" }}>{dish.name}</h3>
                    <span className="text-gold text-sm">{formatPrice(dish.price)}</span>
                  </div>
                  <p className="text-cream/50 text-sm">{dish.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button href="/menu" variant="outline" size="lg">View Full Menu</Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal border-t border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl text-cream mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Visit Delos in Morningside, Durban
            </h2>
            <p className="text-cream/50 mb-2">{siteConfig.address.full}</p>
            <a href={siteConfig.address.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold text-sm hover:text-gold-light">
              Get Directions →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
