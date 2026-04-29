"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { privateFunctions } from "@/lib/events";
import { Check } from "@/components/icons";
import { api } from "@/lib/api";

const PACKAGE_NAMES = privateFunctions.packages.map((p) => p.name);

export default function PrivateFunctionsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventType, setEventType] = useState("");
  const [packageName, setPackageName] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.post<{ enquiry: { id: string } }>("/enquiries", {
        name,
        phone,
        email: email || undefined,
        date,
        guestCount: Number(guestCount),
        eventType,
        packageName: packageName || undefined,
        details: details || undefined,
      });
      setSubmitted({ id: data.enquiry.id, name });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not submit enquiry. Please try again.");
      setSubmitting(false);
    }
  }

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

                {submitted ? (
                  <div className="space-y-4">
                    <div className="border border-gold/30 bg-black/50 p-6">
                      <p className="text-gold text-xs tracking-widest uppercase mb-2">Enquiry received</p>
                      <p className="text-cream text-lg mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                        Thank you, {submitted.name}.
                      </p>
                      <p className="text-cream/60 text-sm leading-relaxed mb-4">
                        We&rsquo;ll be in touch within 24 hours.
                      </p>
                      <p className="text-cream/40 text-xs">
                        Reference: <span className="text-gold font-mono">{submitted.id}</span>
                      </p>
                    </div>
                    <a
                      href={siteConfig.contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
                    >
                      WhatsApp Events Team
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                          Full name <span className="text-wine">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                          Phone / WhatsApp <span className="text-wine">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 082 000 0000"
                          className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                          Date of event <span className="text-wine">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 10)}
                          className="bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                          Estimated guests <span className="text-wine">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          placeholder="e.g. 30"
                          className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Event type <span className="text-wine">*</span>
                      </label>
                      <select
                        required
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors w-full"
                      >
                        <option value="">Select event type</option>
                        <option>Birthday</option>
                        <option>Corporate Event</option>
                        <option>Wedding</option>
                        <option>Anniversary</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Package interested in
                      </label>
                      <select
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        className="bg-black border border-gold/30 focus:border-gold text-cream/60 px-4 py-3 text-sm outline-none transition-colors w-full"
                      >
                        <option value="">Not sure yet</option>
                        {PACKAGE_NAMES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Additional details
                      </label>
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Additional details or requests..."
                        rows={4}
                        className="bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors w-full resize-none"
                      />
                    </div>

                    {error && (
                      <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                      disabled={submitting}
                    >
                      {submitting ? "Sending…" : "Send Enquiry"}
                    </Button>
                  </form>
                )}
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
