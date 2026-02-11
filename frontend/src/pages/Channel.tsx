import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { Channel as ChannelType } from "../types/channel";
import type { SubscriptionStatus, SubscriberCount } from "../types/subscription";
import styles from "./Channel.module.css";

export default function Channel() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api<ChannelType>(`/api/users/${id}`)
      .then((data) => {
        setChannel(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load channel");
        setLoading(false);
      });

    // Get subscriber count (public)
    api<SubscriberCount>(`/api/subscriptions/${id}/count`)
      .then((data) => setSubscriberCount(data.subscriberCount))
      .catch(() => {});

    // Get subscription status (auth required)
    if (isAuthenticated) {
      api<SubscriptionStatus>(`/api/subscriptions/${id}/status`, { auth: true })
        .then((data) => setIsSubscribed(data.subscribed))
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleSubscribe = async () => {
    if (!id) return;
    try {
      if (isSubscribed) {
        await api<SubscriptionStatus>(`/api/subscriptions/${id}/unsubscribe`, { method: "POST", auth: true });
        setIsSubscribed(false);
        setSubscriberCount((c) => Math.max(0, c - 1));
      } else {
        await api<SubscriptionStatus>(`/api/subscriptions/${id}/subscribe`, { method: "POST", auth: true });
        setIsSubscribed(true);
        setSubscriberCount((c) => c + 1);
      }
    } catch (error) {
      console.error("Failed to subscribe/unsubscribe:", error);
      alert("Please log in to subscribe");
    }
  };

  if (loading) return <div className={styles.loading}>Loading channel...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!channel) return <div className={styles.error}>Channel not found</div>;

  const initial = channel.displayName?.charAt(0)?.toUpperCase() || "?";
  const joinDate = channel.createdDate
    ? new Date(channel.createdDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className={styles.channelPage}>
      <div className={styles.banner} />

      <div className={styles.header}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.channelInfo}>
          <h1 className={styles.displayName}>{channel.displayName}</h1>
          <div className={styles.stats}>
            <span>{subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}</span>
            <span>{channel.videoCount} video{channel.videoCount !== 1 ? "s" : ""}</span>
            <span>Joined {joinDate}</span>
          </div>
        </div>
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
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Videos</h2>
        {channel.videos.length === 0 ? (
          <div className={styles.emptyState}>This channel has no videos yet.</div>
        ) : (
          <div className={styles.videoGrid}>
            {channel.videos.map((video) => (
              <Link
                key={video.id}
                to={`/watch/${video.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    overflow: "hidden",
                    transition: "transform .12s ease, box-shadow .12s ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      background: "var(--bg-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)",
                      fontSize: 14,
                    }}
                  >
                    {video.s3Url ? (
                      <video
                        src={video.s3Url}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        muted
                        preload="metadata"
                      />
                    ) : (
                      "No thumbnail"
                    )}
                  </div>
                  <div style={{ padding: "12px 14px 16px" }}>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: "var(--text)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {video.title}
                    </h3>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
                      {video.views ?? 0} views
                      {video.likeCount > 0 && ` \u00B7 ${video.likeCount} likes`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
