import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import tempVideos from "../data/videos";
import styles from "./Watch.module.css";
import type { Video } from "../types/video";

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (!id) return;
    // convert ids to string for comparison (in case your tempVideos have numeric IDs)
    const found = tempVideos.find((v: Video) => String(v.id) === id) || tempVideos[0];
    setVideo(found);
  }, [id]);

  const recommended = useMemo<Video[]>(
    () => tempVideos.filter((v: Video) => String(v.id) !== id).slice(0, 10),
    [id]
  );

  if (!video) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.watchLayout}>
      <div className={styles.leftCol}>
        <div className={styles.playerWrap}>
          <video
            className={styles.player}
            controls
            poster={video.thumbnailUrl}
            preload="metadata"
          >
            <source src={video.src} type="video/mp4" />
          </video>
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

        <div className={styles.channelRow}>
          <div className={styles.channelInfo}>
            <div className={styles.avatar} aria-hidden="true">
              {video.channelName?.[0]?.toUpperCase() || "C"}
            </div>
            <div>
              <div className={styles.channelName}>{video.channelName}</div>
              <div className={styles.subCount}>123K subscribers</div>
            </div>
          </div>
          <button className={styles.subscribeBtn}>Subscribe</button>
        </div>

        <div className={styles.descriptionCard}>
          <div className={styles.description}>{video.description}</div>
        </div>

        <section className={styles.comments}>
          <h2 className={styles.commentsTitle}>Comments</h2>
          <form
            className={styles.newComment}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.smallAvatar}>Y</div>
            <input
              className={styles.commentInput}
              placeholder="Add a comment…"
            />
          </form>
          <ul className={styles.commentList}>
            <li className={styles.commentItem}>
              <div className={styles.smallAvatar}>A</div>
              <div className={styles.commentBody}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>Alex</span>
                  <span className={styles.dot} />
                  <span className={styles.commentTime}>2 days ago</span>
                </div>
                <p className={styles.commentText}>
                  Loved this! Can’t wait for the S3 hookup.
                </p>
              </div>
            </li>
          </ul>
        </section>
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
