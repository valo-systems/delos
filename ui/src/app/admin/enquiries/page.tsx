"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminGuard from "@/components/AdminGuard";
import { api } from "@/lib/api";

type EnquiryStatus = "new" | "contacted" | "quoted" | "booked" | "declined";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  guestCount: number;
  eventType: string;
  packageName?: string;
  details?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  booked: "Booked",
  declined: "Declined",
};

const ALL_STATUSES: EnquiryStatus[] = ["new", "contacted", "quoted", "booked", "declined"];

function statusClass(status: EnquiryStatus): string {
  switch (status) {
    case "new": return "border-gold text-gold";
    case "contacted": return "border-blue-400 text-blue-400";
    case "quoted": return "border-purple-400 text-purple-400";
    case "booked": return "border-green-400 text-green-400";
    case "declined": return "border-wine/40 text-wine";
  }
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  async function load() {
    try {
      const data = await api.get<{ enquiries: Enquiry[] }>("/enquiries", true);
      setEnquiries(data.enquiries ?? []);
      setError(null);
    } catch {
      setError("Could not load enquiries.");
    }
  }

  useEffect(() => {
    const initial = setTimeout(load, 0);
    const interval = setInterval(load, 30000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) setAdminNotes(selected.adminNotes ?? "");
  }, [selected]);

  async function updateStatus(id: string, status: EnquiryStatus) {
    try {
      await api.patch(`/enquiries/${id}`, { status });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function saveNotes(id: string) {
    setSavingNotes(true);
    try {
      await api.patch(`/enquiries/${id}`, { adminNotes });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save notes.");
    } finally {
      setSavingNotes(false);
    }
  }

  function normalisePhone(phone: string): string {
    const digits = phone.replace(/[^0-9]/g, "");
    return digits.startsWith("0") ? `27${digits.slice(1)}` : digits;
  }

  return (
    <AdminGuard>
      <Navigation />
      <main className="pt-32 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <h1
              className="text-3xl text-cream"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Enquiries Dashboard
            </h1>
            <div className="flex gap-4">
              <a
                href="/admin/orders"
                className="text-xs tracking-widest uppercase text-gold hover:text-gold-light"
              >
                → Orders
              </a>
              <a
                href="/admin/reservations"
                className="text-xs tracking-widest uppercase text-gold hover:text-gold-light"
              >
                → Reservations
              </a>
            </div>
          </div>

          {error && (
            <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
            {/* Enquiry list */}
            <div className="border border-gold/20 bg-charcoal">
              <div className="px-4 py-3 border-b border-gold/20 text-xs tracking-widest uppercase text-gold">
                Enquiries ({enquiries.length})
              </div>
              {enquiries.length === 0 ? (
                <div className="p-6 text-cream/40 text-sm">
                  No enquiries yet. Private function enquiries will appear here.
                </div>
              ) : (
                <ul>
                  {enquiries.map((e) => (
                    <li
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={`px-4 py-3 border-b border-gold/10 cursor-pointer hover:bg-gold/5 ${
                        selectedId === e.id ? "bg-gold/10" : ""
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-cream text-sm font-medium">{e.name}</span>
                        <StatusPill status={e.status} />
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-cream/60 text-xs">
                          {e.eventType} · {e.guestCount} guests
                        </span>
                        <span className="text-gold/70 text-xs">{e.date}</span>
                      </div>
                      <div className="text-[11px] text-cream/30 mt-1">
                        {new Date(e.createdAt).toLocaleString("en-ZA", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Detail panel */}
            <div className="border border-gold/20 bg-charcoal p-6 lg:sticky lg:top-28 lg:self-start">
              {selected ? (
                <EnquiryDetail
                  enquiry={selected}
                  adminNotes={adminNotes}
                  setAdminNotes={setAdminNotes}
                  savingNotes={savingNotes}
                  onStatusChange={(s) => updateStatus(selected.id, s)}
                  onSaveNotes={() => saveNotes(selected.id)}
                  normalisePhone={normalisePhone}
                />
              ) : (
                <p className="text-cream/40 text-sm">
                  Select an enquiry on the left to see details.
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-cream/30 mt-6 text-center">
            Refreshes every 30 seconds.
          </p>
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
}

function StatusPill({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${statusClass(status)}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function EnquiryDetail({
  enquiry,
  adminNotes,
  setAdminNotes,
  savingNotes,
  onStatusChange,
  onSaveNotes,
  normalisePhone,
}: {
  enquiry: Enquiry;
  adminNotes: string;
  setAdminNotes: (v: string) => void;
  savingNotes: boolean;
  onStatusChange: (s: EnquiryStatus) => void;
  onSaveNotes: () => void;
  normalisePhone: (p: string) => string;
}) {
  const otherStatuses = ALL_STATUSES.filter((s) => s !== enquiry.status);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-xl text-cream" style={{ fontFamily: "var(--font-serif)" }}>
          {enquiry.name}
        </h2>
        <StatusPill status={enquiry.status} />
      </div>

      <div className="space-y-1 text-sm">
        <Row label="Phone" value={enquiry.phone} />
        {enquiry.email && <Row label="Email" value={enquiry.email} />}
        <Row label="Event date" value={enquiry.date} />
        <Row label="Guests" value={String(enquiry.guestCount)} />
        <Row label="Event type" value={enquiry.eventType} />
        {enquiry.packageName && <Row label="Package" value={enquiry.packageName} />}
        <Row
          label="Received"
          value={new Date(enquiry.createdAt).toLocaleString("en-ZA", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        />
      </div>

      {enquiry.details && (
        <div className="border-t border-gold/10 pt-4">
          <p className="text-xs tracking-widest uppercase text-gold mb-2">Details</p>
          <p className="text-cream/70 text-sm italic">{enquiry.details}</p>
        </div>
      )}

      {/* Status buttons */}
      <div className="border-t border-gold/10 pt-4">
        <p className="text-xs tracking-widest uppercase text-gold mb-2">Update status</p>
        <div className="flex flex-wrap gap-2">
          {otherStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-2 text-[11px] tracking-widest uppercase border transition-colors ${
                s === "declined"
                  ? "border-wine/40 text-wine hover:bg-wine/10"
                  : "border-gold text-gold hover:bg-gold hover:text-black"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Admin notes */}
      <div className="border-t border-gold/10 pt-4">
        <p className="text-xs tracking-widest uppercase text-gold mb-2">Admin notes</p>
        <textarea
          rows={4}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Internal notes visible only to admin..."
          className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors resize-none"
        />
        <button
          onClick={onSaveNotes}
          disabled={savingNotes}
          className="mt-2 px-4 py-2 text-[11px] tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-black transition-colors disabled:opacity-50"
        >
          {savingNotes ? "Saving…" : "Save notes"}
        </button>
      </div>

      {/* Contact buttons */}
      <div className="border-t border-gold/10 pt-4">
        <p className="text-xs tracking-widest uppercase text-gold mb-2">Contact</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${normalisePhone(enquiry.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-black transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${enquiry.phone}`}
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-gold/40 text-cream hover:border-gold transition-colors"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-cream/50">{label}</span>
      <span className="text-cream text-right">{value}</span>
    </div>
  );
}
