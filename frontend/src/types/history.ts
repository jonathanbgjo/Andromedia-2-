export interface WatchHistoryVideo {
  id: number;
  title: string;
  description: string;
  s3Url: string;
  views: number;
  uploadTime: string;
  likeCount: number;
}

export interface WatchHistoryEntry {
  id: number;
  videoId: number;
  watchedAt: string;
  video: WatchHistoryVideo;
}
