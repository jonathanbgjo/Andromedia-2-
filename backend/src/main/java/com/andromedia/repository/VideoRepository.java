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

        @Query("SELECT v FROM Video v WHERE LOWER(v.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Video> searchByKeyword(@Param("keyword") String keyword);
}
