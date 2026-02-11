package com.andromedia.controller.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ChannelDto(Long id, String displayName, LocalDateTime createdDate, int videoCount, List<VideoSummaryDto> videos) {}
