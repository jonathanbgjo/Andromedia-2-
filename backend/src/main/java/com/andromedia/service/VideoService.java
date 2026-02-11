package com.andromedia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.andromedia.controller.dto.UploaderDto;
import com.andromedia.controller.dto.VideoResponseDto;
import com.andromedia.controller.dto.VideoSummaryDto;
import com.andromedia.model.User;
import com.andromedia.model.Video;
import com.andromedia.repository.UserRepository;
import com.andromedia.repository.VideoRepository;

@Service
public class VideoService {
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public VideoService(VideoRepository videoRepository, UserRepository userRepository){
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }

    public List<Video> getAllVideos(){
        return videoRepository.findAll();
    }

    public Optional<Video> getVideoById(Long id){
        return videoRepository.findById(id);
    }

    public List<Video> searchVideos(String query){
        return videoRepository.searchByKeyword(query);
    }

    public Video uploadVideo(Video video){
        return videoRepository.save(video);
    }

    public Video createVideo(String title, String description, String videoUrl, User uploader) {
        String youtubeId = extractYouTubeId(videoUrl);
        if (youtubeId == null) {
            throw new IllegalArgumentException("Invalid YouTube URL");
        }

        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setS3Url(youtubeId);
        video.setUploader(uploader);
        video.setUploadTime(LocalDateTime.now());
        video.setViews(0);

        return videoRepository.save(video);
    }

    /**
     * Extract YouTube video ID from various URL formats:
     * - https://www.youtube.com/watch?v=VIDEO_ID
     * - https://youtu.be/VIDEO_ID
     * - https://www.youtube.com/embed/VIDEO_ID
     * - https://www.youtube.com/v/VIDEO_ID
     * - https://youtube.com/shorts/VIDEO_ID
     */
    public String extractYouTubeId(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }

        // Pattern covers youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/v/, youtube.com/shorts/
        Pattern pattern = Pattern.compile(
            "(?:https?://)?(?:www\\.)?(?:youtube\\.com/(?:watch\\?.*v=|embed/|v/|shorts/)|youtu\\.be/)([a-zA-Z0-9_-]{11})"
        );
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }

        // If the input is already just an 11-character video ID
        if (url.matches("^[a-zA-Z0-9_-]{11}$")) {
            return url;
        }

        return null;
    }

    public void deleteVideo(Long id){
        videoRepository.deleteById(id);
    }

    public boolean likeVideo(Long videoId, String userEmail) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (videoOpt.isEmpty() || userOpt.isEmpty()) {
            return false;
        }

        Video video = videoOpt.get();
        User user = userOpt.get();

        if (user.getLikedVideos() == null) {
            user.setLikedVideos(new java.util.ArrayList<>());
        }

        if (!user.getLikedVideos().contains(video)) {
            user.getLikedVideos().add(video);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean unlikeVideo(Long videoId, String userEmail) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (videoOpt.isEmpty() || userOpt.isEmpty()) {
            return false;
        }

        Video video = videoOpt.get();
        User user = userOpt.get();

        if (user.getLikedVideos() != null && user.getLikedVideos().contains(video)) {
            user.getLikedVideos().remove(video);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public int getLikeCount(Long videoId) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        if (videoOpt.isEmpty()) {
            return 0;
        }
        Video video = videoOpt.get();
        return video.getLikes() != null ? video.getLikes().size() : 0;
    }

    public List<Video> getVideosByUploaderId(Long uploaderId) {
        return videoRepository.findByUploader_Id(uploaderId);
    }

    public VideoSummaryDto toVideoSummaryDto(Video video) {
        int likeCount = video.getLikes() != null ? video.getLikes().size() : 0;
        return new VideoSummaryDto(
            video.getId(),
            video.getTitle(),
            video.getDescription(),
            video.getS3Url(),
            video.getViews(),
            video.getUploadTime(),
            likeCount
        );
    }

    public VideoResponseDto toVideoResponseDto(Video video) {
        int likeCount = video.getLikes() != null ? video.getLikes().size() : 0;
        UploaderDto uploaderDto = null;
        if (video.getUploader() != null) {
            uploaderDto = new UploaderDto(video.getUploader().getId(), video.getUploader().getDisplayName());
        }
        return new VideoResponseDto(
            video.getId(),
            video.getTitle(),
            video.getDescription(),
            video.getS3Url(),
            video.getViews(),
            video.getUploadTime(),
            uploaderDto,
            likeCount
        );
    }

    public boolean isLikedByUser(Long videoId, String userEmail) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (videoOpt.isEmpty() || userOpt.isEmpty()) {
            return false;
        }

        Video video = videoOpt.get();
        User user = userOpt.get();

        return user.getLikedVideos() != null && user.getLikedVideos().contains(video);
    }
}
