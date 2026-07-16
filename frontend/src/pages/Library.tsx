import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { Channel as ChannelType, ChannelVideo } from "../types/channel";
import { formatCount, timeAgo } from "../util/format";
import styles from "./Library.module.css";

export default function Library() {
  const { isAuthenticated, user } = useAuth();
  const [videos, setVideos] = useState<ChannelVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    api<ChannelType>(`/api/users/${user.id}`)
      .then((data) => {
        setVideos(data.videos ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Your videos</h1>
        <div className={styles.emptyState}>
          <p>Sign in to see the videos you've uploaded.</p>
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
        <h1 className={styles.pageTitle}>Your videos</h1>
        <div className={styles.loading}>Loading your videos...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your videos</h1>
        <Link to="/upload" className={styles.clearBtn}>
          Upload video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't uploaded any videos yet.</p>
          <Link to="/upload" className={styles.signInLink}>
            Upload your first video
          </Link>
        </div>
      ) : (
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/watch/${video.id}`}
              className={styles.videoCard}
            >
              <div className={styles.thumbnail}>
                {video.s3Url ? (
                  <img
                    className={styles.thumbnailImg}
                    src={`https://img.youtube.com/vi/${video.s3Url}/mqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                  />
                ) : (
                  "No thumbnail"
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{video.title}</h3>
                <p className={styles.cardMeta}>
                  {formatCount(video.views ?? 0)} views
                  {video.likeCount > 0 && ` · ${formatCount(video.likeCount)} likes`}
                </p>
                {video.uploadTime && (
                  <span className={styles.watchedAgo}>
                    Uploaded {timeAgo(video.uploadTime)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
