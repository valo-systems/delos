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
  title: "Shisanyama in Morningside, Durban | Delos Lounge & Dining",
  description:
    "The best shisanyama in Morningside, Durban. Delos Lounge & Dining serves premium open-flame grills, boerewors, lamb chops, and more. Book online or call us.",
};

export default function ShisanyamaMorningsidePage() {
  const shisaItems = menuItems.filter((i) => i.category === "shisanyama");

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Morningside, Durban</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Shisanyama in
              <br />
              <span className="text-gold">Morningside</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Delos Lounge & Dining brings Morningside's finest shisanyama experience. Premium cuts, open flame, and good company.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book a Table</Button>
              <Button href="/menu" variant="outline" size="lg">View Shisanyama Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Shisanyama Menu"
              title="Choose Your Feast"
              subtitle="From a shisanyama for two to a full spread for six. Find your perfect Delos grill experience."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {shisaItems.map((item) => (
                <div key={item.id} className="p-6 border border-gold/20 bg-charcoal hover:border-gold/50 transition-colors">
                  <div className="w-full h-36 bg-black border border-gold/10 mb-4 flex items-center justify-center">
                    <span className="text-cream/20 text-xs">Photo Coming Soon</span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-cream font-medium" style={{ fontFamily: "var(--font-serif)" }}>{item.name}</h3>
                    <span className="text-gold text-sm whitespace-nowrap ml-2">{formatPrice(item.price)}</span>
                  </div>
                  {item.servingInfo && <p className="text-xs text-gold/60 mb-2">{item.servingInfo}</p>}
                  <p className="text-cream/40 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book Your Table</Button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-charcoal border-t border-gold/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-cream/50 text-sm">
              Delos Lounge & Dining, {siteConfig.address.full}
            </p>
            <a href={siteConfig.address.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold text-sm hover:text-gold-light mt-2 inline-block">
              Get Directions →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
