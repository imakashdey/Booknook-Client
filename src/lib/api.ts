import { authClient } from "./auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const { data } = await authClient.token();
  if (data?.token) headers.Authorization = `Bearer ${data.token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Something went wrong");
  return body;
}

export async function publicFetch(path: string) {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
}