package com.truecivilian.repository;

import com.truecivilian.model.Issue;
import com.truecivilian.model.enums.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {
    List<Issue> findByReporterId(UUID reporterId);
    List<Issue> findByStatus(IssueStatus status);
    List<Issue> findByWardCode(String wardCode);
    List<Issue> findByAssignedDepartmentId(UUID departmentId);
    long countByStatus(IssueStatus status);
}
