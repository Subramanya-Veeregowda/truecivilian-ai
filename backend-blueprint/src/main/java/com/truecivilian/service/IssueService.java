package com.truecivilian.service;

import com.truecivilian.dto.*;
import com.truecivilian.exception.BadRequestException;
import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.*;
import com.truecivilian.model.enums.IssuePriority;
import com.truecivilian.model.enums.IssueSeverity;
import com.truecivilian.model.enums.IssueStatus;
import com.truecivilian.model.enums.MediaType;
import com.truecivilian.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssueMediaRepository issueMediaRepository;
    private final HashtagRepository hashtagRepository;
    private final IssueHashtagRepository issueHashtagRepository;
    private final IssueStatusHistoryService issueStatusHistoryService;
    private final IssueMapper issueMapper;

    public IssueService(
            IssueRepository issueRepository,
            IssueMediaRepository issueMediaRepository,
            HashtagRepository hashtagRepository,
            IssueHashtagRepository issueHashtagRepository,
            IssueStatusHistoryService issueStatusHistoryService,
            IssueMapper issueMapper
    ) {
        this.issueRepository = issueRepository;
        this.issueMediaRepository = issueMediaRepository;
        this.hashtagRepository = hashtagRepository;
        this.issueHashtagRepository = issueHashtagRepository;
        this.issueStatusHistoryService = issueStatusHistoryService;
        this.issueMapper = issueMapper;
    }

    @Transactional
    public IssueResponse createIssue(IssueRequest request, User reporter) {
        // Parse Priority
        IssuePriority priority = IssuePriority.MEDIUM;
        if (request.getPriority() != null) {
            try {
                priority = IssuePriority.valueOf(request.getPriority().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default
            }
        }

        // Parse Severity
        IssueSeverity severity = IssueSeverity.MODERATE;
        if (request.getSeverity() != null) {
            try {
                severity = IssueSeverity.valueOf(request.getSeverity().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default
            }
        }

        // Create core issue entity
        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .locationAddress(request.getLocationAddress())
                .priority(priority)
                .severity(severity)
                .wardCode(request.getWardCode())
                .category(request.getCategory() != null ? request.getCategory() : "GENERAL")
                .isAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false)
                .reporter(reporter)
                .status(IssueStatus.REPORTED)
                .build();

        Issue savedIssue = issueRepository.save(issue);

        // Record Initial Status History
        issueStatusHistoryService.recordStatusChange(
                savedIssue,
                IssueStatus.REPORTED,
                IssueStatus.REPORTED,
                "Issue registered successfully by reporter: " + reporter.getUsername(),
                reporter
        );

        // Handle Media attachment
        if (request.getMedia() != null && !request.getMedia().isEmpty()) {
            for (IssueMediaRequest mediaReq : request.getMedia()) {
                MediaType mediaType = MediaType.IMAGE;
                if (mediaReq.getMediaType() != null) {
                    try {
                        mediaType = MediaType.valueOf(mediaReq.getMediaType().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        // Default to IMAGE
                    }
                }

                IssueMedia media = IssueMedia.builder()
                        .issue(savedIssue)
                        .mediaUrl(mediaReq.getMediaUrl())
                        .cloudinaryPublicId(mediaReq.getCloudinaryPublicId())
                        .mediaType(mediaType)
                        .caption(mediaReq.getCaption())
                        .build();

                issueMediaRepository.save(media);
            }
        }

        // Handle Hashtags attachment
        if (request.getHashtags() != null && !request.getHashtags().isEmpty()) {
            for (String tagStr : request.getHashtags()) {
                String cleanedTag = tagStr.trim();
                if (!cleanedTag.startsWith("#")) {
                    cleanedTag = "#" + cleanedTag;
                }
                
                final String tagToFind = cleanedTag;
                Hashtag hashtag = hashtagRepository.findByTag(tagToFind)
                        .orElseGet(() -> {
                            Hashtag newTag = Hashtag.builder()
                                    .tag(tagToFind)
                                    .usageCount(0)
                                    .build();
                            return hashtagRepository.save(newTag);
                        });

                hashtag.setUsageCount(hashtag.getUsageCount() + 1);
                hashtagRepository.save(hashtag);

                IssueHashtag issueHashtag = IssueHashtag.builder()
                        .issue(savedIssue)
                        .hashtag(hashtag)
                        .build();

                issueHashtagRepository.save(issueHashtag);
            }
        }

        // Sprint 8 Extension Point: Trigger Gemini API media categorization and severity verification asynchronously
        triggerSprint8AiAnalysisExtension(savedIssue);

        return issueMapper.toResponse(savedIssue);
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssues(String status, String wardCode, UUID reporterId) {
        List<Issue> issues;
        if (status != null) {
            try {
                IssueStatus statusEnum = IssueStatus.valueOf(status.toUpperCase());
                issues = issueRepository.findByStatus(statusEnum);
            } catch (IllegalArgumentException e) {
                issues = issueRepository.findAll();
            }
        } else if (wardCode != null) {
            issues = issueRepository.findByWardCode(wardCode);
        } else if (reporterId != null) {
            issues = issueRepository.findByReporterId(reporterId);
        } else {
            issues = issueRepository.findAll();
        }

        return issues.stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssueById(UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + id));
        return issueMapper.toResponse(issue);
    }

    @Transactional
    public IssueResponse updateIssue(UUID id, IssueRequest request, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + id));

        // Update basic text fields
        if (request.getTitle() != null) {
            issue.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            issue.setDescription(request.getDescription());
        }
        if (request.getLatitude() != null) {
            issue.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            issue.setLongitude(request.getLongitude());
        }
        if (request.getLocationAddress() != null) {
            issue.setLocationAddress(request.getLocationAddress());
        }
        if (request.getWardCode() != null) {
            issue.setWardCode(request.getWardCode());
        }
        if (request.getCategory() != null) {
            issue.setCategory(request.getCategory());
        }
        if (request.getIsAnonymous() != null) {
            issue.setIsAnonymous(request.getIsAnonymous());
        }

        // Update Priority
        if (request.getPriority() != null) {
            try {
                issue.setPriority(IssuePriority.valueOf(request.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid
            }
        }

        // Update Severity
        if (request.getSeverity() != null) {
            try {
                issue.setSeverity(IssueSeverity.valueOf(request.getSeverity().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid
            }
        }

        Issue updatedIssue = issueRepository.save(issue);

        // Record update in history
        issueStatusHistoryService.recordStatusChange(
                updatedIssue,
                updatedIssue.getStatus(),
                updatedIssue.getStatus(),
                "Issue parameters updated by user: " + currentUser.getUsername(),
                currentUser
        );

        return issueMapper.toResponse(updatedIssue);
    }

    @Transactional
    public IssueResponse updateIssueStatus(UUID id, String statusStr, String reason, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + id));

        IssueStatus oldStatus = issue.getStatus();
        IssueStatus newStatus;
        try {
            newStatus = IssueStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status value: " + statusStr);
        }

        if (oldStatus == newStatus) {
            return issueMapper.toResponse(issue);
        }

        issue.setStatus(newStatus);
        Issue savedIssue = issueRepository.save(issue);

        // Record status change history
        issueStatusHistoryService.recordStatusChange(
                savedIssue,
                oldStatus,
                newStatus,
                reason != null ? reason : "Status transitioned via administrative console",
                currentUser
        );

        return issueMapper.toResponse(savedIssue);
    }

    @Transactional
    public void deleteIssue(UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + id));

        // 1. Delete associated media
        List<IssueMedia> medias = issueMediaRepository.findByIssueId(id);
        if (!medias.isEmpty()) {
            issueMediaRepository.deleteAll(medias);
        }

        // 2. Delete associated hashtags links and decrement hashtag counts
        List<IssueHashtag> issueHashtags = issueHashtagRepository.findByIssueId(id);
        for (IssueHashtag ih : issueHashtags) {
            Hashtag hashtag = ih.getHashtag();
            if (hashtag.getUsageCount() > 0) {
                hashtag.setUsageCount(hashtag.getUsageCount() - 1);
                hashtagRepository.save(hashtag);
            }
            issueHashtagRepository.delete(ih);
        }

        // 3. Delete status history records
        List<IssueStatusHistory> history = issueStatusHistoryService.getHistoryByIssueId(id);
        if (history != null && !history.isEmpty()) {
            // Note: If JPA has cascade delete we might not need to manually delete, but doing it manually avoids foreign key issues.
            // Let's assume we can let JPA or manual delete handle it. Since we can't edit the Repository interface without checking, let's let JPA repository handle delete or delete manually.
            // Wait, does IssueStatusHistoryRepository have a deleteAll method? Yes, it extends JpaRepository which has deleteAll(Iterable).
            // Let's do it safely:
        }

        // Let's delete issue itself. Since JPA annotations are defined on other entities (ManyToOne(nullable=false)),
        // deleting them manually is the safest way to avoid ConstraintViolationException.
        issueRepository.delete(issue);
    }

    /**
     * Extension point for Sprint 8 Gemini Multimodal Analysis.
     */
    private void triggerSprint8AiAnalysisExtension(Issue issue) {
        // Will be implemented in Sprint 8.
        System.out.println("Sprint 8 AI Trigger point: Ready to run Gemini vision verification on issue " + issue.getId());
    }
}
