import { Link, useNavigate } from "react-router-dom";
import styles from "./VideoCard.module.css";
import type { Video } from "../../types/video";

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate();

  if (!video) return null;

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/watch/${video.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.thumbWrap}>
        <img
          className={styles.thumb}
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225'>
                   <rect width='100%' height='100%' fill='#0f1218'/>
                   <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                     fill='#a5afc4' font-family='sans-serif' font-size='16'>No thumbnail</text>
                 </svg>`
              );
          }}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{video.title}</h3>
        <p className={styles.meta}>
          {video.uploader ? (
            <Link
              to={`/channel/${video.uploader.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ color: "inherit" }}
            >
              {video.uploader.displayName}
            </Link>
          ) : (
            video.channelName
          )}{" "}
          • {video.views} views
        </p>
      </div>
    </div>
  );
}
