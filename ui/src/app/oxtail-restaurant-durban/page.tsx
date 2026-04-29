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
  title: "Oxtail Restaurant in Durban | Delos Lounge & Dining, Morningside",
  description:
    "The best oxtail in Durban. Delos Lounge & Dining in Morningside serves slow-braised oxtail in a rich, spiced gravy with pap and chakalaka. Book a table today.",
};

export default function OxtailRestaurantDurbanPage() {
  const oxtail = menuItems.find((i) => i.id === "traditional-1");
  const otherTraditional = menuItems.filter((i) => i.category === "traditional" && i.id !== "traditional-1").slice(0, 3);

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Durban's Finest</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Oxtail Restaurant
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              If you are searching for the best oxtail in Durban, your search ends at Delos Lounge & Dining in Morningside. Slow-braised, deeply flavoured, and served the way it should be.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book a Table</Button>
              <Button href="/menu" variant="outline" size="lg">Full Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {oxtail && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <span className="inline-block text-[10px] tracking-widest text-gold border border-gold/30 px-2 py-0.5 uppercase mb-4">Signature Dish</span>
                  <h2 className="text-4xl font-bold text-cream mb-4" style={{ fontFamily: "var(--font-serif)" }}>{oxtail.name}</h2>
                  <div className="divider-gold mb-6" />
                  <p className="text-cream/60 leading-relaxed mb-4">{oxtail.description}</p>
                  <p className="text-cream/60 leading-relaxed mb-6">
                    Our oxtail is cooked low and slow until the meat falls off the bone. The gravy is rich and deeply seasoned, served alongside stiff pap and fresh chakalaka. It is comfort food at its finest, made with the quality and care you deserve.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl text-gold font-bold">{formatPrice(oxtail.price)}</span>
                    <span className="text-cream/40 text-sm">per serving</span>
                  </div>
                  <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book to Try It</Button>
                </div>
                <div className="w-full h-72 bg-charcoal border border-gold/10 flex items-center justify-center">
                  <p className="text-cream/20 text-xs tracking-wider uppercase">Oxtail Photo Coming Soon</p>
                </div>
              </div>
            )}

            <SectionHeader eyebrow="Also Worth Trying" title="More Traditional Dishes" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherTraditional.map((item) => (
                <div key={item.id} className="p-6 border border-gold/20 bg-charcoal">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-cream font-medium" style={{ fontFamily: "var(--font-serif)" }}>{item.name}</h3>
                    <span className="text-gold text-sm">{formatPrice(item.price)}</span>
                  </div>
                  <p className="text-cream/50 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
