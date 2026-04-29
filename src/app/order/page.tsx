"use client";

import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { menuItems, menuCategories } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";
import { Search, Flame, Star } from "@/components/icons";
import { useCart, computeTotals } from "@/lib/cart";
import type { FulfilmentType } from "@/lib/types";

export default function OrderPage() {
  const cart = useCart();

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"menu" | "checkout">("menu");

  // Checkout form state
  const [fulfilmentType, setFulfilmentType] =
    useState<FulfilmentType>("collection");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filtered = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totals = useMemo(
    () => computeTotals(cart.items, fulfilmentType),
    [cart.items, fulfilmentType]
  );

  const minOrder = siteConfig.directOrder.minOrder;
  const belowMinimum = totals.subtotal > 0 && totals.subtotal < minOrder;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (cart.items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }
    if (belowMinimum) {
      setSubmitError(`Minimum order is ${formatPrice(minOrder)}.`);
      return;
    }

    const lines: string[] = [];
    lines.push("*New Order — Delos Lounge & Dining*");
    lines.push("");
    lines.push(`*Name:* ${customerName}`);
    lines.push(`*Phone:* ${phone}`);
    if (email) lines.push(`*Email:* ${email}`);
    lines.push(`*Fulfilment:* ${fulfilmentType === "delivery" ? "Delivery" : "Collection"}`);
    if (fulfilmentType === "delivery" && deliveryAddress) {
      lines.push(`*Delivery address:* ${deliveryAddress}`);
    }
    lines.push("");
    lines.push("*Items:*");
    cart.items.forEach((i) => {
      lines.push(`  ${i.quantity}× ${i.name} — ${formatPrice(i.price * i.quantity)}`);
    });
    lines.push("");
    lines.push(`*Subtotal:* ${formatPrice(totals.subtotal)}`);
    lines.push(`*Service fee (${siteConfig.directOrder.serviceFeePercent}%):* ${formatPrice(totals.serviceFee)}`);
    if (fulfilmentType === "delivery") {
      lines.push(`*Delivery fee:* ${totals.deliveryFee === 0 ? "Free" : formatPrice(totals.deliveryFee)}`);
    }
    lines.push(`*Total:* ${formatPrice(totals.total)}`);
    if (orderNotes) {
      lines.push("");
      lines.push(`*Notes:* ${orderNotes}`);
    }

    const message = encodeURIComponent(lines.join("\n"));
    const whatsappNumber = siteConfig.contact.whatsapp.replace(/\D/g, "");
    cart.clear();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  }

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        {/* Header */}
        <section className="pt-32 pb-12 bg-charcoal border-b border-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Delos Direct"
              title="Order Online"
              subtitle={siteConfig.directOrder.valueMessage}
            />
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs tracking-[0.3em] text-gold/70 uppercase">
                {`Direct service fee just ${siteConfig.directOrder.serviceFeePercent}% · No marketplace markup`}
              </p>
            </div>
          </div>
        </section>

        {view === "menu" ? (
          <section className="section-padding bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              {/* Menu column */}
              <div>
                {/* Search */}
                <div className="max-w-md mx-auto lg:mx-0 relative mb-6">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50"
                  />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 pl-10 pr-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {menuCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
                        activeCategory === cat.id
                          ? "bg-gold text-black border-gold"
                          : "border-gold/30 text-cream/60 hover:border-gold/60 hover:text-cream"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-cream/40 text-lg">No items found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((item) => {
                      const inCart = cart.items.find(
                        (c) => c.menuItemId === item.id
                      );
                      return (
                        <div
                          key={item.id}
                          className="p-5 border border-gold/20 hover:border-gold/40 bg-charcoal flex flex-col"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3
                              className="text-base text-cream leading-snug"
                              style={{ fontFamily: "var(--font-serif)" }}
                            >
                              {item.name}
                            </h3>
                            <span className="text-gold font-semibold text-sm whitespace-nowrap">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <p className="text-xs text-cream/50 leading-relaxed mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap mb-4">
                            {item.servingInfo && (
                              <span className="text-[10px] text-cream/40 border border-cream/20 px-2 py-0.5">
                                {item.servingInfo}
                              </span>
                            )}
                            {item.tags.includes("signature") && (
                              <span className="flex items-center gap-1 text-[10px] tracking-wider text-gold border border-gold/30 px-2 py-0.5 uppercase">
                                <Star size={10} /> Signature
                              </span>
                            )}
                            {item.tags.includes("bestseller") && (
                              <span className="text-[10px] tracking-wider text-copper border border-copper/30 px-2 py-0.5 uppercase">
                                Bestseller
                              </span>
                            )}
                            {item.tags.includes("spicy") && (
                              <span className="flex items-center gap-1 text-[10px] text-wine border border-wine/30 px-2 py-0.5 uppercase">
                                <Flame size={10} /> Spicy
                              </span>
                            )}
                          </div>

                          <div className="mt-auto">
                            {inCart ? (
                              <div className="flex items-center justify-between border border-gold/40">
                                <button
                                  type="button"
                                  onClick={() =>
                                    cart.setQty(item.id, inCart.quantity - 1)
                                  }
                                  className="px-3 py-2 text-gold hover:bg-gold/10"
                                  aria-label={`Decrease ${item.name}`}
                                >
                                  −
                                </button>
                                <span className="text-cream text-sm">
                                  {inCart.quantity} in cart
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    cart.setQty(item.id, inCart.quantity + 1)
                                  }
                                  className="px-3 py-2 text-gold hover:bg-gold/10"
                                  aria-label={`Increase ${item.name}`}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  cart.add({
                                    menuItemId: item.id,
                                    name: item.name,
                                    price: item.price,
                                    quantity: 1,
                                  })
                                }
                                className="w-full px-4 py-2 text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-black transition-colors"
                              >
                                Add to cart
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cart column */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="border border-gold/30 bg-charcoal p-6">
                  <h3
                    className="text-xl text-cream mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Your Cart
                  </h3>
                  {cart.items.length === 0 ? (
                    <p className="text-cream/50 text-sm">
                      No items yet. Browse the menu and add what you fancy.
                    </p>
                  ) : (
                    <>
                      <ul className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
                        {cart.items.map((i) => (
                          <li
                            key={i.menuItemId}
                            className="border-b border-gold/10 pb-3 last:border-b-0"
                          >
                            <div className="flex justify-between gap-3 text-sm text-cream mb-2">
                              <span className="leading-snug">{i.name}</span>
                              <span className="text-gold whitespace-nowrap">
                                {formatPrice(i.price * i.quantity)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gold/30">
                                <button
                                  type="button"
                                  onClick={() =>
                                    cart.setQty(i.menuItemId, i.quantity - 1)
                                  }
                                  className="px-3 py-1 text-gold hover:bg-gold/10 text-sm"
                                  aria-label={`Decrease ${i.name}`}
                                >
                                  −
                                </button>
                                <span className="px-3 text-cream text-sm">
                                  {i.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    cart.setQty(i.menuItemId, i.quantity + 1)
                                  }
                                  className="px-3 py-1 text-gold hover:bg-gold/10 text-sm"
                                  aria-label={`Increase ${i.name}`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => cart.remove(i.menuItemId)}
                                className="text-[11px] uppercase tracking-wider text-cream/40 hover:text-wine"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-1 text-sm border-t border-gold/20 pt-4">
                        <div className="flex justify-between text-cream/70">
                          <span>Subtotal</span>
                          <span>{formatPrice(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-cream/70">
                          <span>
                            Direct fee ({siteConfig.directOrder.serviceFeePercent}%)
                          </span>
                          <span>{formatPrice(totals.serviceFee)}</span>
                        </div>
                        <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10">
                          <span>Estimate</span>
                          <span className="text-gold">
                            {formatPrice(totals.subtotal + totals.serviceFee)}
                          </span>
                        </div>
                      </div>

                      {belowMinimum && (
                        <p className="mt-3 text-xs text-wine">
                          Minimum order is {formatPrice(minOrder)}. Add{" "}
                          {formatPrice(minOrder - totals.subtotal)} more to
                          checkout.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => setView("checkout")}
                        disabled={belowMinimum || cart.items.length === 0}
                        className="mt-5 w-full px-6 py-3 text-sm tracking-widest uppercase bg-gold text-black hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Checkout
                      </button>
                      <button
                        type="button"
                        onClick={() => cart.clear()}
                        className="mt-2 w-full text-xs tracking-wider uppercase text-cream/40 hover:text-cream"
                      >
                        Clear cart
                      </button>
                    </>
                  )}
                </div>
              </aside>
            </div>
          </section>
        ) : (
          <section className="section-padding bg-black">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setView("menu")}
                className="text-xs tracking-widest uppercase text-gold/70 hover:text-gold mb-6"
              >
                ← Back to menu
              </button>

              <div className="border border-gold/30 bg-charcoal p-8 mb-8">
                <h2
                  className="text-2xl text-cream mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Order Summary
                </h2>
                <ul className="space-y-2 mb-4">
                  {cart.items.map((i) => (
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
                  <div className="flex justify-between text-cream/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>
                      Direct service fee ({siteConfig.directOrder.serviceFeePercent}%)
                    </span>
                    <span>{formatPrice(totals.serviceFee)}</span>
                  </div>
                  {fulfilmentType === "delivery" && (
                    <div className="flex justify-between text-cream/70">
                      <span>Delivery fee</span>
                      <span>
                        {totals.deliveryFee === 0
                          ? "Free"
                          : formatPrice(totals.deliveryFee)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10 text-base">
                    <span>Total</span>
                    <span className="text-gold">
                      {formatPrice(totals.total)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-cream/40 mt-4">
                  Estimated prep time:{" "}
                  {fulfilmentType === "delivery"
                    ? `${siteConfig.directOrder.deliveryPrepMinutes} minutes`
                    : `${siteConfig.directOrder.collectionPrepMinutes} minutes`}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="border border-gold/30 bg-charcoal p-8 space-y-6"
              >
                {/* Fulfilment type */}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-3">
                    Fulfilment
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "collection", label: "Collection", note: "No delivery fee" },
                        { value: "delivery", label: "Delivery", note: `Local areas · R${siteConfig.directOrder.deliveryFee}` },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFulfilmentType(opt.value)}
                        className={`p-4 border text-left transition-colors ${
                          fulfilmentType === opt.value
                            ? "border-gold bg-gold/10"
                            : "border-gold/20 hover:border-gold/50"
                        }`}
                      >
                        <span className="block text-sm uppercase tracking-wider text-cream">
                          {opt.label}
                        </span>
                        <span className="block text-[11px] text-cream/50 mt-1">
                          {opt.note}
                        </span>
                      </button>
                    ))}
                  </div>
                  {fulfilmentType === "delivery" && (
                    <p className="text-[11px] text-cream/50 mt-2 italic">
                      {siteConfig.directOrder.deliveryNote}
                    </p>
                  )}
                </div>

                {/* Customer details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Full name"
                    required
                    value={customerName}
                    onChange={setCustomerName}
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
                    label="Email (optional)"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                  />
                  {fulfilmentType === "delivery" && (
                    <Field
                      label="Delivery address"
                      required
                      value={deliveryAddress}
                      onChange={setDeliveryAddress}
                      placeholder="Street, complex, suburb"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                    Special instructions (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. no chilli, extra pap, allergies"
                    className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="bg-black/50 border border-gold/10 p-4 text-xs text-cream/60 leading-relaxed">
                  <strong className="text-gold">How it works:</strong> Clicking
                  &ldquo;Place order&rdquo; will open WhatsApp with your full
                  order pre-filled. Send the message and our team will confirm
                  and advise on payment.
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
                  >
                    {`Place order via WhatsApp · ${formatPrice(totals.total)}`}
                  </Button>
                  <Button
                    href={siteConfig.contact.whatsappUrl}
                    external
                    variant="outline"
                    size="lg"
                  >
                    Order on WhatsApp instead
                  </Button>
                </div>
              </form>
            </div>
          </section>
        )}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
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
        className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
      />
    </div>
  );
}
