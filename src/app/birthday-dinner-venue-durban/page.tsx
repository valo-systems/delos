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
  title: "Birthday Dinner Venue in Durban | Delos Lounge & Dining",
  description:
    "Looking for a birthday dinner venue in Durban? Delos Lounge & Dining in Morningside offers premium birthday packages, private dining, and an unforgettable celebration experience.",
};

const birthdayPackage = privateFunctions.packages[0];

export default function BirthdayVenueDurbanPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Celebrate in Style</p>
            <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Birthday Dinner Venue
              <br />
              <span className="text-gold">in Durban</span>
            </h1>
            <div className="flex justify-center mb-4"><span className="divider-gold" /></div>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-8">
              Make your birthday unforgettable. Delos Lounge & Dining in Morningside is Durban's premier birthday celebration venue. Premium food, a sophisticated setting, and a dedicated events team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.contact.whatsappUrl} external variant="primary" size="lg">Enquire Now</Button>
              <Button href="/private-functions" variant="outline" size="lg">View Packages</Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Birthday Package</p>
                <h2 className="text-4xl font-bold text-cream mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                  {birthdayPackage.name}
                </h2>
                <div className="divider-gold mb-6" />
                <p className="text-cream/60 leading-relaxed mb-6">{birthdayPackage.description}</p>
                <ul className="space-y-3 mb-8">
                  {birthdayPackage.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-cream/70 text-sm">
                      <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href={siteConfig.contact.whatsappUrl} external variant="primary" size="lg">Book Your Birthday</Button>
              </div>
              <div className="space-y-4">
                {[
                  { q: "How far in advance should I book?", a: "We recommend booking at least 2 weeks in advance for birthday events, especially on weekends." },
                  { q: "Can I bring my own cake?", a: "Yes, you are welcome to bring a cake. We will take care of the candles and the moment." },
                  { q: "Is there a minimum guest count?", a: "Birthday packages require a minimum of 10 guests." },
                  { q: "Can we choose the menu?", a: "Yes. Our events team will work with you to select a menu that suits your group's preferences." },
                  { q: "Is a deposit required?", a: "A deposit is required to secure your date. Our team will provide full details on enquiry." },
                ].map((item) => (
                  <div key={item.q} className="p-4 border border-gold/20 bg-charcoal">
                    <h4 className="text-sm text-cream font-medium mb-1">{item.q}</h4>
                    <p className="text-cream/50 text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
