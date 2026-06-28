package com.truecivilian.repository;

import com.truecivilian.model.IssueStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, UUID> {
    List<IssueStatusHistory> findByIssueId(UUID issueId);
}
