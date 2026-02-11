// src/main/java/com/andromedia/video/VideoController.java
package com.andromedia.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.andromedia.controller.dto.VideoResponseDto;
import com.andromedia.model.User;
import com.andromedia.model.Video;
import com.andromedia.repository.UserRepository;
import com.andromedia.service.VideoService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

  private final VideoService videoService;
  private final UserRepository userRepository;

  public VideoController(VideoService videoService, UserRepository userRepository) {
    this.videoService = videoService;
    this.userRepository = userRepository;
  }

  @GetMapping
  public ResponseEntity<List<VideoResponseDto>> getAllVideos() {
    List<VideoResponseDto> dtos = videoService.getAllVideos().stream()
        .map(videoService::toVideoResponseDto)
        .toList();
    return ResponseEntity.ok(dtos);
  }

  @PostMapping
  public ResponseEntity<?> createVideo(@RequestBody Map<String, String> payload) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    String title = payload.get("title");
    String description = payload.get("description");
    String videoUrl = payload.get("videoUrl");

    if (title == null || title.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Title is required"));
    }
    if (videoUrl == null || videoUrl.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Video URL is required"));
    }

    String userEmail = auth.getName();
    Optional<User> userOpt = userRepository.findByEmail(userEmail);
    if (userOpt.isEmpty()) {
      return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    }

    try {
      Video video = videoService.createVideo(title.trim(), description, videoUrl.trim(), userOpt.get());
      return ResponseEntity.ok(videoService.toVideoResponseDto(video));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<VideoResponseDto> getVideoById(@PathVariable Long id) {
    return videoService.getVideoById(id)
        .map(video -> ResponseEntity.ok(videoService.toVideoResponseDto(video)))
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/search")
  public ResponseEntity<List<VideoResponseDto>> searchVideos(@RequestParam String q) {
    List<VideoResponseDto> results = videoService.searchVideos(q).stream()
        .map(videoService::toVideoResponseDto)
        .toList();
    return ResponseEntity.ok(results);
  }

  @PostMapping("/{id}/like")
  public ResponseEntity<?> likeVideo(@PathVariable Long id) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    String userEmail = auth.getName();
    boolean success = videoService.likeVideo(id, userEmail);

    if (success) {
      Map<String, Object> response = new HashMap<>();
      response.put("liked", true);
      response.put("likeCount", videoService.getLikeCount(id));
      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.badRequest().body(Map.of("error", "Already liked or video not found"));
    }
  }

  @PostMapping("/{id}/unlike")
  public ResponseEntity<?> unlikeVideo(@PathVariable Long id) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    String userEmail = auth.getName();
    boolean success = videoService.unlikeVideo(id, userEmail);

    if (success) {
      Map<String, Object> response = new HashMap<>();
      response.put("liked", false);
      response.put("likeCount", videoService.getLikeCount(id));
      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.badRequest().body(Map.of("error", "Not liked or video not found"));
    }
  }

  @GetMapping("/{id}/like-status")
  public ResponseEntity<?> getLikeStatus(@PathVariable Long id) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    Map<String, Object> response = new HashMap<>();
    response.put("likeCount", videoService.getLikeCount(id));

    if (auth != null && auth.isAuthenticated()) {
      String userEmail = auth.getName();
      response.put("isLiked", videoService.isLikedByUser(id, userEmail));
    } else {
      response.put("isLiked", false);
    }

    return ResponseEntity.ok(response);
  }

  @GetMapping("/secure-ping")
  public ResponseEntity<String> securePing() {
    return ResponseEntity.ok("pong (secure)");
  }
}
