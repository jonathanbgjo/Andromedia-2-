package com.andromedia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andromedia.model.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long>{
        List<Video> findByUploaderUsername(String username);
        List<Video> findByUserId(Long userId); 
        List<Video> searchByTitle(@Param("keyword") String keyword);
}
