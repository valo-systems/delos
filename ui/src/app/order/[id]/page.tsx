"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import { siteConfig } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Order received",
  accepted: "Order confirmed",
  preparing: "Being prepared",
  ready: "Ready for collection",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  received: "text-gold",
  accepted: "text-green-400",
  preparing: "text-blue-400",
  ready: "text-gold",
  out_for_delivery: "text-blue-400",
  completed: "text-green-400",
  cancelled: "text-wine",
};

const TERMINAL: OrderStatus[] = ["completed", "cancelled"];

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<{ order: Order }>(`/orders/${id}`);
        if (!cancelled) setOrder(data.order);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Order not found.");
      }
    }

    load();
    const interval = setInterval(() => {
      if (order && TERMINAL.includes(order.status as OrderStatus)) return;
      load();
    }, 10000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [id]);

  return (
    <>
      <Navigation />
      <StickyActions />
      <main className="pb-16 lg:pb-0">
        <section className="pt-32 pb-20 bg-black min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <div className="text-center py-20">
                <p className="text-wine text-lg">{error}</p>
              </div>
            ) : !order ? (
              <div className="text-center py-20">
                <p className="text-cream/50">Loading your order…</p>
              </div>
            ) : (
              <>
                {/* Order ID + Status */}
                <div className="text-center mb-10">
                  <p className="text-xs tracking-[0.3em] text-gold/60 uppercase mb-2">Order</p>
                  <h1 className="text-3xl font-bold text-cream mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    {order.id}
                  </h1>
                  <span className={`text-xl font-semibold ${STATUS_COLOR[order.status as OrderStatus] ?? "text-cream"}`}>
                    {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                  </span>
                  {!TERMINAL.includes(order.status as OrderStatus) && (
                    <p className="text-cream/40 text-xs mt-2">Refreshes automatically every 10 seconds</p>
                  )}
                </div>

                {/* Items */}
                <div className="border border-gold/20 bg-charcoal p-6 mb-6">
                  <h2 className="text-cream text-lg mb-4" style={{ fontFamily: "var(--font-serif)" }}>Your order</h2>
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <li key={item.menuItemId} className="flex justify-between text-sm text-cream/80">
                        <span>{item.quantity} × {item.name}</span>
                        <span className="text-gold">{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gold/20 pt-4 space-y-1 text-sm">
                    <div className="flex justify-between text-cream/60">
                      <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-cream/60">
                      <span>Service fee</span><span>{formatPrice(order.serviceFee)}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-cream/60">
                        <span>Delivery</span><span>{formatPrice(order.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10">
                      <span>Total</span><span className="text-gold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-cream/40">
                    <span className="uppercase tracking-wider">{order.fulfilmentType}</span>
                    {order.deliveryAddress && <span> · {order.deliveryAddress}</span>}
                  </div>
                </div>

                {/* Contact */}
                <div className="text-center space-y-3">
                  <p className="text-cream/50 text-sm">Questions about your order?</p>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I have a question about order ${order.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 border border-gold text-gold text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-colors"
                  >
                    WhatsApp us
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
