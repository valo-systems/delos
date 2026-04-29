import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { ReservationStatus } from "@/lib/types";

export const dynamic = "force-static";
export function generateStaticParams() { return []; }

const ALLOWED: ReservationStatus[] = [
  "pending",
  "accepted",
  "declined",
  "contacted",
];

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reservation = store.reservations.get(id);
  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ reservation });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reservation = store.reservations.get(id);
  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  let body: { status?: ReservationStatus };
  try {
    body = (await req.json()) as { status?: ReservationStatus };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !ALLOWED.includes(body.status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${ALLOWED.join(", ")}` },
      { status: 400 }
    );
  }

  reservation.status = body.status;
  store.reservations.set(reservation.id, reservation);
  return NextResponse.json({ reservation });
}
