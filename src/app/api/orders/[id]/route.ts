import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES: OrderStatus[] = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const order = store.orders.get(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const order = store.orders.get(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  let body: { status?: OrderStatus };
  try {
    body = (await req.json()) as { status?: OrderStatus };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  order.status = body.status;
  order.updatedAt = new Date().toISOString();
  store.orders.set(order.id, order);

  return NextResponse.json({ order });
}
