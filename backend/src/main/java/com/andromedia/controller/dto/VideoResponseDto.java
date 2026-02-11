package com.andromedia.controller.dto;

import java.time.LocalDateTime;

public record VideoResponseDto(Long id, String title, String description, String s3Url, Integer views, LocalDateTime uploadTime, UploaderDto uploader, int likeCount) {}
