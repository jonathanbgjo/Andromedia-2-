export type VideoID = string | number;

export interface Video {
  id: VideoID;
  title: string;
  channelName: string;
  views: string | number;    
  description?: string;
  thumbnailUrl: string;
  src: string; 
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
