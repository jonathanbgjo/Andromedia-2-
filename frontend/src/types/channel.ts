export interface ChannelVideo {
  id: number;
  title: string;
  description: string;
  s3Url: string;
  views: number;
  uploadTime: string;
  likeCount: number;
}

export interface Channel {
  id: number;
  displayName: string;
  createdDate: string;
  videoCount: number;
  videos: ChannelVideo[];
}
