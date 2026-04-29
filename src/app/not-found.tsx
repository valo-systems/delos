import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">404</p>
          <h1
            className="text-5xl md:text-6xl font-bold text-cream mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Page Not Found
          </h1>
          <span className="divider-gold mb-6 mx-auto block" />
          <p className="text-cream/50 text-lg max-w-md mx-auto mb-10">
            This page does not exist. Perhaps you were looking for our menu, bookings, or events?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/menu"
              className="px-6 py-3 border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-colors"
            >
              View Menu
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
