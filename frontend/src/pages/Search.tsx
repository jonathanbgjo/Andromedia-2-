import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Video } from "../types/video";
import { api } from "../api/client";
import VideoCard from "../components/VideoCard/videoCard";
import styles from "./Home.module.css";

interface BackendVideo {
  id: number;
  title: string;
  description: string;
  s3Url: string;
  views: number;
  uploader?: {
    displayName: string;
  };
}

function mapBackendVideo(bv: BackendVideo): Video {
  return {
    id: bv.id,
    title: bv.title,
    description: bv.description,
    channelName: bv.uploader?.displayName || "Unknown Channel",
    views: bv.views || 0,
    thumbnailUrl: bv.s3Url || "/default-thumbnail.jpg",
    src: bv.s3Url,
  };
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await api<BackendVideo[]>(`/api/videos/search?q=${encodeURIComponent(query)}`);
        if (alive) {
          setVideos(results.map(mapBackendVideo));
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Failed to search videos");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [query]);

  if (!query) {
    return (
      <div className={styles.videoGrid}>
        <p>Enter a search query to find videos.</p>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.videoGrid}>Searching for "{query}"...</div>;
  }

  if (error) {
    return (
      <div className={styles.videoGrid}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className={styles.videoGrid}>
        <p>No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ padding: "1rem" }}>Search results for "{query}"</h2>
      <div className={styles.videoGrid}>
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
