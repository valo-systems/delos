import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { privateFunctions } from "@/lib/events";
import { Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "Group Dining Restaurant in Durban | Delos Lounge & Dining",
  description:
    "Planning group dining in Durban? Delos Lounge & Dining in Morningside caters for groups of all sizes. Premium food, shisanyama platters, cocktails, and private spaces.",
};

export default function GroupDiningDurbanPage() {
  const groupPkg = privateFunctions.packages[2];

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Group Experiences</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Group Dining
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Delos Lounge & Dining is Durban's ideal destination for group dining. Large platters, shisanyama experiences, a full bar, and tailored group packages for every occasion.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.contact.whatsappUrl} external variant="primary" size="lg">Book for Your Group</Button>
              <Button href="/menu" variant="outline" size="lg">View Menu</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Group Options"
              title="Built for Groups"
              subtitle="From a group of 8 at a regular table to a shisanyama spread for 50. Delos can accommodate your crew."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { size: "8–15 Guests", title: "Group Table", desc: "Reserved seating for your group with a dedicated server and à la carte or set menu options." },
                { size: "15–30 Guests", title: "Semi-Private Dining", desc: "A semi-private area within Delos with a tailored menu and bar package." },
                { size: "30+ Guests", title: "Full Private Function", desc: "Exclusive use of a Delos space with DJ, custom menu, full bar, and event coordination." },
              ].map((opt) => (
                <div key={opt.size} className="p-6 border border-gold/20 bg-charcoal">
                  <span className="text-xs text-gold tracking-widest uppercase">{opt.size}</span>
                  <h3 className="text-xl text-cream mt-2 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{opt.title}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="border border-gold p-8 bg-charcoal">
              <h3 className="text-2xl text-cream mb-4" style={{ fontFamily: "var(--font-serif)" }}>{groupPkg.name}</h3>
              <p className="text-cream/60 text-sm leading-relaxed mb-4">{groupPkg.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {groupPkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-cream/70">
                    <Check size={13} className="text-gold mt-0.5 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Button href={siteConfig.contact.whatsappUrl} external variant="primary" size="md">Enquire for Your Group</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
