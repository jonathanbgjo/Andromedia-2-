// src/components/VideoCard/VideoCard.jsx
import { Link } from "react-router-dom";
import styles from "./VideoCard.module.css";
// import thumb from "../../assets/thumb-1.jpg"; // example static import

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className={styles.card}>
      <img
        src={video.thumbnailUrl || "/placeholder-thumb.jpg"}
        alt={video.title || "Video"}
        className={styles.thumb}
      />
      <div className={styles.body}>
        <h3 className={styles.title}>{video.title}</h3>
        <p className={styles.meta}>
          {video.channelName} • {video.views} views
        </p>
      </div>
    </Link>
  );
}
