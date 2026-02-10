package com.andromedia.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andromedia.controller.dto.ChannelDto;
import com.andromedia.controller.dto.VideoSummaryDto;
import com.andromedia.model.User;
import com.andromedia.model.Video;
import com.andromedia.service.UserService;
import com.andromedia.service.VideoService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final VideoService videoService;

    public UserController(UserService userService, VideoService videoService) {
        this.userService = userService;
        this.videoService = videoService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChannelDto> getChannel(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(user -> {
                List<Video> videos = videoService.getVideosByUploaderId(id);
                List<VideoSummaryDto> videoDtos = videos.stream()
                    .map(videoService::toVideoSummaryDto)
                    .toList();
                ChannelDto channel = new ChannelDto(
                    user.getId(),
                    user.getDisplayName(),
                    user.getCreatedDate(),
                    videoDtos.size(),
                    videoDtos
                );
                return ResponseEntity.ok(channel);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/videos")
    public ResponseEntity<List<VideoSummaryDto>> getChannelVideos(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(user -> {
                List<Video> videos = videoService.getVideosByUploaderId(id);
                List<VideoSummaryDto> videoDtos = videos.stream()
                    .map(videoService::toVideoSummaryDto)
                    .toList();
                return ResponseEntity.ok(videoDtos);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
