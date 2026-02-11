package com.andromedia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andromedia.model.User;
import com.andromedia.model.Video;
import com.andromedia.model.WatchHistory;
import com.andromedia.repository.UserRepository;
import com.andromedia.repository.VideoRepository;
import com.andromedia.repository.WatchHistoryRepository;

@Service
public class WatchHistoryService {

    private final WatchHistoryRepository watchHistoryRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;

    public WatchHistoryService(WatchHistoryRepository watchHistoryRepository,
                               UserRepository userRepository,
                               VideoRepository videoRepository) {
        this.watchHistoryRepository = watchHistoryRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
    }

    @Transactional
    public Optional<WatchHistory> recordWatch(String email, Long videoId) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Video> videoOpt = videoRepository.findById(videoId);

        if (userOpt.isEmpty() || videoOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        Video video = videoOpt.get();

        // Remove existing entry for this video so we can move it to the top
        List<WatchHistory> existing = watchHistoryRepository.findByUserIdOrderByWatchedAtDesc(user.getId());
        existing.stream()
            .filter(h -> h.getVideo().getId().equals(videoId))
            .forEach(watchHistoryRepository::delete);

        WatchHistory history = WatchHistory.builder()
            .user(user)
            .video(video)
            .watchedAt(LocalDateTime.now())
            .build();

        return Optional.of(watchHistoryRepository.save(history));
    }

    public List<WatchHistory> getHistory(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        return watchHistoryRepository.findByUserIdOrderByWatchedAtDesc(userOpt.get().getId());
    }

    @Transactional
    public void clearHistory(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(user -> watchHistoryRepository.deleteByUserId(user.getId()));
    }
}
