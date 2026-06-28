package com.truecivilian.repository;

import com.truecivilian.model.IssueMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueMediaRepository extends JpaRepository<IssueMedia, UUID> {
    List<IssueMedia> findByIssueId(UUID issueId);
}
