package com.andromedia.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andromedia.model.User;
import com.andromedia.service.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/{channelId}/subscribe")
    public ResponseEntity<?> subscribe(@PathVariable Long channelId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            String userEmail = auth.getName();
            subscriptionService.subscribe(userEmail, channelId);
            return ResponseEntity.ok(Map.of("subscribed", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{channelId}/unsubscribe")
    public ResponseEntity<?> unsubscribe(@PathVariable Long channelId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            String userEmail = auth.getName();
            subscriptionService.unsubscribe(userEmail, channelId);
            return ResponseEntity.ok(Map.of("subscribed", false));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{channelId}/status")
    public ResponseEntity<?> getSubscriptionStatus(@PathVariable Long channelId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String userEmail = auth.getName();
        boolean subscribed = subscriptionService.isSubscribed(userEmail, channelId);
        return ResponseEntity.ok(Map.of("subscribed", subscribed));
    }

    @GetMapping("/{channelId}/count")
    public ResponseEntity<?> getSubscriberCount(@PathVariable Long channelId) {
        int count = subscriptionService.getSubscriberCount(channelId);
        return ResponseEntity.ok(Map.of("subscriberCount", count));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMySubscriptions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String userEmail = auth.getName();
        List<User> subscriptions = subscriptionService.getSubscriptions(userEmail);

        List<Map<String, Object>> channels = subscriptions.stream()
                .map(user -> Map.<String, Object>of(
                        "id", user.getId(),
                        "displayName", user.getDisplayName() != null ? user.getDisplayName() : user.getUsername()
                ))
                .toList();

        return ResponseEntity.ok(channels);
    }
}
