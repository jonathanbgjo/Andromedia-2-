package com.andromedia.controller.dto;

import java.time.LocalDateTime;

public record UserProfileDto(Long id, String displayName, String email, LocalDateTime createdDate, int videoCount) {}
