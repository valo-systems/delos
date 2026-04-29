import { NextResponse } from "next/server";
import { store, generateId } from "@/lib/store";
import { menuItems } from "@/lib/menu";
import { siteConfig } from "@/lib/siteConfig";
import type {
  CartItem,
  FulfilmentType,
  Order,
  OrderStatus,
} from "@/lib/types";

export const dynamic = "force-static";

type IncomingItem = {
  menuItemId: string;
  quantity: number;
};

type CreateOrderBody = {
  customerName?: string;
  phone?: string;
  email?: string;
  fulfilmentType?: FulfilmentType;
  deliveryAddress?: string;
  items?: IncomingItem[];
  orderNotes?: string;
};

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let body: CreateOrderBody;
  try {
    body = (await req.json()) as CreateOrderBody;
  } catch {
    return bad("Invalid JSON body");
  }

  const customerName = body.customerName?.trim();
  const phone = body.phone?.trim();
  const fulfilmentType = body.fulfilmentType;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!customerName) return bad("Customer name is required");
  if (!phone) return bad("Phone number is required");
  if (fulfilmentType !== "collection" && fulfilmentType !== "delivery") {
    return bad("Fulfilment type must be 'collection' or 'delivery'");
  }
  if (fulfilmentType === "delivery" && !body.deliveryAddress?.trim()) {
    return bad("Delivery address is required for delivery orders");
  }
  if (items.length === 0) return bad("Cart is empty");

  // Re-validate items against the canonical menu — never trust client prices.
  const validated: CartItem[] = [];
  for (const incoming of items) {
    const menuItem = menuItems.find((m) => m.id === incoming.menuItemId);
    if (!menuItem) return bad(`Unknown menu item: ${incoming.menuItemId}`);
    const qty = Math.floor(Number(incoming.quantity));
    if (!Number.isFinite(qty) || qty <= 0) {
      return bad(`Invalid quantity for ${menuItem.name}`);
    }
    if (qty > 50) return bad(`Quantity too high for ${menuItem.name}`);
    validated.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
    });
  }

  const subtotal = validated.reduce((s, i) => s + i.price * i.quantity, 0);
  if (subtotal < siteConfig.directOrder.minOrder) {
    return bad(
      `Minimum order is R${siteConfig.directOrder.minOrder}. Current subtotal R${subtotal}.`
    );
  }

  const serviceFee = Math.round(
    subtotal * (siteConfig.directOrder.serviceFeePercent / 100)
  );
  let deliveryFee = 0;
  if (fulfilmentType === "delivery") {
    deliveryFee =
      subtotal >= siteConfig.directOrder.freeDeliveryThreshold
        ? 0
        : siteConfig.directOrder.deliveryFee;
  }
  const total = subtotal + serviceFee + deliveryFee;

  const now = new Date().toISOString();
  const order: Order = {
    id: generateId("ORD"),
    customerName,
    phone,
    email: body.email?.trim() || undefined,
    fulfilmentType,
    deliveryAddress:
      fulfilmentType === "delivery"
        ? body.deliveryAddress?.trim()
        : undefined,
    items: validated,
    orderNotes: body.orderNotes?.trim() || undefined,
    status: "received",
    subtotal,
    serviceFee,
    deliveryFee,
    total,
    createdAt: now,
    updatedAt: now,
  };

  store.orders.set(order.id, order);
  return NextResponse.json({ order }, { status: 201 });
}

export async function GET() {
  // Newest-first list for the admin dashboard.
  const orders: Order[] = Array.from(store.orders.values()).sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
  return NextResponse.json({ orders });
}

export const ALLOWED_STATUSES: OrderStatus[] = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];
