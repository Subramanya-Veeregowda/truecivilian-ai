package com.truecivilian.controller;

import com.truecivilian.dto.CommentRequest;
import com.truecivilian.dto.CommentResponse;
import com.truecivilian.dto.VerificationRequest;
import com.truecivilian.dto.VerificationResponse;
import com.truecivilian.model.Hashtag;
import com.truecivilian.model.User;
import com.truecivilian.repository.HashtagRepository;
import com.truecivilian.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CommunityController {

    private final CommentService commentService;
    private final VerificationService verificationService;
    private final LikeService likeService;
    private final FollowService followService;
    private final ShareService shareService;
    private final HashtagRepository hashtagRepository;

    public CommunityController(
            CommentService commentService,
            VerificationService verificationService,
            LikeService likeService,
            FollowService followService,
            ShareService shareService,
            HashtagRepository hashtagRepository
    ) {
        this.commentService = commentService;
        this.verificationService = verificationService;
        this.likeService = likeService;
        this.followService = followService;
        this.shareService = shareService;
        this.hashtagRepository = hashtagRepository;
    }

    // --- Comments & Replies ---

    @PostMapping("/comments")
    public ResponseEntity<CommentResponse> createComment(
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(commentService.createComment(request, user));
    }

    @GetMapping("/comments/{issueId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable UUID issueId) {
        return ResponseEntity.ok(commentService.getCommentsForIssue(issueId));
    }

    @PostMapping("/comments/{commentId}/reply")
    public ResponseEntity<CommentResponse> createReply(
            @PathVariable UUID commentId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user
    ) {
        String content = body.getOrDefault("content", "");
        if (content.trim().isEmpty()) {
            throw new IllegalArgumentException("Reply content cannot be empty");
        }
        return ResponseEntity.ok(commentService.createReply(commentId, content, user));
    }

    // --- Likes ---

    @PostMapping("/issues/{id}/like")
    public ResponseEntity<Map<String, Object>> likeIssue(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(likeService.toggleLike(id, user));
    }

    // --- Verifications ---

    @PostMapping("/issues/{id}/verify")
    public ResponseEntity<VerificationResponse> verifyIssue(
            @PathVariable UUID id,
            @Valid @RequestBody VerificationRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(verificationService.verifyIssue(id, request, user));
    }

    // --- Sharing ---

    @PostMapping("/issues/{id}/share")
    public ResponseEntity<Map<String, Object>> shareIssue(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user
    ) {
        String platformName = body.getOrDefault("platformName", "Web");
        String sharedUrl = body.getOrDefault("sharedUrl", "");
        return ResponseEntity.ok(shareService.shareIssue(id, platformName, sharedUrl, user));
    }

    // --- Trending Hashtags ---

    @GetMapping("/trending/hashtags")
    public ResponseEntity<List<Map<String, Object>>> getTrendingHashtags() {
        List<Hashtag> trending = hashtagRepository.findTop10ByOrderByUsageCountDesc();
        List<Map<String, Object>> response = trending.stream().map(hashtag -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tag", hashtag.getTag());
            map.put("usageCount", hashtag.getUsageCount());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // --- Following Area & Users ---

    @PostMapping("/follow/area")
    public ResponseEntity<Map<String, Object>> followArea(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user
    ) {
        String wardCode = body.get("wardCode");
        String coordinatesJson = body.get("coordinatesJson");
        if (wardCode == null || wardCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Ward code is required");
        }
        return ResponseEntity.ok(followService.toggleFollowArea(wardCode, coordinatesJson, user));
    }

    @PostMapping("/follow/user")
    public ResponseEntity<Map<String, Object>> followUser(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user
    ) {
        String followedIdStr = body.get("followedId");
        if (followedIdStr == null || followedIdStr.trim().isEmpty()) {
            throw new IllegalArgumentException("Followed user ID is required");
        }
        UUID followedId = UUID.fromString(followedIdStr);
        return ResponseEntity.ok(followService.toggleFollowUser(followedId, user));
    }
}
