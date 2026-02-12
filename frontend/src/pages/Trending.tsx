import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Video } from "../types/video";
import { loadYouTubeVideos } from "../data/videos";
import styles from "./Trending.module.css";

function simulateViewCount(videoId: string | number): number {
  let hash = 0;
  const str = String(videoId);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 9000000) + 100000;
}

function simulateLikeCount(views: number): number {
  const seed = views % 100;
  const ratio = 0.02 + (seed / 100) * 0.03;
  return Math.floor(views * ratio);
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

interface TrendingVideo extends Video {
  simulatedViews: number;
  simulatedLikes: number;
}

export default function Trending() {
  const [videos, setVideos] = useState<TrendingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await loadYouTubeVideos();
        const withStats: TrendingVideo[] = list.map((v) => {
          const simulatedViews = simulateViewCount(v.id);
          return { ...v, simulatedViews, simulatedLikes: simulateLikeCount(simulatedViews) };
        });
        withStats.sort((a, b) => b.simulatedViews - a.simulatedViews);
        if (alive) setVideos(withStats);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading trending videos...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>🔥</span>
        <h1 className={styles.headerTitle}>Trending</h1>
      </div>

      <div className={styles.list}>
        {videos.map((v, i) => (
          <div
            key={v.id}
            className={styles.item}
            onClick={() => navigate(`/watch/${v.id}`)}
          >
            <div className={styles.rank}>#{i + 1}</div>

            <div className={styles.thumbWrap}>
              <img
                className={styles.thumb}
                src={v.thumbnailUrl}
                alt={v.title}
                loading="lazy"
              />
            </div>

            <div className={styles.info}>
              <h3 className={styles.title}>{v.title}</h3>
              <p className={styles.channel}>
                {v.uploader ? (
                  <Link
                    to={`/channel/${v.uploader.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {v.uploader.displayName}
                  </Link>
                ) : (
                  v.channelName
                )}
              </p>
              <div className={styles.stats}>
                <span className={styles.statItem}>
                  {formatCount(v.simulatedViews)} views
                </span>
                <span className={styles.statItem}>
                  {formatCount(v.simulatedLikes)} likes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
