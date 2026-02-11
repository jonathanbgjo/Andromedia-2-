package com.andromedia.controller.dto;

import java.time.LocalDateTime;

public record VideoSummaryDto(Long id, String title, String description, String s3Url, Integer views, LocalDateTime uploadTime, int likeCount) {}
