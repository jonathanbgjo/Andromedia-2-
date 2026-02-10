import type { Video } from "../types/video";
import { YT_IDS } from "./youtubeIds";
import { ytThumb, ytOEmbed } from "../util/youtube";

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
  return items;
}
