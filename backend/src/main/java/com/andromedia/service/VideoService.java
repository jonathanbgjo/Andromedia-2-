package com.andromedia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<Video> getAllVideos(){
        return videoRepository.findAllWithUploader();
    }

    @Transactional(readOnly = true)
    public Optional<Video> getVideoById(Long id){
        return videoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Video> searchVideos(String query){
        return videoRepository.searchByKeyword(query);
    }

    @Transactional
    public Video uploadVideo(Video video){
        return videoRepository.save(video);
    }

    @Transactional
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

    @Transactional
    public void deleteVideo(Long id){
        videoRepository.deleteById(id);
    }

    @Transactional
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

    @Transactional
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

    @Transactional(readOnly = true)
    public int getLikeCount(Long videoId) {
        return (int) videoRepository.countLikes(videoId);
    }

    @Transactional(readOnly = true)
    public List<Video> getVideosByUploaderId(Long uploaderId) {
        return videoRepository.findByUploader_Id(uploaderId);
    }

    @Transactional(readOnly = true)
    public long countVideosByUploaderId(Long uploaderId) {
        return videoRepository.countByUploader_Id(uploaderId);
    }

    public VideoSummaryDto toVideoSummaryDto(Video video) {
        int likeCount = (int) videoRepository.countLikes(video.getId());
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
        int likeCount = (int) videoRepository.countLikes(video.getId());
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

    @Transactional(readOnly = true)
    public boolean isLikedByUser(Long videoId, String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return false;
        }
        return videoRepository.existsLike(videoId, userOpt.get().getId());
    }
}
