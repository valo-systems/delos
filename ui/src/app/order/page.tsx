"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/lib/siteConfig";
import { menuItems, menuCategories } from "@/lib/menu";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import { Search, Flame, Star, ArrowRight, X, Check, MapPin } from "@/components/icons";
import { useCart, computeTotals } from "@/lib/cart";
import type { FulfilmentType } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "menu" | "fulfilment" | "address" | "details" | "review";

interface AddressData {
  street: string;
  complex: string;
  suburb: string;
  notes: string;
}

interface CustomerData {
  name: string;
  phone: string;
  email: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBURBS = [
  "Morningside",
  "Berea",
  "Glenwood",
  "Musgrave",
  "Umbilo",
  "Overport",
  "Greyville",
  "Stamford Hill",
  "Windermere",
  "Clare Estate",
  "Sherwood",
  "Sydenham",
  "Bellair",
  "Malvern",
  "Durban Central",
  "Other",
];

function formatAddress(a: AddressData): string {
  const parts = [a.street.trim()];
  if (a.complex.trim()) parts.push(a.complex.trim());
  if (a.suburb) parts.push(a.suburb);
  parts.push("Durban");
  return parts.join(", ");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderPage() {
  const cart = useCart();
  const router = useRouter();

  // Navigation
  const [step, setStep] = useState<Step>("menu");

  // Checkout state
  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>("collection");
  const [address, setAddress] = useState<AddressData>({
    street: "",
    complex: "",
    suburb: "",
    notes: "",
  });
  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Menu browse state
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  // ─── Computed ───────────────────────────────────────────────────────────────

  const filtered = useMemo(
    () =>
      menuItems.filter((item) => {
        const matchCat =
          activeCategory === "all" || item.category === activeCategory;
        const matchSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }),
    [activeCategory, search]
  );

  const totals = useMemo(
    () => computeTotals(cart.items, fulfilmentType),
    [cart.items, fulfilmentType]
  );

  const minOrder = siteConfig.directOrder.minOrder;
  const belowMinimum = totals.subtotal > 0 && totals.subtotal < minOrder;
  const totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);

  // Steps that appear in the progress indicator (address skipped for collection)
  const progressSteps: { key: Step; label: string }[] = [
    { key: "fulfilment", label: "Fulfilment" },
    ...(fulfilmentType === "delivery"
      ? [{ key: "address" as Step, label: "Address" }]
      : []),
    { key: "details", label: "Details" },
    { key: "review", label: "Review" },
  ];

  const currentStepIdx = progressSteps.findIndex((s) => s.key === step);

  // ─── Navigation helpers ──────────────────────────────────────────────────────

  function goTo(target: Step) {
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    if (step === "menu") return goTo("fulfilment");
    if (step === "fulfilment")
      return goTo(fulfilmentType === "delivery" ? "address" : "details");
    if (step === "address") return goTo("details");
    if (step === "details") return goTo("review");
  }

  function back() {
    if (step === "review") return goTo("details");
    if (step === "details")
      return goTo(fulfilmentType === "delivery" ? "address" : "fulfilment");
    if (step === "address") return goTo("fulfilment");
    if (step === "fulfilment") return goTo("menu");
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitError(null);
    if (cart.items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }
    if (belowMinimum) {
      setSubmitError(`Minimum order is ${formatPrice(minOrder * 100)}.`);
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.post<{ order: { id: string } }>("/orders", {
        customerName: customer.name,
        phone: customer.phone,
        email: customer.email || undefined,
        fulfilmentType,
        deliveryAddress:
          fulfilmentType === "delivery" ? formatAddress(address) : undefined,
        items: cart.items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
        orderNotes:
          [orderNotes, address.notes].filter(Boolean).join(" · ") || undefined,
      });
      cart.clear();
      router.push(`/order/${data.order.id}`);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not place order. Please try WhatsApp."
      );
      setSubmitting(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Navigation />
      <StickyActions />

      <main className="pb-16 lg:pb-0">
        {/* Page header */}
        <section className="pt-32 pb-12 bg-charcoal border-b border-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Delos Direct"
              title="Order Online"
              subtitle={siteConfig.directOrder.valueMessage}
            />
            <p className="text-center text-xs tracking-[0.3em] text-gold/70 uppercase max-w-3xl mx-auto mt-2">
              Direct service fee just {siteConfig.directOrder.serviceFeePercent}
              % · No marketplace markup
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            STEP: MENU
        ═══════════════════════════════════════════════════════ */}
        {step === "menu" && (
          <section className="section-padding bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              {/* ── Menu column ── */}
              <div>
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
                  <p className="text-center py-20 text-cream/40 text-lg">
                    No items found.
                  </p>
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
                              {formatPrice(item.price * 100)}
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

              {/* ── Desktop cart sidebar ── */}
              <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
                <CartPanel
                  cart={cart}
                  totals={totals}
                  belowMinimum={belowMinimum}
                  minOrder={minOrder}
                  onCheckout={() => goTo("fulfilment")}
                />
              </aside>
            </div>

            {/* Mobile floating cart bar (sits above StickyActions ~68px tall) */}
            {totalItems > 0 && (
              <div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 px-3">
                <button
                  onClick={() => setCartOpen(true)}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-gold text-black shadow-xl shadow-black/50"
                >
                  <span className="text-sm font-semibold">
                    {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold">
                    {formatPrice((totals.subtotal + totals.serviceFee) * 100)}
                    <ArrowRight size={16} />
                  </span>
                </button>
              </div>
            )}

            {/* Mobile cart drawer */}
            {cartOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setCartOpen(false)}
                />
                <div className="relative bg-charcoal border-t border-gold/30 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-5 border-b border-gold/10">
                    <h3
                      className="text-lg text-cream"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Your Cart
                    </h3>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-cream/50 hover:text-gold p-1"
                      aria-label="Close cart"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-5">
                    <CartPanel
                      cart={cart}
                      totals={totals}
                      belowMinimum={belowMinimum}
                      minOrder={minOrder}
                      mobile
                      onCheckout={() => {
                        setCartOpen(false);
                        goTo("fulfilment");
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            CHECKOUT STEPS (fulfilment → address → details → review)
        ═══════════════════════════════════════════════════════ */}
        {step !== "menu" && (
          <section className="section-padding bg-black">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
              {/* ── Progress indicator ── */}
              <div className="flex items-center justify-center mb-12">
                {progressSteps.map((s, i) => {
                  const done = i < currentStepIdx;
                  const active = s.key === step;
                  return (
                    <div key={s.key} className="flex items-center">
                      {i > 0 && (
                        <div
                          className={`w-8 sm:w-16 h-px transition-colors duration-300 ${
                            done ? "bg-gold" : "bg-gold/20"
                          }`}
                        />
                      )}
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                            done
                              ? "bg-gold border-gold text-black"
                              : active
                              ? "border-gold text-gold"
                              : "border-gold/20 text-cream/30"
                          }`}
                        >
                          {done ? <Check size={13} /> : i + 1}
                        </div>
                        <span
                          className={`text-[9px] tracking-[0.15em] uppercase hidden sm:block transition-colors ${
                            active
                              ? "text-gold"
                              : done
                              ? "text-gold/50"
                              : "text-cream/25"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ────────────────────────────────────────────────
                  STEP: Fulfilment
              ──────────────────────────────────────────────── */}
              {step === "fulfilment" && (
                <div>
                  <h2
                    className="text-2xl text-cream mb-2 text-center"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    How do you want your order?
                  </h2>
                  <p className="text-center text-cream/50 text-sm mb-8">
                    Choose how you&apos;ll receive your food
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {(
                      [
                        {
                          value: "collection" as FulfilmentType,
                          icon: "🛍️",
                          title: "Collection",
                          time: `Ready in ~${siteConfig.directOrder.collectionPrepMinutes} min`,
                          detail: `Pick up at Delos, ${siteConfig.address.suburb}`,
                          badge: "Free",
                          badgeClass: "text-green-400 border-green-400/40",
                        },
                        {
                          value: "delivery" as FulfilmentType,
                          icon: "🛵",
                          title: "Delivery",
                          time: `Arrives in ~${siteConfig.directOrder.deliveryPrepMinutes} min`,
                          detail: `R${siteConfig.directOrder.deliveryFee} · Free over R${siteConfig.directOrder.freeDeliveryThreshold}`,
                          badge: "Local areas",
                          badgeClass: "text-gold/80 border-gold/30",
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFulfilmentType(opt.value)}
                        className={`p-6 border-2 text-left transition-all ${
                          fulfilmentType === opt.value
                            ? "border-gold bg-gold/5"
                            : "border-gold/20 hover:border-gold/50"
                        }`}
                      >
                        <div className="text-3xl mb-3">{opt.icon}</div>
                        <div className="text-base text-cream font-semibold tracking-wide mb-1">
                          {opt.title}
                        </div>
                        <div className="text-sm text-gold mb-1">{opt.time}</div>
                        <div className="text-xs text-cream/50 mb-3">
                          {opt.detail}
                        </div>
                        <span
                          className={`text-[10px] tracking-widest uppercase border px-2 py-0.5 ${opt.badgeClass}`}
                        >
                          {opt.badge}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={back}
                      className="px-6 py-3 text-xs tracking-widest uppercase text-cream/50 border border-gold/20 hover:border-gold/50 hover:text-cream transition-colors"
                    >
                      ← Back to menu
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────
                  STEP: Delivery Address
              ──────────────────────────────────────────────── */}
              {step === "address" && (
                <div>
                  <h2
                    className="text-2xl text-cream mb-2 text-center"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Where should we deliver?
                  </h2>
                  <p className="text-center text-cream/50 text-sm mb-8">
                    Enter your delivery address
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Street address <span className="text-wine">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="street-address"
                        value={address.street}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, street: e.target.value }))
                        }
                        placeholder="e.g. 12 Windermere Road"
                        className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Complex / Building{" "}
                        <span className="text-cream/30">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={address.complex}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, complex: e.target.value }))
                        }
                        placeholder="e.g. Unit 3, Palm Heights"
                        className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Suburb <span className="text-wine">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={address.suburb}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, suburb: e.target.value }))
                          }
                          className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream px-4 py-3 text-sm outline-none transition-colors appearance-none pr-10"
                        >
                          <option value="" disabled>
                            Select suburb…
                          </option>
                          {SUBURBS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold/50">
                          ▾
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value="Durban"
                        disabled
                        className="w-full bg-charcoal/50 border border-gold/10 text-cream/40 px-4 py-3 text-sm outline-none cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Delivery instructions{" "}
                        <span className="text-cream/30">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={address.notes}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, notes: e.target.value }))
                        }
                        placeholder="Gate code, directions for the driver…"
                        className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-cream/40 mb-8 bg-charcoal/50 border border-gold/10 p-4">
                    <MapPin size={14} className="text-gold/60 shrink-0 mt-0.5" />
                    <span>{siteConfig.directOrder.deliveryNote}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={back}
                      className="px-6 py-3 text-xs tracking-widest uppercase text-cream/50 border border-gold/20 hover:border-gold/50 hover:text-cream transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      disabled={!address.street.trim() || !address.suburb}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────
                  STEP: Customer Details
              ──────────────────────────────────────────────── */}
              {step === "details" && (
                <div>
                  <h2
                    className="text-2xl text-cream mb-2 text-center"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Your contact details
                  </h2>
                  <p className="text-center text-cream/50 text-sm mb-8">
                    We&apos;ll confirm your order via WhatsApp
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Full name <span className="text-wine">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="name"
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer((c) => ({ ...c, name: e.target.value }))
                        }
                        placeholder="Your name"
                        className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Phone / WhatsApp <span className="text-wine">*</span>
                      </label>
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer((c) => ({ ...c, phone: e.target.value }))
                        }
                        placeholder="e.g. 082 000 0000"
                        className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                        Email{" "}
                        <span className="text-cream/30">(optional)</span>
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        value={customer.email}
                        onChange={(e) =>
                          setCustomer((c) => ({ ...c, email: e.target.value }))
                        }
                        placeholder="you@example.com"
                        className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={back}
                      className="px-6 py-3 text-xs tracking-widest uppercase text-cream/50 border border-gold/20 hover:border-gold/50 hover:text-cream transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      disabled={!customer.name.trim() || !customer.phone.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Review order <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────
                  STEP: Review & Confirm
              ──────────────────────────────────────────────── */}
              {step === "review" && (
                <div>
                  <h2
                    className="text-2xl text-cream mb-2 text-center"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Review your order
                  </h2>
                  <p className="text-center text-cream/50 text-sm mb-8">
                    Check everything before placing
                  </p>

                  {/* Order items + totals */}
                  <div className="border border-gold/20 bg-charcoal p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs uppercase tracking-widest text-gold">
                        Your order
                      </h3>
                      <button
                        type="button"
                        onClick={() => goTo("menu")}
                        className="text-[10px] uppercase tracking-widest text-cream/40 hover:text-gold transition-colors"
                      >
                        Edit
                      </button>
                    </div>
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
                            {formatPrice(i.price * i.quantity * 100)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gold/10 pt-4 space-y-1 text-sm">
                      <div className="flex justify-between text-cream/60">
                        <span>Subtotal</span>
                        <span>{formatPrice(totals.subtotal * 100)}</span>
                      </div>
                      <div className="flex justify-between text-cream/60">
                        <span>
                          Direct fee (
                          {siteConfig.directOrder.serviceFeePercent}%)
                        </span>
                        <span>{formatPrice(totals.serviceFee * 100)}</span>
                      </div>
                      {fulfilmentType === "delivery" && (
                        <div className="flex justify-between text-cream/60">
                          <span>Delivery</span>
                          <span>
                            {totals.deliveryFee === 0
                              ? "Free"
                              : formatPrice(totals.deliveryFee * 100)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10 text-base">
                        <span>Total</span>
                        <span className="text-gold">
                          {formatPrice(totals.total * 100)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fulfilment + Address */}
                  <div className="border border-gold/20 bg-charcoal p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold">
                        {fulfilmentType === "delivery" ? "Delivery" : "Collection"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => goTo("fulfilment")}
                        className="text-[10px] uppercase tracking-widest text-cream/40 hover:text-gold transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    {fulfilmentType === "delivery" ? (
                      <>
                        <p className="text-sm text-cream">
                          {formatAddress(address)}
                        </p>
                        {address.notes && (
                          <p className="text-xs text-gold/70 mt-1 italic">
                            {address.notes}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-cream/70">
                        {siteConfig.address.full}
                      </p>
                    )}
                    <p className="text-xs text-cream/40 mt-2">
                      Est.{" "}
                      {fulfilmentType === "delivery"
                        ? `${siteConfig.directOrder.deliveryPrepMinutes} min`
                        : `${siteConfig.directOrder.collectionPrepMinutes} min`}
                    </p>
                  </div>

                  {/* Contact details */}
                  <div className="border border-gold/20 bg-charcoal p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold">
                        Contact
                      </h3>
                      <button
                        type="button"
                        onClick={() => goTo("details")}
                        className="text-[10px] uppercase tracking-widest text-cream/40 hover:text-gold transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-cream">{customer.name}</p>
                    <p className="text-sm text-cream/60">{customer.phone}</p>
                    {customer.email && (
                      <p className="text-sm text-cream/60">{customer.email}</p>
                    )}
                  </div>

                  {/* Special instructions */}
                  <div className="mb-6">
                    <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                      Special instructions{" "}
                      <span className="text-cream/30">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Allergies, no chilli, extra pap…"
                      className="w-full bg-charcoal border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="bg-black/50 border border-gold/10 p-4 text-xs text-cream/50 mb-6">
                    <strong className="text-gold">How it works:</strong> Our
                    team confirms your order via WhatsApp. Pay on collection or
                    delivery. Cash or card accepted.
                  </div>

                  {submitError && (
                    <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3 mb-4">
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={back}
                      className="px-6 py-3 text-xs tracking-widest uppercase text-cream/50 border border-gold/20 hover:border-gold/50 hover:text-cream transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    >
                      {submitting
                        ? "Placing order…"
                        : `Place order · ${formatPrice(totals.total * 100)}`}
                    </button>
                  </div>

                  <a
                    href={siteConfig.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center text-xs tracking-widest uppercase text-cream/40 hover:text-gold transition-colors"
                  >
                    Or order on WhatsApp instead →
                  </a>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

// ─── CartPanel ────────────────────────────────────────────────────────────────

interface CartPanelProps {
  cart: ReturnType<typeof useCart>;
  totals: ReturnType<typeof computeTotals>;
  belowMinimum: boolean;
  minOrder: number;
  mobile?: boolean;
  onCheckout: () => void;
}

function CartPanel({
  cart,
  totals,
  belowMinimum,
  minOrder,
  mobile,
  onCheckout,
}: CartPanelProps) {
  return (
    <div className={mobile ? "" : "border border-gold/30 bg-charcoal p-6"}>
      <h3
        className="text-xl text-cream mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Your Cart
      </h3>

      {cart.items.length === 0 ? (
        <p className="text-cream/50 text-sm">
          No items yet. Browse and add what you fancy.
        </p>
      ) : (
        <>
          <ul className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {cart.items.map((i) => (
              <li
                key={i.menuItemId}
                className="border-b border-gold/10 pb-3 last:border-b-0"
              >
                <div className="flex justify-between gap-3 text-sm text-cream mb-2">
                  <span className="leading-snug">{i.name}</span>
                  <span className="text-gold whitespace-nowrap">
                    {formatPrice(i.price * i.quantity * 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gold/30">
                    <button
                      type="button"
                      onClick={() => cart.setQty(i.menuItemId, i.quantity - 1)}
                      className="px-3 py-1.5 text-gold hover:bg-gold/10 text-sm"
                      aria-label={`Decrease ${i.name}`}
                    >
                      −
                    </button>
                    <span className="px-3 text-cream text-sm">{i.quantity}</span>
                    <button
                      type="button"
                      onClick={() => cart.setQty(i.menuItemId, i.quantity + 1)}
                      className="px-3 py-1.5 text-gold hover:bg-gold/10 text-sm"
                      aria-label={`Increase ${i.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => cart.remove(i.menuItemId)}
                    className="text-[11px] uppercase tracking-wider text-cream/40 hover:text-wine transition-colors"
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
              <span>{formatPrice(totals.subtotal * 100)}</span>
            </div>
            <div className="flex justify-between text-cream/70">
              <span>
                Direct fee ({siteConfig.directOrder.serviceFeePercent}%)
              </span>
              <span>{formatPrice(totals.serviceFee * 100)}</span>
            </div>
            <div className="flex justify-between text-cream font-semibold pt-2 border-t border-gold/10">
              <span>Estimate</span>
              <span className="text-gold">
                {formatPrice((totals.subtotal + totals.serviceFee) * 100)}
              </span>
            </div>
          </div>

          {belowMinimum && (
            <p className="mt-3 text-xs text-wine">
              Minimum order is {formatPrice(minOrder * 100)}. Add{" "}
              {formatPrice((minOrder - totals.subtotal) * 100)} more.
            </p>
          )}

          <button
            type="button"
            onClick={onCheckout}
            disabled={belowMinimum || cart.items.length === 0}
            className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-widest uppercase bg-gold text-black hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Checkout <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => cart.clear()}
            className="mt-2 w-full text-xs tracking-wider uppercase text-cream/40 hover:text-cream transition-colors"
          >
            Clear cart
          </button>
        </>
      )}
    </div>
  );
}
