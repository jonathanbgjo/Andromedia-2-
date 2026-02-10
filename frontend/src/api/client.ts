export const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");
export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? "").toLowerCase() === "true";

// In-memory storage for demo mode comments
const demoComments: Record<string, any[]> = {};

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
    // Handle comments endpoints
    if (path.includes("/comments")) {
      const videoIdMatch = path.match(/\/api\/videos\/([^/]+)\/comments/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "unknown";

      // Initialize comments array for this video if it doesn't exist
      if (!demoComments[videoId]) {
        demoComments[videoId] = [];
      }

      // Handle POST (create comment)
      if (options.method === "POST") {
        const body = options.body ?? {};
        const newComment = {
          id: Date.now(), // Use timestamp as unique ID
          content: body.content ?? "",
          createdAt: new Date().toISOString(),
          author: {
            displayName: "Demo User",
            email: "demo@example.com",
          },
        };
        demoComments[videoId].unshift(newComment); // Add to beginning
        return newComment as T;
      }

      // Handle DELETE
      if (options.method === "DELETE") {
        const commentIdMatch = path.match(/\/comments\/(\d+)$/);
        if (commentIdMatch) {
          const commentId = parseInt(commentIdMatch[1]);
          demoComments[videoId] = demoComments[videoId].filter(c => c.id !== commentId);
        }
        return { message: "Comment deleted" } as T;
      }

      // Handle GET (return all comments for this video)
      return demoComments[videoId] as T;
    }
    // Return empty array for search endpoints
    if (path.includes("/search")) {
      return [] as T;
    }
    // Return mock channel data for user endpoints
    if (path.match(/^\/api\/users\/\d+$/)) {
      const userIdMatch = path.match(/\/api\/users\/(\d+)$/);
      const userId = userIdMatch ? parseInt(userIdMatch[1]) : 1;
      return {
        id: userId,
        displayName: `Demo Channel ${userId}`,
        createdDate: new Date().toISOString(),
        videoCount: 0,
        videos: [],
      } as T;
    }
    if (path.match(/^\/api\/users\/\d+\/videos$/)) {
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
