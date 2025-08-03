package com.andromedia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.andromedia.model.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long>{
    
}
