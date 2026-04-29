import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { upcomingEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's on at Delos Lounge & Dining. Friday night lounge, Saturday shisanyama sessions, Sunday jazz brunch and more in Morningside, Durban.",
};

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="What's On"
              title="Events at Delos"
              subtitle="There is always something happening at Delos. From weekly regulars to special occasions. Find your night below."
            />
          </div>
        </section>

        {/* Weekly Events */}
        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl text-cream mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Weekly Events
            </h2>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-8 border border-gold/20 hover:border-gold/50 bg-charcoal transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-2xl text-cream mb-2"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {event.title}
                      </h3>
                      {event.time && (
                        <p className="text-xs text-gold tracking-widest uppercase mb-4">
                          {event.time}
                        </p>
                      )}
                      <p className="text-cream/60 leading-relaxed">{event.description}</p>
                      {event.price && (
                        <p className="text-sm text-cream/40 mt-4">{event.price}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Button href={siteConfig.booking.url} external variant="outline" size="md">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Private Events CTA */}
        <section className="py-20 bg-gold">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2
              className="text-4xl font-bold text-black mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Host Your Own Event
            </h2>
            <p className="text-black/70 mb-8">
              Looking for a venue for a birthday, corporate dinner, or private celebration? Delos is the perfect setting. Our events team will take care of everything.
            </p>
            <Button href="/private-functions" variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-gold">
              View Private Functions
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
