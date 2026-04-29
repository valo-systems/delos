"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import BrandLogo from "@/components/brand/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.post<{ token: string; expiresAt: string }>("/auth/login", {
        username,
        password,
      });
      sessionStorage.setItem("delos-admin-token", data.token);
      router.push("/admin/orders");
    } catch {
      setError("Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <BrandLogo />
        </div>

        <div className="border border-gold/20 bg-charcoal p-8">
          <h1
            className="text-2xl text-cream mb-6 text-center"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Admin Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-gold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-black border border-gold/30 focus:border-gold text-cream placeholder-cream/30 px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="border border-wine/40 bg-wine/10 text-wine text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gold text-black text-sm tracking-widest uppercase hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-cream/20 mt-6 tracking-wider">
          Delos Lounge & Dining — Admin
        </p>
      </div>
    </main>
  );
}
