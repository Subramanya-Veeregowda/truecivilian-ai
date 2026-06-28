package com.truecivilian.repository;

import com.truecivilian.model.SocialShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SocialShareRepository extends JpaRepository<SocialShare, UUID> {
    List<SocialShare> findByIssueId(UUID issueId);
    List<SocialShare> findByUserId(UUID userId);
}
