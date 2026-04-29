"use client";

import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminGuard from "@/components/AdminGuard";
import { api } from "@/lib/api";
import type { Reservation, ReservationStatus } from "@/lib/types";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  contacted: "Contacted",
};

const ACTIONS: ReservationStatus[] = ["accepted", "contacted", "declined"];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.get<{ reservations: Reservation[] }>("/reservations", true);
      setReservations(data.reservations ?? []);
      setError(null);
    } catch {
      setError("Could not load reservations.");
    }
  }

  useEffect(() => {
    // Defer the first load so setState doesn't fire synchronously inside the effect.
    const initial = setTimeout(load, 0);
    const interval = setInterval(load, 15000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  async function updateStatus(id: string, status: ReservationStatus) {
    try {
      await api.patch(`/reservations/${id}`, { status });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  // Group reservations by date.
  const grouped = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of reservations) {
      const list = map.get(r.date) ?? [];
      list.push(r);
      map.set(r.date, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, list]) => ({
        date,
        list: list.sort((a, b) => a.time.localeCompare(b.time)),
      }));
  }, [reservations]);

  const today = new Date().toISOString().slice(0, 10);

  // Capacity hint: any same-date+time pair is flagged as a possible conflict.
  function conflictKey(r: Reservation) {
    return `${r.date}-${r.time}`;
  }
  const conflictCount = new Map<string, number>();
  for (const r of reservations) {
    if (r.status === "declined") continue;
    const k = conflictKey(r);
    conflictCount.set(k, (conflictCount.get(k) ?? 0) + 1);
  }

  return (
    <AdminGuard>
      <Navigation />
      <main className="pt-32 pb-16 bg-black min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <h1
              className="text-3xl text-cream"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Reservations Dashboard
            </h1>
            <a
              href="/admin/orders"
              className="text-xs tracking-widest uppercase text-gold hover:text-gold-light"
            >
              → Orders
            </a>
          </div>

          {error && (
            <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {grouped.length === 0 ? (
            <div className="border border-gold/20 bg-charcoal p-6 text-cream/40 text-sm">
              No reservations yet. Submissions will appear here grouped by
              date.
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(({ date, list }) => (
                <div key={date} className="border border-gold/20 bg-charcoal">
                  <div className="px-4 py-3 border-b border-gold/20 flex items-baseline justify-between">
                    <h2
                      className="text-lg text-cream"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {formatDate(date)}{" "}
                      {date === today && (
                        <span className="text-[10px] tracking-widest uppercase text-gold ml-2">
                          Today
                        </span>
                      )}
                    </h2>
                    <span className="text-xs text-cream/50">
                      {list.length}{" "}
                      {list.length === 1 ? "reservation" : "reservations"}
                    </span>
                  </div>
                  <ul>
                    {list.map((r) => {
                      const conflict = (conflictCount.get(conflictKey(r)) ?? 0) > 1;
                      return (
                        <li
                          key={r.id}
                          className="px-4 py-4 border-b border-gold/10 last:border-b-0"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                            <div>
                              <span className="text-cream text-sm font-medium">
                                {r.time} · {r.name}
                              </span>
                              <span className="text-cream/50 text-xs ml-2">
                                {r.guestCount}{" "}
                                {r.guestCount === 1 ? "guest" : "guests"}
                              </span>
                              {r.occasion && (
                                <span className="text-copper text-xs ml-2">
                                  · {r.occasion}
                                </span>
                              )}
                            </div>
                            <StatusPill status={r.status} />
                          </div>
                          <div className="text-xs text-cream/60 mb-2">
                            {r.id} · {r.phone}
                          </div>
                          {r.notes && (
                            <p className="text-xs text-cream/70 italic mb-2">
                              {r.notes}
                            </p>
                          )}
                          {conflict && r.status !== "declined" && (
                            <p className="text-[11px] text-copper mb-2">
                              ⚠ Another reservation is on the books at the
                              same time. Confirm capacity.
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {ACTIONS.filter((a) => a !== r.status).map((a) => (
                              <button
                                key={a}
                                onClick={() => updateStatus(r.id, a)}
                                className={`px-3 py-1.5 text-[10px] tracking-widest uppercase border transition-colors ${
                                  a === "declined"
                                    ? "border-wine/40 text-wine hover:bg-wine/10"
                                    : "border-gold text-gold hover:bg-gold hover:text-black"
                                }`}
                              >
                                Mark {STATUS_LABELS[a]}
                              </button>
                            ))}
                            <a
                              href={`https://wa.me/${normalisePhone(r.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-gold/40 text-cream hover:border-gold transition-colors"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={`tel:${r.phone}`}
                              className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-gold/40 text-cream hover:border-gold transition-colors"
                            >
                              Call
                            </a>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-cream/30 mt-6 text-center">
            In-memory MVP — data resets when the server restarts. Refreshes
            every 15 seconds.
          </p>
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
}

function StatusPill({ status }: { status: ReservationStatus }) {
  const cls =
    status === "pending"
      ? "border-gold text-gold"
      : status === "declined"
      ? "border-wine/40 text-wine"
      : status === "accepted"
      ? "border-copper/40 text-copper"
      : "border-cream/30 text-cream/60";
  return (
    <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${cls}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalisePhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.startsWith("0") ? `27${digits.slice(1)}` : digits;
}
