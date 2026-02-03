package com.andromedia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

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

    public List<Comment> getCommentsByVideoId(Long videoId) {
        return commentRepository.findByVideoIdOrderByCreatedAtDesc(videoId);
    }

    public Optional<Comment> createComment(Long videoId, String userEmail, String content) {
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

        return Optional.of(commentRepository.save(comment));
    }

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

    public Optional<Comment> updateComment(Long commentId, String userEmail, String newContent) {
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
        return Optional.of(commentRepository.save(comment));
    }
}
