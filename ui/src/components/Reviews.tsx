import Link from "next/link";
import { Star } from "@/components/icons";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/Reveal";
import { reviews } from "@/lib/reviews";
import { siteConfig } from "@/lib/siteConfig";

export default function Reviews() {
  return (
    <section className="section-padding bg-charcoal border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="From Our Guests"
            title="What People Are Saying"
            subtitle="Real mentions from across social media. Loved your visit? Share it on Google to help others find Delos."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, idx) => (
            <Reveal key={r.id} delay={idx * 90}>
            <article
              className="hover-lift border border-gold/20 bg-black p-6 flex flex-col h-full"
            >
              <div className="flex items-center gap-1 text-gold mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} />
                ))}
              </div>
              {r.tag && (
                <span className="text-[10px] tracking-widest uppercase text-copper border border-copper/30 px-2 py-0.5 self-start mb-3">
                  {r.tag}
                </span>
              )}
              <p
                className="text-cream/80 text-sm leading-relaxed mb-4 flex-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <span className="text-gold/60 text-2xl leading-none mr-1 align-top">
                  &ldquo;
                </span>
                {r.quote}
                <span className="text-gold/60 text-2xl leading-none ml-1 align-bottom">
                  &rdquo;
                </span>
              </p>
              <div className="border-t border-gold/10 pt-3 mt-auto">
                <p className="text-xs tracking-wider uppercase text-cream">
                  {r.author}
                </p>
                {r.sourceUrl ? (
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-widest uppercase text-cream/40 hover:text-gold transition-colors"
                  >
                    {r.source} ↗
                  </a>
                ) : (
                  <p className="text-[10px] tracking-widest uppercase text-cream/40">
                    {r.source}
                  </p>
                )}
              </div>
            </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-cream/60 text-sm mb-4">
            Been to Delos? Help other guests find us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={siteConfig.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-black transition-colors"
            >
              <Star size={14} /> Leave a Google review
            </a>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase border border-gold/30 text-cream hover:border-gold transition-colors"
            >
              Book your visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
