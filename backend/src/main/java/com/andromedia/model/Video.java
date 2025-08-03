package com.andromedia.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String s3Url;

    @ManyToMany(mappedBy = "likedVideos")
    private List<User> likedBy;

    private Integer views;

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private User uploader;
    
    private LocalDateTime uploadTime;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getS3Url() {
        return s3Url;
    }

    public void setS3Url(String s3Url) {
        this.s3Url = s3Url;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public User getUploader() {
        return uploader;
    }

    public List<User> getLikes() {
        return likedBy;
    }

    public Integer getViews() {
        return views;
    }
}
