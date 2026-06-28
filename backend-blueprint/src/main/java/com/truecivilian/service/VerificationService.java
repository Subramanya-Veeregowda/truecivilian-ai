package com.truecivilian.service;

import com.truecivilian.dto.VerificationRequest;
import com.truecivilian.dto.VerificationResponse;
import com.truecivilian.model.Issue;
import com.truecivilian.model.User;
import com.truecivilian.model.Verification;
import com.truecivilian.repository.IssueRepository;
import com.truecivilian.repository.VerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final IssueRepository issueRepository;

    public VerificationService(VerificationRepository verificationRepository, IssueRepository issueRepository) {
        this.verificationRepository = verificationRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional
    public VerificationResponse verifyIssue(UUID issueId, VerificationRequest request, User volunteer) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        Verification verification = Verification.builder()
                .isApproved(request.getIsApproved())
                .verificationNotes(request.getVerificationNotes())
                .latitude(request.getLatitude() != null ? request.getLatitude() : issue.getLatitude())
                .longitude(request.getLongitude() != null ? request.getLongitude() : issue.getLongitude())
                .onSitePhotoUrl(request.getOnSitePhotoUrl())
                .issue(issue)
                .volunteer(volunteer)
                .build();

        Verification saved = verificationRepository.save(verification);

        // Update issue counts on verification
        if (Boolean.TRUE.equals(request.getIsApproved())) {
            issue.setUpvoteCount(issue.getUpvoteCount() + 1);
        } else {
            issue.setDownvoteCount(issue.getDownvoteCount() + 1);
        }
        issueRepository.save(issue);

        return toResponse(saved);
    }

    private VerificationResponse toResponse(Verification verification) {
        return VerificationResponse.builder()
                .id(verification.getId())
                .issueId(verification.getIssue().getId())
                .volunteerId(verification.getVolunteer().getId())
                .volunteerName(verification.getVolunteer().getFirstName() + " " + verification.getVolunteer().getLastName())
                .isApproved(verification.getIsApproved())
                .verificationNotes(verification.getVerificationNotes())
                .latitude(verification.getLatitude())
                .longitude(verification.getLongitude())
                .onSitePhotoUrl(verification.getOnSitePhotoUrl())
                .createdAt(verification.getCreatedAt())
                .build();
    }
}
