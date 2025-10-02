//contains the player, title/description and eventually comments


import {useState, useEffect} from 'react'
import styles from './Watch.module.css';

export default function Watch(){
    const [video, setVideo] = useState(null);
    const tempVideo = {id: "1", title: "test video", channelName: "testOne", views: "44", description: "this is a test description"};

    useEffect(() => {
        setVideo(tempVideo);
    }, [])

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