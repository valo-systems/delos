import { NextResponse } from "next/server";
import { store, generateId } from "@/lib/store";
import type { Reservation } from "@/lib/types";

export const dynamic = "force-dynamic";

type CreateReservationBody = {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guestCount?: number;
  occasion?: string;
  notes?: string;
};

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: CreateReservationBody;
  try {
    body = (await req.json()) as CreateReservationBody;
  } catch {
    return bad("Invalid JSON body");
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const date = body.date?.trim();
  const time = body.time?.trim();
  const guestCount = Math.floor(Number(body.guestCount));

  if (!name) return bad("Name is required");
  if (!phone) return bad("Phone number is required");
  if (!date) return bad("Date is required");
  if (!time) return bad("Time is required");
  if (!Number.isFinite(guestCount) || guestCount <= 0 || guestCount > 50) {
    return bad("Guest count must be between 1 and 50");
  }

  // Reject obvious past dates (compare YYYY-MM-DD strings).
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) return bad("Reservation date must be today or later");

  const reservation: Reservation = {
    id: generateId("RES"),
    name,
    phone,
    date,
    time,
    guestCount,
    occasion: body.occasion?.trim() || undefined,
    notes: body.notes?.trim() || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  store.reservations.set(reservation.id, reservation);
  return NextResponse.json({ reservation }, { status: 201 });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  let list: Reservation[] = Array.from(store.reservations.values());
  if (date) {
    list = list.filter((r) => r.date === date);
  }
  list.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
  return NextResponse.json({ reservations: list });
}
