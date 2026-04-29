import type { Order, Reservation } from "./types";

// Module-level singleton persists across requests in the same process.
// Attaching to globalThis survives Next.js hot-reloads in development.
declare global {
  var __delosStore:
    | {
        orders: Map<string, Order>;
        reservations: Map<string, Reservation>;
      }
    | undefined;
}

if (!globalThis.__delosStore) {
  globalThis.__delosStore = {
    orders: new Map<string, Order>(),
    reservations: new Map<string, Reservation>(),
  };
}

export const store = globalThis.__delosStore;

export function generateId(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${id}`;
}
