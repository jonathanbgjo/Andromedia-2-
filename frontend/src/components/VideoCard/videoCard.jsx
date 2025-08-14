import {Link} from 'react-router-dom'
import styles from './VideoCard.module.css';
export default function VideoCard({video}){
    return (
        <Link to={`/watch/${video.id}`} className={styles.link}>
            <img src="../IMG_9795" alt="" />
            <div>
                <h3>{video.title}</h3>
                <p>{video.channelName}</p>
                <p>{video.views}</p>
            </div>
        </Link>
    )
}