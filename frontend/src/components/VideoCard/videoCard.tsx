import { Link, useNavigate } from "react-router-dom";
import styles from "./VideoCard.module.css";
import type { Video } from "../../types/video";
import Avatar from "../Avatar/Avatar";
import { formatViews, timeAgo } from "../../util/format";

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate();

  if (!video) return null;

  const channelName = video.uploader?.displayName ?? video.channelName;
  const views = formatViews(video.views);
  const published = timeAgo(video.publishedAt);

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
        {video.duration && <span className={styles.duration}>{video.duration}</span>}
      </div>

      <div className={styles.info}>
        <Link
          to={video.uploader ? `/channel/${video.uploader.id}` : "#"}
          onClick={(e) => e.stopPropagation()}
          className={styles.avatarLink}
          aria-label={channelName}
        >
          <Avatar name={channelName} src={video.uploader?.avatarUrl ?? video.avatarUrl} size={36} />
        </Link>

        <div className={styles.body}>
          <h3 className={styles.title}>{video.title}</h3>
          {video.uploader ? (
            <Link
              to={`/channel/${video.uploader.id}`}
              onClick={(e) => e.stopPropagation()}
              className={styles.channel}
            >
              {channelName}
            </Link>
          ) : (
            <span className={styles.channel}>{channelName}</span>
          )}
          <p className={styles.meta}>
            {views}
            {views && published && <span className={styles.dot}> • </span>}
            {published}
          </p>
        </div>
      </div>
    </div>
  );
}
