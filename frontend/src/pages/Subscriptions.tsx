import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { SubscribedChannel } from "../types/subscription";
import styles from "./Subscriptions.module.css";

export default function Subscriptions() {
  const { isAuthenticated } = useAuth();
  const [channels, setChannels] = useState<SubscribedChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    api<SubscribedChannel[]>("/api/subscriptions/my", { auth: true })
      .then((data) => {
        setChannels(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Subscriptions</h1>
        <div className={styles.emptyState}>
          <p>Sign in to see your subscriptions.</p>
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
        <h1 className={styles.pageTitle}>Subscriptions</h1>
        <div className={styles.loading}>Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Subscriptions</h1>
      {channels.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You have not subscribed to any channels yet.</p>
          <p>Browse videos and subscribe to channels you enjoy.</p>
        </div>
      ) : (
        <div className={styles.channelGrid}>
          {channels.map((ch) => (
            <Link
              key={ch.id}
              to={`/channel/${ch.id}`}
              className={styles.channelCard}
            >
              <div className={styles.channelAvatar}>
                {ch.displayName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className={styles.channelName}>{ch.displayName}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
