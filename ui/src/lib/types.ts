export type OrderStatus =
  | "received"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type FulfilmentType = "collection" | "delivery";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  fulfilmentType: FulfilmentType;
  deliveryAddress?: string;
  items: CartItem[];
  orderNotes?: string;
  status: OrderStatus;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = "pending" | "accepted" | "declined" | "contacted";

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  occasion?: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}
