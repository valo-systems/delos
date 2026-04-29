import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations · Delos Admin",
  robots: { index: false, follow: false },
};

export default function AdminReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
