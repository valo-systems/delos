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
  title: "Traditional Food Restaurant in Durban | Delos Lounge & Dining",
  description:
    "Durban's best traditional food restaurant. Delos Lounge & Dining in Morningside serves oxtail, lamb curry, umgxabhiso, usu nethumbu, and more authentic African dishes.",
};

export default function TraditionalFoodDurbanPage() {
  const traditionalItems = menuItems.filter((i) => i.category === "traditional");

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Authentic African Cooking</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Traditional Food
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Delos Lounge & Dining is Durban's home for premium traditional African food. Slow-cooked, deeply flavoured, and served with pride.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book a Table</Button>
              <Button href="/menu" variant="outline" size="lg">View Full Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Traditional Menu"
              title="Soul Food, Elevated"
              subtitle="Our traditional dishes are cooked with care and respect for the original recipes. The way they were meant to be made."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {traditionalItems.map((item) => (
                <div key={item.id} className="p-6 border border-gold/20 bg-charcoal hover:border-gold/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg text-cream group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-serif)" }}>{item.name}</h3>
                    <span className="text-gold text-sm whitespace-nowrap ml-3">{formatPrice(item.price)}</span>
                  </div>
                  <p className="text-cream/50 text-sm leading-relaxed">{item.description}</p>
                  {item.tags.includes("signature") && (
                    <span className="inline-block mt-3 text-[10px] tracking-wider text-gold border border-gold/30 px-2 py-0.5 uppercase">Signature</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book Your Table</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
