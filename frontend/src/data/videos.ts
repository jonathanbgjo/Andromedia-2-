import type { Video } from "../types/video";
import { YT_IDS } from "./youtubeIds";
import { ytThumb, ytOEmbed } from "../util/youtube";
import { demoUploadedVideos } from "../api/client";

// Build a list with real thumbnails; fetch titles/channel via oEmbed
export async function loadYouTubeVideos(): Promise<Video[]> {
  const items = await Promise.all(
    YT_IDS.map(async (id, i) => {
      const meta = await ytOEmbed(id); // { title, author_name }
      const channelName = meta?.author_name ?? "YouTube";
      return {
        id: String(i + 1),
        title: meta?.title ?? "YouTube Video",
        channelName,
        views: "—",
        description: "",
        thumbnailUrl: ytThumb(id),
        youtubeId: id,
        uploader: { id: i + 1, displayName: channelName },
      } satisfies Video;
    })
  );

  // Include any demo-uploaded videos at the front of the list
  const uploaded: Video[] = demoUploadedVideos.map((v) => ({
    id: String(v.id),
    title: v.title,
    channelName: v.uploader?.displayName ?? "Demo User",
    views: v.views ?? 0,
    description: v.description ?? "",
    thumbnailUrl: ytThumb(v.s3Url),
    youtubeId: v.s3Url,
    uploader: v.uploader ?? { id: 1, displayName: "Demo User" },
  }));

  return [...uploaded, ...items];
}
