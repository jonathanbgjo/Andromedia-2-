export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function getToken(): string | null {
  return localStorage.getItem("andromedia_token");
}

export async function api<T = unknown>(
  path: string,
  options: { method?: HttpMethod; body?: any; auth?: boolean; headers?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, auth = false, headers = {} } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // harmless if you later move to httpOnly cookies
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      msg = errJson?.error || errJson?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}
