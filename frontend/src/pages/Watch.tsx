import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadYouTubeVideos } from "../data/videos";  // our async loader
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Comments from "../components/Comments/Comments";
import Avatar from "../components/Avatar/Avatar";
import { formatCount, formatViews, timeAgo } from "../util/format";
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
          <div className={styles.channelRow}>
            <Link
              to={video.uploader ? `/channel/${video.uploader.id}` : "#"}
              className={styles.channelLink}
            >
              <Avatar
                name={video.uploader?.displayName ?? video.channelName}
                src={video.uploader?.avatarUrl ?? video.avatarUrl}
                size={40}
              />
              <span className={styles.channelText}>
                <span className={styles.channelName}>
                  {video.uploader?.displayName ?? video.channelName}
                </span>
                <span className={styles.subCount}>
                  {formatCount(subscriberCount)} subscriber{subscriberCount !== 1 ? "s" : ""}
                </span>
              </span>
            </Link>
            {video.uploader && (
              <button
                className={`${styles.subscribeBtn} ${isSubscribed ? styles.subscribed : ""}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          <div className={styles.rightActions}>
            <div className={styles.likeGroup}>
              <button
                className={`${styles.likeBtn} ${isLiked ? styles.likeActive : ""}`}
                onClick={handleLike}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                  <path d="M3 11h3v10H3V11zm18 1.3c0-.72-.58-1.3-1.3-1.3h-5.19l.78-3.76.02-.26a1 1 0 0 0-.29-.7L14.17 5 8.6 10.6a1.3 1.3 0 0 0-.38.92V19.7c0 .72.58 1.3 1.3 1.3h7.8c.5 0 .95-.29 1.15-.74l2.62-6.12c.08-.2.11-.4.11-.6v-1.24z" />
                </svg>
                {likeCount > 0 ? formatCount(likeCount) : "Like"}
              </button>
              <span className={styles.likeDivider} />
              <button className={styles.dislikeBtn} aria-label="Dislike">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                  <path d="M21 13h-3V3h3v10zM3 11.7c0 .72.58 1.3 1.3 1.3h5.19l-.78 3.76-.02.26c0 .27.11.52.29.7L9.83 19l5.57-5.6c.24-.24.38-.57.38-.92V4.3c0-.72-.58-1.3-1.3-1.3h-7.8c-.5 0-.95.29-1.15.74L2.91 9.86c-.08.2-.11.4-.11.6v1.24z" />
                </svg>
              </button>
            </div>
            <button className={styles.actionBtn}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                <path d="M15 5.63L20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1L15 9.8V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z" />
              </svg>
              Share
            </button>
            <button className={styles.actionBtn}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                <path d="M17 18v1H6v-1h11zm-.5-6.6l-.7-.7-3.8 3.8V3h-1v11.5l-3.8-3.8-.7.7 5 5 5-5z" />
              </svg>
              Download
            </button>
            <button className={styles.actionBtn} aria-label="More actions">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                <path d="M12 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.description}>
          <div className={styles.descStats}>
            <span>{formatViews(video.views)}</span>
            {video.publishedAt && <span>{timeAgo(video.publishedAt)}</span>}
          </div>
          {video.description ? (
            <p className={styles.descText}>{video.description}</p>
          ) : (
            <p className={styles.descText}>No description provided.</p>
          )}
        </div>

        {id && <Comments videoId={id} />}
      </div>

      <aside className={styles.rightCol}>
        <h3 className={styles.recommendedTitle}>Up next</h3>
        <ul className={styles.recommendedList}>
          {recommended.map((rec) => (
            <li key={rec.id} className={styles.recItem}>
              <Link to={`/watch/${rec.id}`} className={styles.recLink}>
                <div className={styles.recThumbWrap}>
                  <img
                    src={rec.thumbnailUrl}
                    alt={rec.title}
                    className={styles.recThumb}
                    loading="lazy"
                  />
                  {rec.duration && <span className={styles.recDuration}>{rec.duration}</span>}
                </div>
                <div className={styles.recMeta}>
                  <h4 className={styles.recTitle}>{rec.title}</h4>
                  <div className={styles.recChannel}>{rec.channelName}</div>
                  <div className={styles.recViews}>
                    {formatViews(rec.views)}
                    {rec.publishedAt && ` • ${timeAgo(rec.publishedAt)}`}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
