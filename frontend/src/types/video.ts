export type VideoID = string | number;

export interface Video {
  id: VideoID;                 // keep your internal id
  title: string;
  channelName: string;
  views: string | number;
  description?: string;
  thumbnailUrl: string;
  src?: string;                // keep optional for non-YouTube sources
  youtubeId?: string;          // ✅ new
  uploader?: { id: number; displayName: string; avatarUrl?: string };
  avatarUrl?: string;          // channel avatar (optional; falls back to initials)
  duration?: string;           // formatted "10:32" shown as a thumbnail badge
  publishedAt?: string;        // ISO date -> rendered as "3 days ago"
}

/** If your backend returns snake_case or different fields, map it to Video */
export interface ApiVideo {
  id: VideoID;
  title: string;
  channelName: string;
  views: number;              
  description?: string | null;
  thumbnailUrl: string;
}
