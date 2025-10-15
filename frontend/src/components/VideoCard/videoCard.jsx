// src/components/VideoCard/VideoCard.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./VideoCard.module.css";
// import thumb from "../../assets/thumb-1.jpg"; // example static import

export default function VideoCard({ video }) {
  if (!video) return <div>Loading…</div>;
  const thumb = `${video.thumbnailUrl}${video.thumbnailUrl.includes('?') ? '&' : '?'}sig=${video.id}`;

  return (
    <Link to={`/watch/${video.id}`} className={styles.card}>
      <img
          src={thumb}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            // simple fallback if Unsplash fails
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225'>
                   <rect width='100%' height='100%' fill='#111'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#aaa' font-family='sans-serif' font-size='16'>No thumbnail</text>
                 </svg>`
              );
          }}
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
