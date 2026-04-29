import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind Delos Lounge & Dining. Morningside's premium African restaurant, shisanyama, and cocktail lounge in Durban.",
};

const values = [
  {
    title: "Premium Quality",
    desc: "Every dish, every cocktail, every detail is held to the highest standard. We do not cut corners.",
  },
  {
    title: "Cultural Authenticity",
    desc: "Our food is rooted in African culinary tradition. Real flavours, real ingredients, real technique.",
  },
  {
    title: "Warm Hospitality",
    desc: "At Delos, every guest is treated like family. Whether it is your first or fiftieth visit, you belong here.",
  },
  {
    title: "Community",
    desc: "We are proud to be part of Morningside and Durban. Delos is where the community comes together.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Our Story"
              title="About Delos"
              subtitle="Premium African dining, shisanyama, cocktails and lounge culture in the heart of Morningside, Durban."
            />
          </div>
        </section>

        {/* Story */}
        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Who We Are</p>
                <h2
                  className="text-4xl font-bold text-cream mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  A New Standard for African Dining in Durban
                </h2>
                <div className="divider-gold mb-6" />
                <p className="text-cream/60 leading-relaxed mb-4">
                  Delos Lounge & Dining was born from a simple idea: that African food and culture deserve to be celebrated at the highest level. That traditional dishes like oxtail, umgxabhiso, and shisanyama can be presented with the same care and prestige as any fine dining experience.
                </p>
                <p className="text-cream/60 leading-relaxed mb-4">
                  Situated in Morningside, Durban, Delos brings together the best of African culinary tradition with a modern lounge setting. Premium cocktails, warm service, and an atmosphere that feels both exclusive and welcoming.
                </p>
                <p className="text-cream/60 leading-relaxed">
                  Whether you are coming for a quiet dinner, a weekend shisanyama, a cocktail session, or a private event, Delos is where Durban comes to celebrate.
                </p>
              </div>
              <div className="w-full h-80 bg-charcoal border border-gold/10 flex items-center justify-center">
                <p className="text-cream/20 text-xs tracking-wider uppercase">Restaurant Photo</p>
              </div>
            </div>

            {/* Values */}
            <SectionHeader
              eyebrow="What Drives Us"
              title="Our Values"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {values.map((val) => (
                <div key={val.title} className="p-6 border border-gold/20 bg-charcoal">
                  <div className="divider-gold mb-4" />
                  <h3
                    className="text-lg text-cream mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {val.title}
                  </h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>

            {/* Cuisine */}
            <div className="border border-gold/20 p-10 bg-charcoal text-center">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">What We Serve</p>
              <h2
                className="text-3xl text-cream mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                A Full African Dining Experience
              </h2>
              <p className="text-cream/50 max-w-2xl mx-auto mb-8 leading-relaxed">
                From slow-braised oxtail and Durban lamb curry to open-flame shisanyama, fresh seafood, premium cocktails, and everything in between. The Delos menu reflects the full richness of African food culture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/menu" variant="primary" size="lg">View Menu</Button>
                <Button href={siteConfig.booking.url} external variant="outline" size="lg">Book a Table</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
