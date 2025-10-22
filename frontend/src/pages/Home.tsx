import { useEffect, useState } from "react";
import type { Video } from "../types/video";
import { loadYouTubeVideos } from "../data/videos"; 
import VideoCard from "../components/VideoCard/videoCard"; 
import styles from "./Home.module.css";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await loadYouTubeVideos();
        if (alive) setVideos(shuffle(list));
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
