package com.truecivilian.service;

import com.truecivilian.model.Issue;
import com.truecivilian.model.IssueLike;
import com.truecivilian.model.User;
import com.truecivilian.repository.IssueLikeRepository;
import com.truecivilian.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class LikeService {

    private final IssueLikeRepository issueLikeRepository;
    private final IssueRepository issueRepository;

    public LikeService(IssueLikeRepository issueLikeRepository, IssueRepository issueRepository) {
        this.issueLikeRepository = issueLikeRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional
    public Map<String, Object> toggleLike(UUID issueId, User user) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        boolean liked = issueLikeRepository.existsByIssueIdAndUserId(issueId, user.getId());
        Map<String, Object> response = new HashMap<>();

        if (liked) {
            IssueLike like = issueLikeRepository.findByIssueIdAndUserId(issueId, user.getId())
                    .orElseThrow(() -> new IllegalStateException("Like record missing"));
            issueLikeRepository.delete(like);
            
            issue.setUpvoteCount(Math.max(0, issue.getUpvoteCount() - 1));
            issueRepository.save(issue);

            response.put("liked", false);
            response.put("upvoteCount", issue.getUpvoteCount());
            response.put("message", "Issue unliked successfully");
        } else {
            IssueLike like = IssueLike.builder()
                    .issue(issue)
                    .user(user)
                    .build();
            issueLikeRepository.save(like);

            issue.setUpvoteCount(issue.getUpvoteCount() + 1);
            issueRepository.save(issue);

            response.put("liked", true);
            response.put("upvoteCount", issue.getUpvoteCount());
            response.put("message", "Issue liked successfully");
        }

        return response;
    }

    @Transactional(readOnly = true)
    public boolean isLikedByUser(UUID issueId, UUID userId) {
        if (userId == null) return false;
        return issueLikeRepository.existsByIssueIdAndUserId(issueId, userId);
    }
}
