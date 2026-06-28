package com.truecivilian.repository;

import com.truecivilian.model.IssueHashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueHashtagRepository extends JpaRepository<IssueHashtag, UUID> {
    List<IssueHashtag> findByIssueId(UUID issueId);
    List<IssueHashtag> findByHashtagId(UUID hashtagId);
}
