package com.andromedia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.andromedia.model.WatchHistory;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    List<WatchHistory> findByUserIdOrderByWatchedAtDesc(Long userId);

    void deleteByUserId(Long userId);

    /** Delete a single user's entry for a video without loading the history. */
    void deleteByUserIdAndVideoId(Long userId, Long videoId);
}
