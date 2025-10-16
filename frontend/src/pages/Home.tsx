import VideoCard from "../components/VideoCard/videoCard";
import {useState, useEffect} from 'react'
import styles from './Home.module.css';
import tempVideos from "../data/videos";
import type { Video } from "../types/video";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]); // ✅ type the state

  useEffect(() => {
    setVideos(tempVideos); // tempVideos is Video[]
  }, []);

  return (
    <div className={styles.videoGrid}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}