import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadYouTubeVideos } from "../data/videos";  // our async loader
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Comments from "../components/Comments/Comments";
import styles from "./Watch.module.css";
import type { Video } from "../types/video";
import type { SubscriptionStatus, SubscriberCount } from "../types/subscription";

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
  const { isAuthenticated } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

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

    // Record watch history if authenticated
    if (id && isAuthenticated) {
      api(`/api/history/${id}`, { method: "POST", auth: true }).catch(() => {
        // Silently ignore errors for watch history recording
      });
    }

    // Load like status if id exists
    if (id) {
      api<{ isLiked: boolean; likeCount: number }>(`/api/videos/${id}/like-status`)
        .then((data) => {
          setIsLiked(data.isLiked);
          setLikeCount(data.likeCount);
        })
        .catch(() => {
          // Ignore errors for like status
        });
    }
  }, [id]);

  // Load subscription status when video/uploader changes
  useEffect(() => {
    if (!video?.uploader?.id) return;
    const channelId = video.uploader.id;

    // Get subscriber count (public endpoint)
    api<SubscriberCount>(`/api/subscriptions/${channelId}/count`)
      .then((data) => setSubscriberCount(data.subscriberCount))
      .catch(() => {});

    // Get subscription status (auth required)
    if (isAuthenticated) {
      api<SubscriptionStatus>(`/api/subscriptions/${channelId}/status`, { auth: true })
        .then((data) => setIsSubscribed(data.subscribed))
        .catch(() => {});
    }
  }, [video?.uploader?.id, isAuthenticated]);

  const handleSubscribe = async () => {
    if (!video?.uploader?.id) return;
    const channelId = video.uploader.id;

    try {
      if (isSubscribed) {
        await api<SubscriptionStatus>(`/api/subscriptions/${channelId}/unsubscribe`, { method: "POST", auth: true });
        setIsSubscribed(false);
        setSubscriberCount((c) => Math.max(0, c - 1));
      } else {
        await api<SubscriptionStatus>(`/api/subscriptions/${channelId}/subscribe`, { method: "POST", auth: true });
        setIsSubscribed(true);
        setSubscriberCount((c) => c + 1);
      }
    } catch (error) {
      console.error("Failed to subscribe/unsubscribe:", error);
      alert("Please log in to subscribe");
    }
  };

  const handleLike = async () => {
    if (!id) return;

    try {
      if (isLiked) {
        const data = await api<{ liked: boolean; likeCount: number }>(`/api/videos/${id}/unlike`, {
          method: "POST",
          auth: true,
        });
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        const data = await api<{ liked: boolean; likeCount: number }>(`/api/videos/${id}/like`, {
          method: "POST",
          auth: true,
        });
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error("Failed to like/unlike video:", error);
      alert("Please log in to like videos");
    }
  };

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
            {video.uploader ? (
              <>
                <Link to={`/channel/${video.uploader.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
                  {video.uploader.displayName}
                </Link>
                <span className={styles.stat} style={{ fontSize: 12 }}>
                  {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
                </span>
                <button
                  className={styles.subscribeBtn}
                  onClick={handleSubscribe}
                  style={{
                    background: isSubscribed ? "var(--panel)" : "#cc0000",
                    color: isSubscribed ? "var(--muted)" : "#fff",
                    border: isSubscribed ? "1px solid var(--border)" : "none",
                  }}
                >
                  {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
                </button>
              </>
            ) : (
              <span className={styles.stat}>{video.channelName}</span>
            )}
            <span className={styles.dot} />
            <span className={styles.stat}>{video.views} views</span>
            <span className={styles.dot} />
            <span className={styles.stat}>Published recently</span>
          </div>
          <div className={styles.rightActions}>
            <button
              className={styles.actionBtn}
              onClick={handleLike}
              style={{ fontWeight: isLiked ? 'bold' : 'normal' }}
            >
              {isLiked ? '👍' : '👍'} Like {likeCount > 0 && `(${likeCount})`}
            </button>
            <button className={styles.actionBtn}>👎 Dislike</button>
            <button className={styles.actionBtn}>↗ Share</button>
            <button className={styles.actionBtn}>⋯ More</button>
          </div>
        </div>

        {id && <Comments videoId={id} />}
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
