import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Table",
  description:
    "Reserve your table at Delos Lounge & Dining in Morningside, Durban. Submit a request online or contact us via WhatsApp.",
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
