import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import GalleryGrid from "@/components/GalleryGrid";
import { siteConfig } from "@/lib/siteConfig";
import { Instagram } from "@/components/icons";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Delos Lounge & Dining through our gallery. Food, atmosphere, shisanyama, cocktails and events in Morningside, Durban.",
};

export default function GalleryPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Visual Story"
              title="Gallery"
              subtitle="A look inside Delos. The food, the fire, the cocktails, and the atmosphere that makes Morningside's finest dining destination."
            />
          </div>
        </section>

        {/* Interactive gallery grid with category filters */}
        <GalleryGrid />

        {/* Instagram CTA */}
        <section className="py-16 bg-charcoal border-t border-gold/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Instagram size={32} className="text-gold mx-auto mb-4" />
            <h2
              className="text-3xl text-cream mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Follow Us on Instagram
            </h2>
            <p className="text-cream/50 mb-6">
              For the latest food, events, and behind-the-scenes content from
              Delos, follow us on Instagram.
            </p>
            <Button href={siteConfig.social.instagram} external variant="outline" size="lg">
              @deloslounge
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
