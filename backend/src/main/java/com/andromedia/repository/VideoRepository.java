package com.andromedia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andromedia.model.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long>{
        List<Video> findByUploaderUsername(String username);
        List<Video> findByUploader_Id(Long uploaderId);

        /** Count uploads without loading the Video rows. */
        long countByUploader_Id(Long uploaderId);

        @Query("SELECT v FROM Video v WHERE LOWER(v.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Video> searchByKeyword(@Param("keyword") String keyword);

        /** Feed load with the uploader eagerly fetched in one query (avoids N+1). */
        @Query("SELECT v FROM Video v LEFT JOIN FETCH v.uploader")
        List<Video> findAllWithUploader();

        /** Like count via COUNT — never hydrates the liker collection. */
        @Query("SELECT COUNT(u) FROM Video v JOIN v.likedBy u WHERE v.id = :videoId")
        long countLikes(@Param("videoId") Long videoId);

        /** Membership check via COUNT — never hydrates the liker collection. */
        @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Video v JOIN v.likedBy u WHERE v.id = :videoId AND u.id = :userId")
        boolean existsLike(@Param("videoId") Long videoId, @Param("userId") Long userId);
}
