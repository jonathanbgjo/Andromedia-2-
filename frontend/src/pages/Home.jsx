import VideoCard from "../components/VideoCard/videoCard";
import {useState, useEffect} from 'react'
import styles from './Home.module.css';
import tempVideos from "../data/videos";  // 👈 shared import

//DISPLAYS LIST OF VIDEOCARDS (video previews)
export default function Home(){
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setVideos(tempVideos);
  }, [])

    return (
    <div className={styles.videoGrid}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
    )
}