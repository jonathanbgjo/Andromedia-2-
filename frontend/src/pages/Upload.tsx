import { FormEvent, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import styles from "./Upload.module.css";

/** Extract a YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // Covers youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/v/, youtube.com/shorts/
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  // Accept raw 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

interface VideoUploadResponse {
  id: number;
  title: string;
  description?: string;
  s3Url: string;
  views: number;
  uploadTime: string;
  uploader: { id: number; displayName: string } | null;
  likeCount: number;
}

export default function Upload() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive YouTube ID for preview
  const youtubeId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!videoUrl.trim()) {
      setError("Video URL is required.");
      return;
    }
    if (!youtubeId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    try {
      const result = await api<VideoUploadResponse>("/api/videos", {
        method: "POST",
        auth: true,
        body: { title: title.trim(), description: description.trim(), videoUrl: videoUrl.trim() },
      });
      navigate(`/watch/${result.id}`);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className={styles.loginPrompt}>
        <h2>Sign in to upload</h2>
        <p>You need to be logged in to upload videos.</p>
        <Link className={styles.loginLink} to="/login">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.uploadPage}>
      <h1 className={styles.heading}>Upload Video</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="upload-title">Title *</label>
          <input
            id="upload-title"
            className={styles.input}
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="upload-desc">Description</label>
          <textarea
            id="upload-desc"
            className={styles.textarea}
            placeholder="Enter video description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Video URL */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="upload-url">YouTube URL *</label>
          <input
            id="upload-url"
            className={styles.input}
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
        </div>

        {/* YouTube preview */}
        {youtubeId && (
          <div className={styles.previewSection}>
            <span className={styles.previewLabel}>Preview</span>
            <div className={styles.previewWrap}>
              <iframe
                className={styles.previewIframe}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Submit */}
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
