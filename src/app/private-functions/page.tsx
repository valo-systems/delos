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
  title: "Private Functions & Group Bookings",
  description:
    "Host your birthday, corporate event, or private celebration at Delos Lounge & Dining in Morningside, Durban. Tailored packages for every occasion.",
};

export default function PrivateFunctionsPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Private Events"
              title="Functions & Group Bookings"
              subtitle={privateFunctions.intro}
            />
          </div>
        </section>

        {/* Packages */}
        <section className="section-padding bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {privateFunctions.packages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`p-8 border ${
                    i === 0 ? "border-gold bg-charcoal" : "border-gold/20 bg-charcoal"
                  }`}
                >
                  {i === 0 && (
                    <span className="inline-block text-[10px] tracking-widest text-black bg-gold px-2 py-0.5 uppercase mb-4">
                      Popular
                    </span>
                  )}
                  <h3
                    className="text-xl text-cream mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-cream/50 text-sm leading-relaxed mb-6">{pkg.description}</p>
                  <ul className="space-y-2 mb-8">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-cream/70">
                        <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={siteConfig.contact.whatsappUrl}
                    external
                    variant={i === 0 ? "primary" : "outline"}
                    size="md"
                  >
                    Enquire Now
                  </Button>
                </div>
              ))}
            </div>

            {/* Enquiry Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="border border-gold/20 p-8 bg-charcoal">
                <h3
                  className="text-2xl text-cream mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Make an Enquiry
                </h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                    />
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp *"
                      required
                      className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="date"
                      className="bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors w-full"
                    />
                    <select className="bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors w-full">
                      <option value="">Number of Guests</option>
                      <option>10–20</option>
                      <option>21–40</option>
                      <option>41–60</option>
                      <option>60+</option>
                    </select>
                  </div>
                  <select className="bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors w-full">
                    <option value="">Type of Event</option>
                    <option>Birthday Celebration</option>
                    <option>Corporate Event</option>
                    <option>Group Shisanyama</option>
                    <option>Private Dinner</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    placeholder="Additional details or requests..."
                    rows={4}
                    className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full resize-none"
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                    Send Enquiry
                  </Button>
                </form>
              </div>

              <div className="space-y-6">
                <div>
                  <h3
                    className="text-2xl text-cream mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Prefer to Chat?
                  </h3>
                  <p className="text-cream/50 text-sm leading-relaxed mb-4">
                    Most clients find it easier to discuss their event over WhatsApp. Message us and our events coordinator will respond within a few hours.
                  </p>
                  <a
                    href={siteConfig.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
                  >
                    WhatsApp Events Team
                  </a>
                </div>
                <div className="border border-gold/20 p-6 bg-charcoal">
                  <h4 className="text-gold text-sm tracking-wider uppercase mb-3">Good to Know</h4>
                  <ul className="space-y-2">
                    {[
                      "Minimum 10 guests for private bookings",
                      "Deposit required to secure your date",
                      "Custom menus available on request",
                      "Entertainment and DJ packages available",
                      "Full bar and cocktail service",
                      "Décor coordination available",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-cream/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
