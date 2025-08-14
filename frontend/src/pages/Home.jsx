import VideoCard from "../components/VideoCard/videoCard";
import {useState, useEffect} from 'react'
//DISPLAYS LIST OF VIDEOCARDS (video previews)
export default function Home(){
    
    const [videos, setVideos] = useState([]);
    const tempVideos = [
        {id: "1",
        channelName: "testOne",
        views: "44"},
        {id: "2",
        channelName: "testTwo",
        views: "1234"},
        {id: "3",
        channelName: "testTree",
        views: "565"},
        {id: "5",
        channelName: "testFour",
        views: "13341"},
    ]
    useEffect(() => {
        setVideos(tempVideos);
    }

    )
    return (
        <div>
            <div>
                {videos.map((video)=> (
                    <VideoCard key={video.id} video={video}/>
                ))}
            </div>
        </div>
    )
}