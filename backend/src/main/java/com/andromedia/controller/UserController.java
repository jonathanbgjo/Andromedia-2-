package com.andromedia.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andromedia.controller.dto.ChannelDto;
import com.andromedia.controller.dto.UserProfileDto;
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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String userEmail = auth.getName();
        return userService.getUserByEmail(userEmail)
            .map(user -> {
                List<Video> videos = videoService.getVideosByUploaderId(user.getId());
                UserProfileDto profile = new UserProfileDto(
                    user.getId(),
                    user.getDisplayName(),
                    user.getEmail(),
                    user.getCreatedDate(),
                    videos.size()
                );
                return ResponseEntity.ok(profile);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, String> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String displayName = payload.get("displayName");
        if (displayName == null || displayName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Display name is required"));
        }

        String userEmail = auth.getName();
        return userService.getUserByEmail(userEmail)
            .map(user -> {
                user.setDisplayName(displayName.trim());
                userService.saveUser(user);
                List<Video> videos = videoService.getVideosByUploaderId(user.getId());
                UserProfileDto profile = new UserProfileDto(
                    user.getId(),
                    user.getDisplayName(),
                    user.getEmail(),
                    user.getCreatedDate(),
                    videos.size()
                );
                return ResponseEntity.ok(profile);
            })
            .orElse(ResponseEntity.notFound().build());
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
