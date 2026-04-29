const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem("delos-admin-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async post<T>(path: string, body: unknown, auth = false): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(auth ? authHeaders() : {}) },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  },

  async get<T>(path: string, auth = false): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      headers: auth ? authHeaders() : {},
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  },
};
