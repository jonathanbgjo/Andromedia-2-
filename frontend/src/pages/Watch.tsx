import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadYouTubeVideos } from "../data/videos";  // ✅ our async loader
import styles from "./Watch.module.css";
import type { Video } from "../types/video";

// Utility to randomize videos
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  useEffect(() => {
    // Load videos dynamically from YouTube (or your backend)
    loadYouTubeVideos()
      .then((videos) => {
        setAllVideos(videos);
        if (id) {
          const found = videos.find((v) => String(v.id) === id) || videos[0];
          setVideo(found);
        }
      })
      .catch(() => setAllVideos([]));
  }, [id]);

  const recommended = useMemo<Video[]>(
    () => shuffle(allVideos.filter((v) => String(v.id) !== id)).slice(0, 10),
    [allVideos, id]
  );

  if (!video) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.watchLayout}>
      <div className={styles.leftCol}>
        <div className={styles.playerWrap}>
          {video.youtubeId ? (
            <iframe
              className={styles.player}
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              className={styles.player}
              controls
              poster={video.thumbnailUrl}
              preload="metadata"
            >
              {video.src && <source src={video.src} type="video/mp4" />}
            </video>
          )}
        </div>

        <h1 className={styles.title}>{video.title}</h1>

        <div className={styles.metaBar}>
          <div className={styles.leftMeta}>
            <span className={styles.stat}>{video.views} views</span>
            <span className={styles.dot} />
            <span className={styles.stat}>Published recently</span>
          </div>
          <div className={styles.rightActions}>
            <button className={styles.actionBtn}>👍 Like</button>
            <button className={styles.actionBtn}>👎 Dislike</button>
            <button className={styles.actionBtn}>↗ Share</button>
            <button className={styles.actionBtn}>⋯ More</button>
          </div>
        </div>

        {/* rest of the description/comments */}
      </div>

      <aside className={styles.rightCol}>
        <h3 className={styles.recommendedTitle}>Up next</h3>
        <ul className={styles.recommendedList}>
          {recommended.map((rec) => (
            <li key={rec.id} className={styles.recItem}>
              <Link to={`/watch/${rec.id}`} className={styles.recLink}>
                <img
                  src={rec.thumbnailUrl}
                  alt={rec.title}
                  className={styles.recThumb}
                  loading="lazy"
                />
                <div className={styles.recMeta}>
                  <h4 className={styles.recTitle}>{rec.title}</h4>
                  <div className={styles.recChannel}>{rec.channelName}</div>
                  <div className={styles.recViews}>{rec.views} views</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
