package com.truecivilian.service;

import com.truecivilian.dto.CommentRequest;
import com.truecivilian.dto.CommentResponse;
import com.truecivilian.model.Comment;
import com.truecivilian.model.Issue;
import com.truecivilian.model.User;
import com.truecivilian.repository.CommentRepository;
import com.truecivilian.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;

    public CommentService(CommentRepository commentRepository, IssueRepository issueRepository) {
        this.commentRepository = commentRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional
    public CommentResponse createComment(CommentRequest request, User user) {
        Issue issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .isFlagged(false)
                .issue(issue)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    @Transactional
    public CommentResponse createReply(UUID commentId, String content, User user) {
        Comment parent = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));

        Comment reply = Comment.builder()
                .content(content)
                .isFlagged(false)
                .issue(parent.getIssue())
                .user(user)
                .parentComment(parent)
                .build();

        Comment saved = commentRepository.save(reply);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForIssue(UUID issueId) {
        return commentRepository.findByIssueId(issueId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .isFlagged(comment.getIsFlagged())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getFirstName() + " " + comment.getUser().getLastName())
                .issueId(comment.getIssue().getId())
                .parentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
