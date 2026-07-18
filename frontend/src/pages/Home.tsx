import { useEffect, useState } from "react";
import type { Video } from "../types/video";
import { loadYouTubeVideos } from "../data/videos";
import VideoCard from "../components/VideoCard/videoCard";
import styles from "./Home.module.css";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await loadYouTubeVideos();
        if (alive) setVideos(list);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return <div className={styles.videoGrid}>Loading…</div>;
  }

  return (
    <div className={styles.videoGrid}>
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}
