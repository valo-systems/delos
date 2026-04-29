import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Order Online · Delos Direct",
  description:
    "Order Delos direct in Morningside, Durban. Lower fees than marketplace delivery — collection or local delivery, with WhatsApp confirmation.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
