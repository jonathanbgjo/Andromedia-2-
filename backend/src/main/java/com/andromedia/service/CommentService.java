package com.andromedia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andromedia.controller.dto.CommentDto;
import com.andromedia.model.Comment;
import com.andromedia.model.User;
import com.andromedia.model.Video;
import com.andromedia.repository.CommentRepository;
import com.andromedia.repository.UserRepository;
import com.andromedia.repository.VideoRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, VideoRepository videoRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
    }

    /** Map a Comment entity to its safe DTO (no author password/email/roles). */
    private CommentDto toDto(Comment comment) {
        User author = comment.getAuthor();
        CommentDto.Author authorDto = author == null
                ? null
                : new CommentDto.Author(author.getId(), author.getDisplayName());
        return new CommentDto(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                authorDto);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByVideoId(Long videoId) {
        return commentRepository.findByVideoIdOrderByCreatedAtDesc(videoId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public Optional<CommentDto> createComment(Long videoId, String userEmail, String content) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (videoOpt.isEmpty() || userOpt.isEmpty()) {
            return Optional.empty();
        }

        Comment comment = Comment.builder()
                .content(content)
                .author(userOpt.get())
                .video(videoOpt.get())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return Optional.of(toDto(commentRepository.save(comment)));
    }

    @Transactional
    public boolean deleteComment(Long commentId, String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isEmpty()) {
            return false;
        }

        Comment comment = commentOpt.get();
        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return false;
        }

        commentRepository.delete(comment);
        return true;
    }

    @Transactional
    public Optional<CommentDto> updateComment(Long commentId, String userEmail, String newContent) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isEmpty()) {
            return Optional.empty();
        }

        Comment comment = commentOpt.get();
        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return Optional.empty();
        }

        comment.setContent(newContent);
        comment.setUpdatedAt(LocalDateTime.now());
        return Optional.of(toDto(commentRepository.save(comment)));
    }
}
