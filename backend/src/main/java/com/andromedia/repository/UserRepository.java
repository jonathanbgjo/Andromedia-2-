package com.andromedia.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andromedia.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u JOIN u.subscribedTo c WHERE c.id = :channelId")
    int countSubscribers(@Param("channelId") Long channelId);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u JOIN u.subscribedTo c WHERE u.id = :userId AND c.id = :channelId")
    boolean isSubscribed(@Param("userId") Long userId, @Param("channelId") Long channelId);
}
