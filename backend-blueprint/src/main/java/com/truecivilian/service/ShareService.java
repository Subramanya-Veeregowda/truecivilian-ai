package com.truecivilian.service;

import com.truecivilian.model.Issue;
import com.truecivilian.model.SocialShare;
import com.truecivilian.model.User;
import com.truecivilian.repository.IssueRepository;
import com.truecivilian.repository.SocialShareRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ShareService {

    private final SocialShareRepository socialShareRepository;
    private final IssueRepository issueRepository;

    public ShareService(SocialShareRepository socialShareRepository, IssueRepository issueRepository) {
        this.socialShareRepository = socialShareRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional
    public Map<String, Object> shareIssue(UUID issueId, String platformName, String sharedUrl, User user) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        SocialShare share = SocialShare.builder()
                .platformName(platformName)
                .sharedUrl(sharedUrl != null ? sharedUrl : "")
                .issue(issue)
                .user(user)
                .sharedAt(LocalDateTime.now())
                .build();

        socialShareRepository.save(share);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged share to " + platformName + " successfully");
        response.put("shareId", share.getId());
        return response;
    }
}
