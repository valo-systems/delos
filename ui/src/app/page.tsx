import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Phone } from "@/components/icons";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { RestaurantStructuredData } from "@/components/StructuredData";
import BrandSeal from "@/components/brand/BrandSeal";
import Reviews from "@/components/Reviews";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/siteConfig";
import type { CSSProperties } from "react";
import { getSignatureDishes, getBestsellers } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";
import { upcomingEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Delos Lounge & Dining | Premium African Restaurant in Morningside, Durban",
  description:
    "Delos Lounge & Dining. Durban's premium African restaurant, shisanyama, cocktail lounge, and events venue in Morningside. Book a table, view the menu, or order delivery.",
};

const highlights = [
  {
    icon: "🔥",
    title: "Shisanyama",
    desc: "Open-flame grilled meats. Boerewors, lamb chops, chicken. Done the right way.",
    href: "/shisanyama-morningside",
  },
  {
    icon: "🍲",
    title: "Traditional Food",
    desc: "Slow-cooked oxtail, lamb curry, umgxabhiso, usu nethumbu and more.",
    href: "/traditional-food-durban",
  },
  {
    icon: "🍸",
    title: "Cocktail Lounge",
    desc: "Signature cocktails, craft spirits, and a full bar in a premium lounge setting.",
    href: "/cocktail-lounge-durban",
  },
  {
    icon: "🎉",
    title: "Events & Functions",
    desc: "Birthdays, corporates, group bookings. We make every occasion unforgettable.",
    href: "/private-functions",
  },
];

export default function HomePage() {
  const signatureDishes = getSignatureDishes().slice(0, 6);
  const bestsellers = getBestsellers().slice(0, 3);

  return (
    <>
      <RestaurantStructuredData />
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
          <div
            className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-black opacity-90"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />
          {/* Decorative circular seal watermark. Kept low-opacity so the
              hero copy and CTAs always dominate. */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <BrandSeal
              size={620}
              opacity={0.06}
              className="max-w-[80vw] max-h-[80vh] w-auto h-auto animate-breathe"
            />
          </div>
          {/* Soft radial vignette to keep CTAs legible over the seal. */}
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,12,12,0.55)_70%)]"
            aria-hidden="true"
          />
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <p
              className="text-xs tracking-[0.4em] text-gold uppercase mb-6 hero-fade"
              style={{ "--delay": "0ms" } as CSSProperties}
            >
              Morningside, Durban
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-cream mb-6 leading-none hero-fade"
              style={{ fontFamily: "var(--font-serif)", "--delay": "220ms" } as CSSProperties}
            >
              Where Africa
              <br />
              <span className="text-gold">Dines in Style</span>
            </h1>
            <p
              className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed hero-fade"
              style={{ "--delay": "360ms" } as CSSProperties}
            >
              Premium African dining, shisanyama, cocktails and lounge culture. The finest table in Morningside.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade"
              style={{ "--delay": "480ms" } as CSSProperties}
            >
              <Button href="/bookings" variant="primary" size="lg">
                Book a Table
              </Button>
              <Button href="/order" variant="outline" size="lg">
                Order Online
              </Button>
            </div>
            <div
              className="mt-4 hero-fade"
              style={{ "--delay": "580ms" } as CSSProperties}
            >
              <Link
                href="/menu"
                className="text-xs tracking-[0.3em] uppercase text-cream/50 hover:text-gold transition-colors"
              >
                View Menu →
              </Link>
            </div>
            <div
              className="flex items-center justify-center gap-6 mt-10 text-sm text-cream/40 hero-fade"
              style={{ "--delay": "660ms" } as CSSProperties}
            >
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                Morningside, Durban
              </span>
              <span className="hidden sm:block text-gold/30">|</span>
              <span className="hidden sm:flex items-center gap-2">
                <Clock size={14} className="text-gold" />
                Mon–Sun from 10:00
              </span>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent mx-auto" />
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="section-padding bg-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                eyebrow="The Delos Experience"
                title="More Than a Restaurant"
                subtitle="Delos is a full dining and lounge experience. From slow-cooked traditional dishes to open-flame shisanyama, hand-crafted cocktails, and unforgettable private events."
              />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, idx) => (
                <Reveal key={item.title} delay={idx * 90}>
                  <Link
                    href={item.href}
                    className="hover-lift group p-6 border border-gold/20 hover:border-gold/60 bg-black/30 hover:bg-black/50 block h-full"
                  >
                    <span className="text-3xl block mb-4">{item.icon}</span>
                    <h3
                      className="text-xl text-cream mb-2 group-hover:text-gold transition-colors"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-cream/50 leading-relaxed mb-4">{item.desc}</p>
                    <span className="text-xs text-gold tracking-widest uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                      Discover <ArrowRight size={12} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SIGNATURE DISHES */}
        <section className="section-padding bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                eyebrow="From Our Kitchen"
                title="Signature Dishes"
                subtitle="Dishes that define the Delos experience. Crafted with premium ingredients and deep culinary tradition."
              />
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {signatureDishes.map((dish, idx) => (
                <Reveal key={dish.id} delay={idx * 90}>
                <div
                  className="menu-card hover-lift group p-6 border border-gold/20 hover:border-gold/50 bg-charcoal h-full"
                >
                  <div className="w-full h-48 bg-charcoal-light mb-4 flex items-center justify-center border border-gold/10">
                    <span className="text-cream/20 text-xs tracking-wider uppercase">
                      Photo Coming Soon
                    </span>
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="text-lg text-cream group-hover:text-gold transition-colors"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {dish.name}
                    </h3>
                    <span className="text-gold font-medium text-sm whitespace-nowrap ml-4">
                      {formatPrice(dish.price)}
                    </span>
                  </div>
                  <p className="text-sm text-cream/50 leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                  {dish.tags.includes("signature") && (
                    <span className="inline-block mt-3 text-[10px] tracking-widest text-gold border border-gold/30 px-2 py-0.5 uppercase">
                      Signature
                    </span>
                  )}
                </div>
                </Reveal>
              ))}
            </div>
            <div className="text-center">
              <Button href="/menu" variant="outline" size="lg">
                View Full Menu
              </Button>
            </div>
          </div>
        </section>

        {/* SHISANYAMA SECTION */}
        <section className="section-padding bg-charcoal relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #C9A84C 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Open Flame</p>
                <h2
                  className="text-4xl md:text-5xl font-bold text-cream mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Shisanyama
                  <br />
                  <span className="text-gold">Done Right</span>
                </h2>
                <div className="divider-gold mb-6" />
                <p className="text-cream/60 leading-relaxed mb-6">
                  There is nothing quite like meat grilled over open flame. At Delos, our shisanyama is a celebration. Boerewors, lamb chops, chicken, pork ribs, all done on the grill with nothing but fire, seasoning, and skill.
                </p>
                <p className="text-cream/60 leading-relaxed mb-8">
                  Whether it is just the two of you or a group of twenty, we have a shisanyama experience that will have you coming back.
                </p>
                <div className="flex gap-4">
                  <Button href="/shisanyama-morningside" variant="primary" size="md">
                    Shisanyama Menu
                  </Button>
                  <Button href={siteConfig.booking.url} external variant="outline" size="md">
                    Book Now
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {bestsellers.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-center gap-4 p-4 border border-gold/20 bg-black/30 hover:border-gold/40 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-cream font-medium">{dish.name}</h4>
                        <span className="text-gold text-sm">{formatPrice(dish.price)}</span>
                      </div>
                      <p className="text-cream/40 text-sm mt-1 line-clamp-1">{dish.description}</p>
                    </div>
                  </div>
                ))}
                <Link
                  href="/menu"
                  className="flex items-center gap-2 text-gold text-sm tracking-wider hover:gap-3 transition-all"
                >
                  See full menu <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section className="section-padding bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                eyebrow="What's On"
                title="Events at Delos"
                subtitle="From Friday night lounge sessions to Saturday shisanyama and Sunday jazz brunch. Something is always happening at Delos."
              />
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {upcomingEvents.map((event, idx) => (
                <Reveal key={event.id} delay={idx * 90}>
                <div
                  className="hover-lift p-6 border border-gold/20 hover:border-gold/50 bg-charcoal h-full group"
                >
                  <h3
                    className="text-xl text-cream mb-2 group-hover:text-gold transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {event.title}
                  </h3>
                  {event.time && (
                    <p className="text-xs text-gold tracking-wider mb-3">{event.time}</p>
                  )}
                  <p className="text-sm text-cream/50 leading-relaxed mb-4">{event.description}</p>
                  {event.price && <p className="text-xs text-cream/40">{event.price}</p>}
                </div>
                </Reveal>
              ))}
            </div>
            <div className="text-center">
              <Button href="/events" variant="outline" size="lg">
                All Events
              </Button>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <Reviews />

        {/* PRIVATE FUNCTIONS CTA */}
        <section className="py-20 bg-gold">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] text-black/60 uppercase mb-4">Celebrate with us</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-black mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Planning a Private Event?
            </h2>
            <p className="text-black/70 text-lg mb-8 max-w-2xl mx-auto">
              Birthdays, corporate dinners, group bookings, and private functions. Our events team will handle everything so you can focus on the moment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/private-functions" variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-gold">
                View Packages
              </Button>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-gold text-sm tracking-widest uppercase hover:bg-charcoal transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        {/* DELIVERY */}
        <section className="section-padding bg-charcoal">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <SectionHeader
              eyebrow="Delos at Home"
              title="Order Delivery"
              subtitle="Can't make it in? Get your Delos favourites delivered. Available on Uber Eats and Mr D Food."
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href={siteConfig.delivery.uberEats} external variant="primary" size="lg">
                Order on Uber Eats
              </Button>
              <Button href={siteConfig.delivery.mrDelivery} external variant="outline" size="lg">
                Order on Mr D
              </Button>
            </div>
          </div>
        </section>

        {/* LOCATION STRIP */}
        <section className="py-12 border-t border-gold/20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <MapPin className="text-gold mx-auto mb-2" size={20} />
                <h4 className="text-sm tracking-wider text-cream uppercase mb-1">Find Us</h4>
                <p className="text-cream/50 text-sm">{siteConfig.address.full}</p>
                <a
                  href={siteConfig.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:text-gold-light mt-1 inline-block"
                >
                  Get Directions →
                </a>
              </div>
              <div>
                <Clock className="text-gold mx-auto mb-2" size={20} />
                <h4 className="text-sm tracking-wider text-cream uppercase mb-1">Hours</h4>
                {siteConfig.hours.display.map((h) => (
                  <p key={h.days} className="text-cream/50 text-sm">
                    {h.days}: {h.hours}
                  </p>
                ))}
              </div>
              <div>
                <Phone className="text-gold mx-auto mb-2" size={20} />
                <h4 className="text-sm tracking-wider text-cream uppercase mb-1">Reservations</h4>
                <a href={`tel:${siteConfig.contact.phone}`} className="text-cream/50 text-sm hover:text-gold block">
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:text-gold-light mt-1 inline-block"
                >
                  WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
