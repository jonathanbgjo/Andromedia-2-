export const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");
export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? "").toLowerCase() === "true";

/**
 * Frontend-only: if no API_BASE or demo mode, this shim avoids real network calls.
 * You can customize return values per route below if needed.
 */
export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: any; auth?: boolean; headers?: Record<string, string> } = {}
): Promise<T> {
  if (!API_BASE || DEMO_MODE) {
    console.warn("⚠️ Demo mode / no API_BASE set. Skipping request:", path, options);
    // Return something sensible for known routes (login/register), or empty object by default
    if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) {
      const body = options.body ?? {};
      // Simulate backend response
      return {
        token: "demo-token",
        userId: 1,
        email: body.email ?? "demo@example.com",
        displayName: body.displayName ?? "Demo User",
      } as T;
    }
    // Return empty array for comments endpoints
    if (path.includes("/comments")) {
      return [] as T;
    }
    // Return empty array for search endpoints
    if (path.includes("/search")) {
      return [] as T;
    }
    // Return sensible defaults for like status
    if (path.includes("/like-status")) {
      return { isLiked: false, likeCount: 0 } as T;
    }
    // Return sensible defaults for like/unlike actions
    if (path.includes("/like") || path.includes("/unlike")) {
      return { liked: false, likeCount: 0 } as T;
    }
    // Default: empty object (adjust per endpoint as needed)
    return {} as T;
  }

  const { method = "GET", body, auth = false, headers = {} } = options;
  const finalHeaders: Record<string, string> = { "Content-Type": "application/json", ...headers };
  if (auth) {
    const token = localStorage.getItem("andromedia_token");
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      msg = errJson?.error || errJson?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}
