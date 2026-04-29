"use client";

import { use, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Order received",
  accepted: "Accepted by kitchen",
  preparing: "Preparing your food",
  ready: "Ready for collection",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  received: "We've received your order. Our team will confirm shortly via WhatsApp.",
  accepted: "Our kitchen has accepted your order and will start prep soon.",
  preparing: "Your food is being prepared.",
  ready: "Your order is ready. Please come and collect.",
  out_for_delivery: "Your order is on the way.",
  completed: "Order complete. Thank you for ordering direct.",
  cancelled: "This order was cancelled. Contact us if this is a mistake.",
};

const PROGRESS_STEPS: OrderStatus[] = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "completed",
];

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            setError(data?.error ?? "Could not load order.");
            setLoading(false);
          }
          return;
        }
        const data = (await res.json()) as { order: Order };
        if (!cancelled) {
          setOrder(data.order);
          setError(null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Network error. We'll retry shortly.");
          setLoading(false);
        }
      }
    }
    load();
    const interval = setInterval(load, 15000); // poll every 15s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-16 bg-charcoal border-b border-gold/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
              Order Reference
            </p>
            <h1
              className="text-4xl md:text-5xl text-cream mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {id}
            </h1>
            {order && (
              <p className="text-cream/60 text-sm">
                {STATUS_DESCRIPTIONS[order.status]}
              </p>
            )}
          </div>
        </section>

        <section className="section-padding bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {loading && (
              <div className="border border-gold/20 bg-charcoal p-6 text-cream/60 text-sm">
                Loading order…
              </div>
            )}

            {error && !order && (
              <div className="border border-wine/40 bg-wine/10 p-6">
                <p className="text-wine text-sm mb-4">{error}</p>
                <Button href="/order" variant="outline" size="md">
                  Back to ordering
                </Button>
              </div>
            )}

            {order && (
              <>
                {/* Progress strip */}
                <div className="border border-gold/20 bg-charcoal p-6">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {PROGRESS_STEPS.map((step, idx) => {
                      const currentIdx = PROGRESS_STEPS.indexOf(order.status);
                      const reached = currentIdx >= idx && currentIdx >= 0;
                      const cancelled = order.status === "cancelled";
                      return (
                        <div
                          key={step}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              cancelled
                                ? "bg-wine/60"
                                : reached
                                ? "bg-gold"
                                : "bg-cream/20"
                            }`}
                          />
                          <span
                            className={`text-[10px] tracking-wider uppercase text-center ${
                              reached ? "text-cream" : "text-cream/40"
                            }`}
                          >
                            {STATUS_LABELS[step].split(" ").slice(0, 2).join(" ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center">
                    <p className="text-gold text-sm tracking-wider uppercase">
                      {STATUS_LABELS[order.status]}
                    </p>
                    {order.status === "out_for_delivery" && (
                      <p className="text-cream/60 text-xs mt-1">
                        Driver on the way to {order.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order details */}
                <div className="border border-gold/20 bg-charcoal p-6">
                  <h2
                    className="text-xl text-cream mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Order Details
                  </h2>
                  <ul className="space-y-2 mb-4">
                    {order.items.map((i) => (
                      <li
                        key={i.menuItemId}
                        className="flex justify-between text-sm text-cream/80"
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
                  <div className="space-y-1 text-sm border-t border-gold/20 pt-4">
                    <Row label="Subtotal" value={formatPrice(order.subtotal)} />
                    <Row
                      label={`Direct service fee`}
                      value={formatPrice(order.serviceFee)}
                    />
                    {order.fulfilmentType === "delivery" && (
                      <Row
                        label="Delivery fee"
                        value={
                          order.deliveryFee === 0
                            ? "Free"
                            : formatPrice(order.deliveryFee)
                        }
                      />
                    )}
                    <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10 text-base">
                      <span>Total</span>
                      <span className="text-gold">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                  {order.orderNotes && (
                    <div className="mt-4 pt-4 border-t border-gold/10">
                      <p className="text-xs tracking-widest uppercase text-gold mb-2">
                        Notes
                      </p>
                      <p className="text-cream/70 text-sm italic">
                        {order.orderNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Customer info */}
                <div className="border border-gold/20 bg-charcoal p-6">
                  <h2
                    className="text-xl text-cream mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Your Details
                  </h2>
                  <div className="space-y-2 text-sm">
                    <Row label="Name" value={order.customerName} />
                    <Row label="Phone" value={order.phone} />
                    {order.email && <Row label="Email" value={order.email} />}
                    <Row
                      label="Fulfilment"
                      value={
                        order.fulfilmentType === "delivery"
                          ? "Delivery"
                          : "Collection"
                      }
                    />
                    {order.deliveryAddress && (
                      <Row label="Address" value={order.deliveryAddress} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    href={siteConfig.contact.whatsappUrl}
                    external
                    variant="primary"
                    size="lg"
                  >
                    Contact us on WhatsApp
                  </Button>
                  <Button href="/order" variant="outline" size="lg">
                    Place another order
                  </Button>
                </div>

                <p className="text-xs text-cream/40 text-center">
                  This page refreshes automatically every 15 seconds.
                </p>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-cream/70">
      <span>{label}</span>
      <span className="text-cream">{value}</span>
    </div>
  );
}
