import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders · Delos Admin",
  robots: { index: false, follow: false },
};

export default function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
