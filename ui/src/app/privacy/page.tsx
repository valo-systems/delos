import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Delos Lounge & Dining.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-cream mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Privacy Policy
          </h1>
          <span className="divider-gold mb-6 block" />
          <p className="text-cream/50 text-sm mb-8">Last updated: {new Date().getFullYear()}</p>

          <div className="prose prose-invert max-w-none space-y-8 text-cream/70 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl text-cream mb-3" style={{ fontFamily: "var(--font-serif)" }}>1. Information We Collect</h2>
              <p>When you use our website, make a booking, submit a contact form, or order online, we may collect your name, phone number, email address, and the details of your enquiry or booking.</p>
            </section>
            <section>
              <h2 className="text-xl text-cream mb-3" style={{ fontFamily: "var(--font-serif)" }}>2. How We Use Your Information</h2>
              <p>We use your information solely to respond to your enquiries, process your bookings, and communicate with you about your reservation or event. We do not sell or share your personal information with third parties for marketing purposes.</p>
            </section>
            <section>
              <h2 className="text-xl text-cream mb-3" style={{ fontFamily: "var(--font-serif)" }}>3. Cookies</h2>
              <p>This website may use cookies to improve your browsing experience and gather analytics. You can disable cookies in your browser settings at any time.</p>
            </section>
            <section>
              <h2 className="text-xl text-cream mb-3" style={{ fontFamily: "var(--font-serif)" }}>4. Data Security</h2>
              <p>We take reasonable steps to protect your personal information. Our website is served over HTTPS. However, no internet transmission is completely secure.</p>
            </section>
            <section>
              <h2 className="text-xl text-cream mb-3" style={{ fontFamily: "var(--font-serif)" }}>5. Your Rights</h2>
              <p>You have the right to request access to, correction of, or deletion of your personal information. To exercise these rights, contact us at info@deloslounge.co.za.</p>
            </section>
            <section>
              <h2 className="text-xl text-cream mb-3" style={{ fontFamily: "var(--font-serif)" }}>6. Contact</h2>
              <p>For any privacy-related queries, please contact us at <a href="mailto:info@deloslounge.co.za" className="text-gold hover:text-gold-light">info@deloslounge.co.za</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
