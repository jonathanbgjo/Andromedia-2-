package com.andromedia.controller.dto;

import java.time.LocalDateTime;

/**
 * Response shape for a comment. Deliberately excludes the author's password
 * hash, email, roles, and JPA relationship collections — never serialize the
 * User entity directly.
 */
public record CommentDto(
        Long id,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Author author
) {
    public record Author(Long id, String displayName) {}
}
