import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Video } from "../types/video";
import { loadYouTubeVideos } from "../data/videos";
import { formatViews, timeAgo } from "../util/format";
import styles from "./Trending.module.css";

const viewsOf = (v: Video) => Number(v.views) || 0;

export default function Trending() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await loadYouTubeVideos();
        // Rank by the same view counts shown everywhere else, most-viewed first.
        const ranked = [...list].sort((a, b) => viewsOf(b) - viewsOf(a));
        if (alive) setVideos(ranked);
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
                <span className={styles.statItem}>{formatViews(v.views)}</span>
                {v.publishedAt && (
                  <span className={styles.statItem}>{timeAgo(v.publishedAt)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
