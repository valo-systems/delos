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
  title: "Shisanyama in Durban | Delos Lounge & Dining, Morningside",
  description:
    "The best shisanyama in Durban. Delos Lounge & Dining in Morningside serves premium open-flame shisanyama. Lamb chops, boerewors, chicken, ribs, and more. Book now.",
};

export default function ShisanyamaDurbanPage() {
  const shisaItems = menuItems.filter((i) => i.category === "shisanyama");

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Open Flame Grilling</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Shisanyama
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Looking for shisanyama in Durban? Delos Lounge & Dining in Morningside is where Durban comes to celebrate with fire, flavour, and company.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book Shisanyama</Button>
              <Button href="/menu" variant="outline" size="lg">View Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">The Delos Way</p>
                <h2 className="text-4xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                  Shisanyama Done the Right Way
                </h2>
                <div className="divider-gold mb-6" />
                <p className="text-cream/60 leading-relaxed mb-4">
                  At Delos, shisanyama is not just a meal. It is a celebration. Our open flame grill is central to who we are. We source premium cuts, marinate them properly, and grill them to perfection.
                </p>
                <p className="text-cream/60 leading-relaxed">
                  Whether you are celebrating a birthday, marking a milestone, or just getting the crew together, our shisanyama experience. For two, four, six, or more. Is the Durban shisanyama experience done at its best.
                </p>
              </div>
              <div className="space-y-4">
                {shisaItems.map((item) => (
                  <div key={item.id} className="p-4 border border-gold/20 bg-charcoal">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-cream font-medium">{item.name}</h4>
                      <span className="text-gold text-sm">{formatPrice(item.price)}</span>
                    </div>
                    {item.servingInfo && <p className="text-xs text-gold/60 mb-1">{item.servingInfo}</p>}
                    <p className="text-cream/40 text-sm line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Button href={siteConfig.booking.url} external variant="primary" size="lg">Book Your Shisanyama Experience</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
