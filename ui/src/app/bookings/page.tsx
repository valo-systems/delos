"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { api } from "@/lib/api";
import { Phone, MessageCircle, CalendarDays } from "@/components/icons";
import type { Reservation } from "@/lib/types";

export default function BookingsPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("19:00");
  const [guestCount, setGuestCount] = useState(2);
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const data = await api.post<{ reservation: Reservation }>("/reservations", {
        name, phone, date, time, guestCount: Number(guestCount), occasion: occasion || undefined, notes: notes || undefined,
      });
      setReservation(data.reservation);
      setSubmitting(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit reservation.");
      setSubmitting(false);
    }
  }

  if (reservation) {
    return (
      <>
        <Navigation />
        <StickyActions />
        <main className="pb-16 lg:pb-0">
          <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
                Reservation Reference
              </p>
              <h1
                className="text-4xl md:text-5xl text-cream mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {reservation.id}
              </h1>
              <p className="text-cream/60 text-sm max-w-lg mx-auto">
                Thanks {reservation.name}. Your reservation is{" "}
                <span className="text-gold">pending confirmation</span>. Our
                team will reach out via WhatsApp or phone shortly.
              </p>
            </div>
          </section>

          <section className="section-padding bg-black">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="border border-gold/20 bg-charcoal p-6">
                <dl className="grid grid-cols-2 gap-y-3 text-sm">
                  <dt className="text-cream/50">Date</dt>
                  <dd className="text-cream text-right">{reservation.date}</dd>
                  <dt className="text-cream/50">Time</dt>
                  <dd className="text-cream text-right">{reservation.time}</dd>
                  <dt className="text-cream/50">Guests</dt>
                  <dd className="text-cream text-right">
                    {reservation.guestCount}
                  </dd>
                  <dt className="text-cream/50">Phone</dt>
                  <dd className="text-cream text-right">{reservation.phone}</dd>
                  {reservation.occasion && (
                    <>
                      <dt className="text-cream/50">Occasion</dt>
                      <dd className="text-cream text-right">
                        {reservation.occasion}
                      </dd>
                    </>
                  )}
                </dl>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  href={siteConfig.contact.whatsappUrl}
                  external
                  variant="primary"
                  size="lg"
                >
                  WhatsApp us to confirm
                </Button>
                <Button
                  href={`tel:${siteConfig.contact.phone}`}
                  variant="outline"
                  size="lg"
                >
                  Call the venue
                </Button>
              </div>

              <p className="text-xs text-cream/40 text-center">
                Save your reference number. You can quote it when we contact
                you.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Reservations"
              title="Book Your Table"
              subtitle="Reserve a table at Delos directly. We aim to confirm within minutes during trading hours."
            />
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="border border-gold/30 bg-charcoal p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  required
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                />
                <Field
                  label="Phone / WhatsApp"
                  required
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="e.g. 082 000 0000"
                />
                <Field
                  label="Date"
                  required
                  type="date"
                  value={date}
                  onChange={setDate}
                  min={today}
                />
                <Field
                  label="Time"
                  required
                  type="time"
                  value={time}
                  onChange={setTime}
                />
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                    Guests <span className="text-wine">*</span>
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    required
                    className="w-full bg-black border border-gold/30 focus:border-gold text-cream px-4 py-3 text-sm outline-none transition-colors"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                    <option value={15}>13–15 guests</option>
                    <option value={20}>16–20 guests</option>
                    <option value={30}>20+ (group / events)</option>
                  </select>
                </div>
                <Field
                  label="Occasion (optional)"
                  value={occasion}
                  onChange={setOccasion}
                  placeholder="Birthday, anniversary…"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dietary requirements, seating preference…"
                  className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>

              {submitError && (
                <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Request reservation"}
                </Button>
                <Button
                  href={siteConfig.contact.whatsappUrl}
                  external
                  variant="outline"
                  size="lg"
                >
                  Or book on WhatsApp
                </Button>
              </div>

              <p className="text-[11px] text-cream/40">
                We respond to reservation requests during trading hours. For
                groups of 8+, our events team may follow up directly.
              </p>
            </form>

            {/* Side info */}
            <aside className="space-y-6">
              <div className="border border-gold/20 bg-charcoal p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={20} className="text-gold" />
                  <h3
                    className="text-lg text-cream"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Faster on WhatsApp?
                  </h3>
                </div>
                <p className="text-cream/60 text-sm leading-relaxed mb-4">
                  Send your date, time, and group size — confirmation within
                  minutes during trading hours.
                </p>
                <Button
                  href={siteConfig.contact.whatsappUrl}
                  external
                  variant="outline"
                  size="sm"
                >
                  WhatsApp us
                </Button>
              </div>

              <div className="border border-gold/20 bg-charcoal p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone size={20} className="text-gold" />
                  <h3
                    className="text-lg text-cream"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Prefer to call?
                  </h3>
                </div>
                <p className="text-cream/60 text-sm leading-relaxed mb-4">
                  Speak directly to our team during trading hours.
                </p>
                <Button
                  href={`tel:${siteConfig.contact.phone}`}
                  variant="outline"
                  size="sm"
                >
                  Call now
                </Button>
              </div>

              <div className="border border-gold/20 bg-charcoal p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarDays size={20} className="text-gold" />
                  <h3
                    className="text-lg text-cream"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Trading Hours
                  </h3>
                </div>
                <div className="space-y-2">
                  {siteConfig.hours.display.map((h) => (
                    <div
                      key={h.days}
                      className="flex justify-between items-center text-sm border-b border-gold/10 pb-2 last:border-b-0 last:pb-0"
                    >
                      <span className="text-cream/60">{h.days}</span>
                      <span className="text-cream">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
        {label}
        {required && <span className="text-wine"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
      />
    </div>
  );
}
