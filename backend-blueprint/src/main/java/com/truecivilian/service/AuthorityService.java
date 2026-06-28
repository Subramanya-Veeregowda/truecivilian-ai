package com.truecivilian.service;

import com.truecivilian.dto.IssueResponse;
import com.truecivilian.dto.UpdateStatusRequest;
import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.Issue;
import com.truecivilian.model.User;
import com.truecivilian.model.enums.IssueStatus;
import com.truecivilian.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthorityService {

    private final IssueRepository issueRepository;
    private final IssueStatusHistoryService issueStatusHistoryService;
    private final IssueMapper issueMapper;

    public AuthorityService(
            IssueRepository issueRepository,
            IssueStatusHistoryService issueStatusHistoryService,
            IssueMapper issueMapper
    ) {
        this.issueRepository = issueRepository;
        this.issueStatusHistoryService = issueStatusHistoryService;
        this.issueMapper = issueMapper;
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssues(User currentUser) {
        List<Issue> issues = issueRepository.findAll();
        return issues.stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public IssueResponse updateIssueStatus(UUID id, UpdateStatusRequest request, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        IssueStatus oldStatus = issue.getStatus();
        IssueStatus newStatus = IssueStatus.valueOf(request.getStatus().toUpperCase());

        issue.setStatus(newStatus);
        Issue saved = issueRepository.save(issue);

        issueStatusHistoryService.recordStatusChange(
                saved,
                oldStatus,
                newStatus,
                request.getReason() != null ? request.getReason() : "Status updated by authority: " + currentUser.getUsername(),
                currentUser
        );

        return issueMapper.toResponse(saved);
    }
}
