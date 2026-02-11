import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { WatchHistoryEntry } from "../types/history";
import styles from "./Library.module.css";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  if (diffWeek < 5) return `${diffWeek} week${diffWeek !== 1 ? "s" : ""} ago`;
  return `${diffMonth} month${diffMonth !== 1 ? "s" : ""} ago`;
}

export default function Library() {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    api<WatchHistoryEntry[]>("/api/history", { auth: true })
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  const handleClearHistory = async () => {
    try {
      await api("/api/history", { method: "DELETE", auth: true });
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Watch History</h1>
        <div className={styles.emptyState}>
          <p>Sign in to keep track of what you watch.</p>
          <Link to="/login" className={styles.signInLink}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Watch History</h1>
        <div className={styles.loading}>Loading history...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Watch History</h1>
        {history.length > 0 && (
          <button className={styles.clearBtn} onClick={handleClearHistory}>
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Your watch history is empty.</p>
          <p>Videos you watch will appear here.</p>
        </div>
      ) : (
        <div className={styles.videoGrid}>
          {history.map((entry) => (
            <Link
              key={entry.id}
              to={`/watch/${entry.videoId}`}
              className={styles.videoCard}
            >
              <div className={styles.thumbnail}>
                {entry.video.s3Url ? (
                  <img
                    className={styles.thumbnailImg}
                    src={`https://img.youtube.com/vi/${entry.video.s3Url}/mqdefault.jpg`}
                    alt={entry.video.title}
                    loading="lazy"
                  />
                ) : (
                  "No thumbnail"
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{entry.video.title}</h3>
                <p className={styles.cardMeta}>
                  {entry.video.views ?? 0} views
                  {entry.video.likeCount > 0 && ` \u00B7 ${entry.video.likeCount} likes`}
                </p>
                <span className={styles.watchedAgo}>
                  Watched {timeAgo(entry.watchedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
