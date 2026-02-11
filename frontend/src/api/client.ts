export const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");
export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? "").toLowerCase() === "true";

// In-memory storage for demo mode user profile
let demoUserProfile = {
  id: 1,
  displayName: "Demo User",
  email: "demo@example.com",
  createdDate: "2024-06-15T00:00:00.000Z",
  videoCount: 0,
};

// In-memory storage for demo mode watch history
const demoWatchHistory: any[] = [];

// In-memory storage for demo mode comments
const demoComments: Record<string, any[]> = {};

// In-memory storage for demo mode likes
const demoLikes: Record<string, boolean> = {};
const demoLikeCounts: Record<string, number> = {};

// In-memory storage for demo mode subscriptions
const demoSubscriptions: Set<string> = new Set();
const demoSubCounts: Record<string, number> = {};

// In-memory storage for demo mode uploaded videos
export const demoUploadedVideos: any[] = [];
let demoVideoIdCounter = 9000;

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
      const demoChannelVideos = [
        { id: userId * 100 + 1, title: "Demo Video 1", description: "A demo video", s3Url: "", views: 1200, uploadTime: new Date().toISOString(), likeCount: 42 },
        { id: userId * 100 + 2, title: "Demo Video 2", description: "Another demo video", s3Url: "", views: 830, uploadTime: new Date().toISOString(), likeCount: 15 },
        { id: userId * 100 + 3, title: "Demo Video 3", description: "Yet another demo video", s3Url: "", views: 560, uploadTime: new Date().toISOString(), likeCount: 8 },
      ];
      return {
        id: userId,
        displayName: `Demo Channel ${userId}`,
        createdDate: "2024-06-15T00:00:00.000Z",
        videoCount: demoChannelVideos.length,
        videos: demoChannelVideos,
      } as T;
    }
    if (path.match(/^\/api\/users\/\d+\/videos$/)) {
      return [] as T;
    }
    // Return sensible defaults for like status
    if (path.includes("/like-status")) {
      const videoIdMatch = path.match(/\/api\/videos\/([^/]+)\/like-status/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "unknown";
      return {
        isLiked: demoLikes[videoId] ?? false,
        likeCount: demoLikeCounts[videoId] ?? 0,
      } as T;
    }
    // Handle unlike action (must be checked before /like since /unlike contains /like)
    if (path.includes("/unlike")) {
      const videoIdMatch = path.match(/\/api\/videos\/([^/]+)\/unlike/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "unknown";
      demoLikes[videoId] = false;
      demoLikeCounts[videoId] = Math.max(0, (demoLikeCounts[videoId] ?? 0) - 1);
      return { liked: false, likeCount: demoLikeCounts[videoId] } as T;
    }
    // Handle like action
    if (path.includes("/like")) {
      const videoIdMatch = path.match(/\/api\/videos\/([^/]+)\/like/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "unknown";
      demoLikes[videoId] = true;
      demoLikeCounts[videoId] = (demoLikeCounts[videoId] ?? 0) + 1;
      return { liked: true, likeCount: demoLikeCounts[videoId] } as T;
    }
    // Handle subscription endpoints
    if (path.match(/\/api\/subscriptions\/(\d+)\/subscribe$/) && options.method === "POST") {
      const channelId = path.match(/\/api\/subscriptions\/(\d+)\/subscribe$/)![1];
      demoSubscriptions.add(channelId);
      demoSubCounts[channelId] = (demoSubCounts[channelId] ?? 0) + 1;
      return { subscribed: true } as T;
    }
    if (path.match(/\/api\/subscriptions\/(\d+)\/unsubscribe$/) && options.method === "POST") {
      const channelId = path.match(/\/api\/subscriptions\/(\d+)\/unsubscribe$/)![1];
      demoSubscriptions.delete(channelId);
      demoSubCounts[channelId] = Math.max(0, (demoSubCounts[channelId] ?? 0) - 1);
      return { subscribed: false } as T;
    }
    if (path.match(/\/api\/subscriptions\/(\d+)\/status$/)) {
      const channelId = path.match(/\/api\/subscriptions\/(\d+)\/status$/)![1];
      return { subscribed: demoSubscriptions.has(channelId) } as T;
    }
    if (path.match(/\/api\/subscriptions\/(\d+)\/count$/)) {
      const channelId = path.match(/\/api\/subscriptions\/(\d+)\/count$/)![1];
      return { subscriberCount: demoSubCounts[channelId] ?? 0 } as T;
    }
    if (path === "/api/subscriptions/my") {
      const channels = Array.from(demoSubscriptions).map((chId) => ({
        id: parseInt(chId),
        displayName: `Demo Channel ${chId}`,
      }));
      return channels as T;
    }
    // Handle user profile endpoints
    if (path === "/api/users/me") {
      if (options.method === "PUT") {
        const body = options.body ?? {};
        if (body.displayName) {
          demoUserProfile.displayName = body.displayName;
        }
        demoUserProfile.videoCount = demoUploadedVideos.length;
        return { ...demoUserProfile } as T;
      }
      // GET
      demoUserProfile.videoCount = demoUploadedVideos.length;
      return { ...demoUserProfile } as T;
    }
    // Handle watch history endpoints
    if (path === "/api/history" && options.method === "DELETE") {
      demoWatchHistory.length = 0;
      return { message: "History cleared" } as T;
    }
    if (path === "/api/history") {
      // GET - return watch history
      return [...demoWatchHistory] as T;
    }
    if (path.match(/^\/api\/history\/\d+$/) && options.method === "POST") {
      const videoIdMatch = path.match(/\/api\/history\/(\d+)$/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "0";
      // Avoid duplicates at top - remove existing entry for this video
      const existingIdx = demoWatchHistory.findIndex((h: any) => String(h.videoId) === videoId);
      if (existingIdx !== -1) {
        demoWatchHistory.splice(existingIdx, 1);
      }
      demoWatchHistory.unshift({
        id: Date.now(),
        videoId: parseInt(videoId),
        watchedAt: new Date().toISOString(),
        video: {
          id: parseInt(videoId),
          title: `Video ${videoId}`,
          description: "",
          s3Url: "",
          views: 0,
          uploadTime: new Date().toISOString(),
          likeCount: 0,
        },
      });
      return { message: "Watch recorded" } as T;
    }
    // Handle video upload (POST /api/videos)
    if (path === "/api/videos" && options.method === "POST") {
      const body = options.body ?? {};
      const videoUrl: string = body.videoUrl ?? "";
      // Extract YouTube ID from the URL (same logic as Upload.tsx)
      let youtubeId: string | null = null;
      const match = videoUrl.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (match) youtubeId = match[1];
      else if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) youtubeId = videoUrl;

      if (!youtubeId) {
        throw new Error("Invalid YouTube URL");
      }

      const newId = ++demoVideoIdCounter;
      const newVideo = {
        id: newId,
        title: body.title ?? "Untitled",
        description: body.description ?? "",
        s3Url: youtubeId,
        views: 0,
        uploadTime: new Date().toISOString(),
        uploader: { id: 1, displayName: "Demo User" },
        likeCount: 0,
      };
      demoUploadedVideos.unshift(newVideo);
      return newVideo as T;
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
