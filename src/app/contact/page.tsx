import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Find Delos Lounge & Dining in Morningside, Durban. Get directions, call us, WhatsApp us, or send us a message.",
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Get in Touch"
              title="Contact & Visit"
              subtitle="We would love to hear from you. Find us in Morningside, Durban. Or reach out any time."
            />
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Details */}
              <div className="space-y-6">
                <div className="border border-gold/20 p-6 bg-charcoal">
                  <h3 className="text-xs tracking-[0.2em] text-gold uppercase mb-4">Location</h3>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-cream text-sm">{siteConfig.address.full}</p>
                      <a
                        href={siteConfig.address.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold hover:text-gold-light mt-1 inline-block"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border border-gold/20 p-6 bg-charcoal">
                  <h3 className="text-xs tracking-[0.2em] text-gold uppercase mb-4">Phone & WhatsApp</h3>
                  <div className="space-y-3">
                    <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 text-cream/70 hover:text-gold transition-colors text-sm">
                      <Phone size={15} className="text-gold" />
                      {siteConfig.contact.phone}
                    </a>
                    <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-cream/70 hover:text-gold transition-colors text-sm">
                      <MessageCircle size={15} className="text-gold" />
                      WhatsApp Us
                    </a>
                  </div>
                </div>

                <div className="border border-gold/20 p-6 bg-charcoal">
                  <h3 className="text-xs tracking-[0.2em] text-gold uppercase mb-4">Email</h3>
                  <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-cream/70 hover:text-gold transition-colors text-sm">
                    <Mail size={15} className="text-gold" />
                    {siteConfig.contact.email}
                  </a>
                </div>

                <div className="border border-gold/20 p-6 bg-charcoal">
                  <h3 className="text-xs tracking-[0.2em] text-gold uppercase mb-4 flex items-center gap-2">
                    <Clock size={13} /> Trading Hours
                  </h3>
                  <div className="space-y-2">
                    {siteConfig.hours.display.map((h) => (
                      <div key={h.days} className="flex justify-between text-sm">
                        <span className="text-cream/50">{h.days}</span>
                        <span className="text-cream">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gold/20 p-6 bg-charcoal">
                  <h3 className="text-xs tracking-[0.2em] text-gold uppercase mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/60 hover:text-gold text-sm transition-colors">
                      <Instagram size={16} /> Instagram
                    </a>
                    <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/60 hover:text-gold text-sm transition-colors">
                      <Facebook size={16} /> Facebook
                    </a>
                    <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/60 hover:text-gold text-sm transition-colors">
                      <span className="text-xs font-bold">TT</span> TikTok
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="border border-gold/20 p-8 bg-charcoal">
                <h3
                  className="text-2xl text-cream mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Send a Message
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                  />
                  <select className="w-full bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors">
                    <option value="">Subject</option>
                    <option>General Enquiry</option>
                    <option>Table Booking</option>
                    <option>Private Function</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    placeholder="Your message..."
                    rows={5}
                    className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors resize-none"
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Map Embed Placeholder */}
            <div className="mt-12 border border-gold/20 bg-charcoal h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-gold/30 mx-auto mb-2" />
                <p className="text-cream/20 text-sm">Map. Morningside, Durban</p>
                <a
                  href={siteConfig.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold mt-2 inline-block hover:text-gold-light"
                >
                  View on Google Maps →
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
