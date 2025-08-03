package com.andromedia.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.andromedia.model.Video;
import com.andromedia.repository.VideoRepository;

@Service
public class VideoService {
    private final VideoRepository videoRepository;

    public VideoService(VideoRepository videoRepository){
        this.videoRepository = videoRepository;
    }
    
    public List<Video> getAllVideos(){
        return videoRepository.findAll();
    }

    public Video uploadVideo(Video video){
        return videoRepository.save(video);
    }

    public void deleteVideo(Long id){
        videoRepository.deleteById(id);
    }
}
