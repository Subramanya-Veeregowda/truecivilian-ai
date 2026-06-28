package com.truecivilian.service;

import com.truecivilian.model.Issue;
import com.truecivilian.model.IssueStatusHistory;
import com.truecivilian.model.User;
import com.truecivilian.model.enums.IssueStatus;
import com.truecivilian.repository.IssueStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class IssueStatusHistoryService {

    private final IssueStatusHistoryRepository repository;

    public IssueStatusHistoryService(IssueStatusHistoryRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public IssueStatusHistory recordStatusChange(Issue issue, IssueStatus oldStatus, IssueStatus newStatus, String reason, User changedBy) {
        IssueStatusHistory history = IssueStatusHistory.builder()
                .issue(issue)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .statusChangeReason(reason != null ? reason : "Status updated from " + oldStatus + " to " + newStatus)
                .changedBy(changedBy)
                .changedAt(LocalDateTime.now())
                .build();
        return repository.save(history);
    }

    @Transactional(readOnly = true)
    public List<IssueStatusHistory> getHistoryByIssueId(UUID issueId) {
        return repository.findByIssueId(issueId);
    }
}
