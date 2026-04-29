"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem } from "./types";
import { siteConfig } from "./siteConfig";

const STORAGE_KEY = "delos-cart-v1";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; menuItemId: string }
  | { type: "setQty"; menuItemId: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

const initialState: CartState = { items: [] };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.items.find(
        (i) => i.menuItemId === action.item.menuItemId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItemId === existing.menuItemId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "remove":
      return {
        items: state.items.filter((i) => i.menuItemId !== action.menuItemId),
      };
    case "setQty": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.menuItemId !== action.menuItemId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.menuItemId === action.menuItemId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

export type FulfilmentType = "collection" | "delivery";

export type CartTotals = {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
};

export function computeTotals(
  items: CartItem[],
  fulfilment: FulfilmentType
): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const serviceFee = Math.round(
    subtotal * (siteConfig.directOrder.serviceFeePercent / 100)
  );
  let deliveryFee = 0;
  if (fulfilment === "delivery") {
    deliveryFee =
      subtotal >= siteConfig.directOrder.freeDeliveryThreshold
        ? 0
        : siteConfig.directOrder.deliveryFee;
  }
  const total = subtotal + serviceFee + deliveryFee;
  return { subtotal, serviceFee, deliveryFee, total, itemCount };
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  add: (item: CartItem) => void;
  remove: (menuItemId: string) => void;
  setQty: (menuItemId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: "hydrate", state: parsed });
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    itemCount,
    add: (item) => dispatch({ type: "add", item }),
    remove: (menuItemId) => dispatch({ type: "remove", menuItemId }),
    setQty: (menuItemId, quantity) =>
      dispatch({ type: "setQty", menuItemId, quantity }),
    clear: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
