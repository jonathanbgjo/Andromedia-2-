import type { Video } from "../types/video";
import { YT_IDS } from "./youtubeIds";
import { ytThumb, ytOEmbed } from "../util/youtube";
import { synthViews, synthDuration, synthPublishedAt } from "../util/format";
import { demoUploadedVideos } from "../api/client";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Cache the built feed for the whole session. Without this, every navigation
// to Home/Watch/Trending/Search re-fired ~100 oEmbed requests and produced a
// different card order (and, previously, different positional IDs) each time.
let cachedVideos: Promise<Video[]> | null = null;

async function buildVideos(): Promise<Video[]> {
  const items: Video[] = await Promise.all(
    YT_IDS.map(async (id, i) => {
      const meta = await ytOEmbed(id); // { title, author_name }
      const channelName = meta?.author_name ?? "YouTube";
      return {
        // Stable id derived from the YouTube id — consistent across pages,
        // unlike the old positional String(i + 1) which changed per shuffle.
        id,
        title: meta?.title ?? "YouTube Video",
        channelName,
        views: synthViews(id),
        description: "",
        thumbnailUrl: ytThumb(id),
        youtubeId: id,
        duration: synthDuration(id),
        publishedAt: synthPublishedAt(id),
        uploader: { id: i + 1, displayName: channelName },
      } satisfies Video;
    })
  );

  // Real uploaded videos keep their backend numeric id.
  const uploaded: Video[] = demoUploadedVideos.map((v) => ({
    id: String(v.id),
    title: v.title,
    channelName: v.uploader?.displayName ?? "Demo User",
    views: v.views ?? synthViews(String(v.id)),
    description: v.description ?? "",
    thumbnailUrl: ytThumb(v.s3Url),
    youtubeId: v.s3Url,
    duration: synthDuration(String(v.id)),
    publishedAt: synthPublishedAt(String(v.id)),
    uploader: v.uploader ?? { id: 1, displayName: "Demo User" },
  }));

  // Uploads stay at the front; the YouTube feed is shuffled once per session.
  return [...uploaded, ...shuffle(items)];
}

/** Build (once) and return the session feed. Repeat calls reuse the cache. */
export function loadYouTubeVideos(): Promise<Video[]> {
  if (!cachedVideos) {
    cachedVideos = buildVideos().catch((err) => {
      cachedVideos = null; // allow a retry on next call if the build failed
      throw err;
    });
  }
  return cachedVideos;
}
