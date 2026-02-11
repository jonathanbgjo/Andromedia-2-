package com.andromedia.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andromedia.controller.dto.VideoSummaryDto;
import com.andromedia.model.WatchHistory;
import com.andromedia.service.VideoService;
import com.andromedia.service.WatchHistoryService;

@RestController
@RequestMapping("/api/history")
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;
    private final VideoService videoService;

    public WatchHistoryController(WatchHistoryService watchHistoryService, VideoService videoService) {
        this.watchHistoryService = watchHistoryService;
        this.videoService = videoService;
    }

    @PostMapping("/{videoId}")
    public ResponseEntity<?> recordWatch(@PathVariable Long videoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String userEmail = auth.getName();
        return watchHistoryService.recordWatch(userEmail, videoId)
            .map(h -> ResponseEntity.ok(Map.of("message", "Watch recorded")))
            .orElse(ResponseEntity.badRequest().body(Map.of("error", "Failed to record watch")));
    }

    @GetMapping
    public ResponseEntity<?> getHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String userEmail = auth.getName();
        List<WatchHistory> history = watchHistoryService.getHistory(userEmail);

        List<Map<String, Object>> result = history.stream()
            .map(h -> {
                VideoSummaryDto videoDto = videoService.toVideoSummaryDto(h.getVideo());
                return Map.<String, Object>of(
                    "id", h.getId(),
                    "videoId", h.getVideo().getId(),
                    "watchedAt", h.getWatchedAt().toString(),
                    "video", videoDto
                );
            })
            .toList();

        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<?> clearHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String userEmail = auth.getName();
        watchHistoryService.clearHistory(userEmail);
        return ResponseEntity.ok(Map.of("message", "History cleared"));
    }
}
