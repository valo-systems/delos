"use client";

import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminGuard from "@/components/AdminGuard";
import { siteConfig } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  received: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "out_for_delivery", "cancelled"],
  ready: ["completed", "cancelled"],
  out_for_delivery: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.get<{ orders: Order[] }>("/orders", true);
      setOrders(data.orders ?? []);
      setError(null);
    } catch {
      setError("Could not load orders.");
    }
  }

  useEffect(() => {
    // Defer the first load so setState doesn't fire synchronously inside the effect.
    const initial = setTimeout(load, 0);
    const interval = setInterval(load, 10000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    try {
      await api.patch(`/orders/${id}`, { status });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  const totals = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
    const value = todayOrders.reduce((s, o) => s + o.total, 0);
    const collection = todayOrders.filter(
      (o) => o.fulfilmentType === "collection"
    ).length;
    const delivery = todayOrders.filter(
      (o) => o.fulfilmentType === "delivery"
    ).length;
    const active = orders.filter(
      (o) => o.status !== "completed" && o.status !== "cancelled"
    ).length;
    return {
      count: todayOrders.length,
      value,
      collection,
      delivery,
      active,
    };
  }, [orders]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

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
              Orders Dashboard
            </h1>
            <a
              href="/admin/reservations"
              className="text-xs tracking-widest uppercase text-gold hover:text-gold-light"
            >
              → Reservations
            </a>
          </div>

          {/* Summary tiles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Tile label="Today" value={String(totals.count)} />
            <Tile label="Value" value={formatPrice(totals.value)} />
            <Tile label="Collection" value={String(totals.collection)} />
            <Tile label="Delivery" value={String(totals.delivery)} />
            <Tile label="Active now" value={String(totals.active)} highlight />
          </div>

          {error && (
            <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
            {/* Order list */}
            <div className="border border-gold/20 bg-charcoal">
              <div className="px-4 py-3 border-b border-gold/20 text-xs tracking-widest uppercase text-gold">
                Orders ({orders.length})
              </div>
              {orders.length === 0 ? (
                <div className="p-6 text-cream/40 text-sm">
                  No orders yet. Orders are kept in memory and reset on server
                  restart.
                </div>
              ) : (
                <ul>
                  {orders.map((o) => (
                    <li
                      key={o.id}
                      onClick={() => setSelectedId(o.id)}
                      className={`px-4 py-3 border-b border-gold/10 cursor-pointer hover:bg-gold/5 ${
                        selectedId === o.id ? "bg-gold/10" : ""
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-cream text-sm font-medium">
                          {o.id}
                        </span>
                        <StatusPill status={o.status} />
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-cream/60 text-xs">
                          {o.customerName} · {o.fulfilmentType}
                        </span>
                        <span className="text-gold text-xs">
                          {formatPrice(o.total)}
                        </span>
                      </div>
                      <div className="text-[11px] text-cream/30 mt-1">
                        {new Date(o.createdAt).toLocaleString("en-ZA", {
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
                <OrderDetail
                  order={selected}
                  onStatusChange={(s) => updateStatus(selected.id, s)}
                />
              ) : (
                <p className="text-cream/40 text-sm">
                  Select an order on the left to see details and update its
                  status.
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-cream/30 mt-6 text-center">
            In-memory MVP — data resets when the server restarts. Refreshes
            every 10 seconds.
          </p>
        </div>
      </main>
      <Footer />
    </AdminGuard>
  );
}

function Tile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border ${
        highlight ? "border-gold bg-gold/5" : "border-gold/20 bg-charcoal"
      } p-4`}
    >
      <p className="text-[10px] tracking-widest uppercase text-cream/50">
        {label}
      </p>
      <p className="text-2xl text-cream mt-1" style={{ fontFamily: "var(--font-serif)" }}>
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const cls =
    status === "received"
      ? "border-gold text-gold"
      : status === "cancelled"
      ? "border-wine/40 text-wine"
      : status === "completed"
      ? "border-cream/30 text-cream/50"
      : "border-copper/40 text-copper";
  return (
    <span
      className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${cls}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function OrderDetail({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (s: OrderStatus) => void;
}) {
  const whatsappLink = buildWhatsAppLink(order);
  const transitions = NEXT_STATUS[order.status];

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2
          className="text-xl text-cream"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {order.id}
        </h2>
        <StatusPill status={order.status} />
      </div>

      <div className="space-y-1 text-sm">
        <Row label="Customer" value={order.customerName} />
        <Row label="Phone" value={order.phone} />
        {order.email && <Row label="Email" value={order.email} />}
        <Row
          label="Fulfilment"
          value={
            order.fulfilmentType === "delivery" ? "Delivery" : "Collection"
          }
        />
        {order.deliveryAddress && (
          <Row label="Address" value={order.deliveryAddress} />
        )}
        <Row
          label="Placed"
          value={new Date(order.createdAt).toLocaleString("en-ZA", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        />
      </div>

      <div className="border-t border-gold/10 pt-4">
        <p className="text-xs tracking-widest uppercase text-gold mb-2">
          Items
        </p>
        <ul className="space-y-1.5 text-sm">
          {order.items.map((i) => (
            <li
              key={i.menuItemId}
              className="flex justify-between text-cream/80"
            >
              <span>
                {i.quantity} × {i.name}
              </span>
              <span className="text-gold">
                {formatPrice(i.price * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-sm mt-3 pt-3 border-t border-gold/10">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Service fee" value={formatPrice(order.serviceFee)} />
          {order.fulfilmentType === "delivery" && (
            <Row
              label="Delivery"
              value={
                order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)
              }
            />
          )}
          <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10 text-base">
            <span>Total</span>
            <span className="text-gold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {order.orderNotes && (
        <div className="border-t border-gold/10 pt-4">
          <p className="text-xs tracking-widest uppercase text-gold mb-2">
            Notes
          </p>
          <p className="text-cream/70 text-sm italic">{order.orderNotes}</p>
        </div>
      )}

      {transitions.length > 0 && (
        <div className="border-t border-gold/10 pt-4">
          <p className="text-xs tracking-widest uppercase text-gold mb-2">
            Update status
          </p>
          <div className="flex flex-wrap gap-2">
            {transitions.map((t) => (
              <button
                key={t}
                onClick={() => onStatusChange(t)}
                className={`px-3 py-2 text-[11px] tracking-widest uppercase border transition-colors ${
                  t === "cancelled"
                    ? "border-wine/40 text-wine hover:bg-wine/10"
                    : "border-gold text-gold hover:bg-gold hover:text-black"
                }`}
              >
                {STATUS_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gold/10 pt-4">
        <p className="text-xs tracking-widest uppercase text-gold mb-2">
          Contact customer
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-black transition-colors"
          >
            Open WhatsApp message
          </a>
          <a
            href={`tel:${order.phone}`}
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-gold/40 text-cream hover:border-gold transition-colors"
          >
            Call
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(buildMessage(order))}
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-gold/40 text-cream hover:border-gold transition-colors"
          >
            Copy message
          </button>
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

function buildMessage(order: Order): string {
  const lines = [
    `Hi ${order.customerName},`,
    `Thanks for ordering direct from ${siteConfig.shortName}.`,
    `Your order ${order.id} is confirmed and ${
      order.fulfilmentType === "delivery"
        ? "will be on the way soon"
        : "will be ready for collection"
    }.`,
    `Total: ${formatPrice(order.total)} (pay on ${
      order.fulfilmentType === "delivery" ? "delivery" : "collection"
    }).`,
  ];
  return lines.join("\n");
}

function buildWhatsAppLink(order: Order): string {
  const phone = order.phone.replace(/[^0-9]/g, "");
  // Best-effort SA numbers: convert leading 0 to 27.
  const intl = phone.startsWith("0") ? `27${phone.slice(1)}` : phone;
  return `https://wa.me/${intl}?text=${encodeURIComponent(
    buildMessage(order)
  )}`;
}
