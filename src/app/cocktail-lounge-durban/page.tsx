import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { menuItems } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cocktail Lounge in Durban | Delos Lounge & Dining, Morningside",
  description:
    "Durban's premium cocktail lounge. Delos Lounge & Dining in Morningside serves handcrafted cocktails, craft spirits and a full bar in a sophisticated lounge setting.",
};

export default function CocktailLoungeDurbanPage() {
  const cocktails = menuItems.filter((i) => i.category === "cocktails");

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Premium Bar</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Cocktail Lounge
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Delos is Durban's premium cocktail lounge. Hand-crafted cocktails, curated spirits, and a sophisticated lounge atmosphere in Morningside.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book a Table</Button>
              <Button href="/menu" variant="outline" size="lg">View Cocktail Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Signature Cocktails"
              title="Crafted with Purpose"
              subtitle="Every cocktail on the Delos menu is built to deliver a specific experience. Bold, balanced, and memorable."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {cocktails.map((c) => (
                <div key={c.id} className="p-6 border border-gold/20 bg-charcoal hover:border-gold/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-cream font-medium" style={{ fontFamily: "var(--font-serif)" }}>{c.name}</h3>
                    <span className="text-gold text-sm whitespace-nowrap ml-2">{formatPrice(c.price)}</span>
                  </div>
                  <p className="text-cream/50 text-sm leading-relaxed">{c.description}</p>
                  {c.tags.includes("signature") && (
                    <span className="inline-block mt-3 text-[10px] tracking-wider text-gold border border-gold/30 px-2 py-0.5 uppercase">Signature</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button href="/menu" variant="outline" size="lg">Full Bar Menu</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
