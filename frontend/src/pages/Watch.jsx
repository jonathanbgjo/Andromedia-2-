//contains the player, title/description and eventually comments

import { useParams } from "react-router-dom";
import tempVideos from "../data/videos";  // 👈 shared import

import {useState, useEffect} from 'react'
import styles from './Watch.module.css';

export default function Watch(){
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [showMore, setShowMore] = useState(false);
     useEffect(() => {
    const found = tempVideos.find((v) => v.id === id);
    setVideo(found);
  }, [id]);

    if (!video) {
        return <div>Loading...</div>;
    }   
    return (
        <div className={styles.videoContainer}>
            <div className={styles.videoPlayer}>
                <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"             
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className={styles.videoDetails}>
                <h2>{video.title}</h2>
                <p>{video.channelName} • {video.views} views</p>
                <p>{video.description}</p>
            </div>
            <div className={styles.commentsSection}>
                <h3>Comments</h3>
                <p>Comments will be displayed here.</p>
            </div>
        </div>
    )
}