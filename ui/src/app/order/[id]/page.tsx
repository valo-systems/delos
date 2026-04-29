import OrderStatusClient from "./OrderStatusClient";

// Required for next.js static export — order IDs are generated at runtime so
// we cannot enumerate them at build time. The route shell is deployed once;
// the actual order ID is read client-side via the prop passed below.
// On CloudFront, configure a custom error rule or path rewrite so that
// requests to /order/* are served from this page's static output.
// Static export requires at least one path to be declared.
// A placeholder shell is generated at /order/pending/; real order IDs are
// loaded client-side. Configure CloudFront to rewrite /order/* → /order/pending/
// so that dynamic order URLs resolve to this shell at runtime.
export function generateStaticParams() {
  return [{ id: "pending" }];
}

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderStatusClient id={id} />;
}
