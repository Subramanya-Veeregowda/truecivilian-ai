package com.truecivilian.service;

import com.truecivilian.dto.*;
import com.truecivilian.model.*;
import com.truecivilian.repository.IssueHashtagRepository;
import com.truecivilian.repository.IssueMediaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IssueMapper {

    private final IssueMediaRepository issueMediaRepository;
    private final IssueHashtagRepository issueHashtagRepository;

    public IssueMapper(IssueMediaRepository issueMediaRepository, IssueHashtagRepository issueHashtagRepository) {
        this.issueMediaRepository = issueMediaRepository;
        this.issueHashtagRepository = issueHashtagRepository;
    }

    public IssueResponse toResponse(Issue issue) {
        if (issue == null) {
            return null;
        }

        List<IssueMediaResponse> mediaResponses = issueMediaRepository.findByIssueId(issue.getId()).stream()
                .map(media -> IssueMediaResponse.builder()
                        .id(media.getId())
                        .mediaUrl(media.getMediaUrl())
                        .cloudinaryPublicId(media.getCloudinaryPublicId())
                        .mediaType(media.getMediaType())
                        .caption(media.getCaption())
                        .build())
                .collect(Collectors.toList());

        List<String> hashtags = issueHashtagRepository.findByIssueId(issue.getId()).stream()
                .map(issueHashtag -> issueHashtag.getHashtag().getTag())
                .collect(Collectors.toList());

        return IssueResponse.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .latitude(issue.getLatitude())
                .longitude(issue.getLongitude())
                .locationAddress(issue.getLocationAddress())
                .status(issue.getStatus())
                .priority(issue.getPriority())
                .severity(issue.getSeverity())
                .category(issue.getCategory())
                .wardCode(issue.getWardCode())
                .upvoteCount(issue.getUpvoteCount())
                .downvoteCount(issue.getDownvoteCount())
                .isAnonymous(issue.getIsAnonymous())
                .hashtags(hashtags)
                .media(mediaResponses)
                .reporterId(issue.getReporter() != null ? issue.getReporter().getId() : null)
                .reporterName(issue.getReporter() != null ? (issue.getReporter().getFirstName() + " " + issue.getReporter().getLastName()) : null)
                .assignedDepartmentId(issue.getAssignedDepartment() != null ? issue.getAssignedDepartment().getId() : null)
                .assignedDepartmentName(issue.getAssignedDepartment() != null ? issue.getAssignedDepartment().getName() : null)
                .assignedOfficerId(issue.getAssignedOfficer() != null ? issue.getAssignedOfficer().getId() : null)
                .assignedOfficerName(issue.getAssignedOfficer() != null ? (issue.getAssignedOfficer().getFirstName() + " " + issue.getAssignedOfficer().getLastName()) : null)
                .estimatedCompletionDate(issue.getEstimatedCompletionDate())
                .resolutionNotes(issue.getResolutionNotes())
                .beforeRepairPhotoUrl(issue.getBeforeRepairPhotoUrl())
                .afterRepairPhotoUrl(issue.getAfterRepairPhotoUrl())
                .slaDeadline(issue.getSlaDeadline())
                .isEscalated(issue.getIsEscalated())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .build();
    }
}
