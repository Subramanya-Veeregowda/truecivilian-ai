package com.truecivilian.repository;

import com.truecivilian.model.IssueLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IssueLikeRepository extends JpaRepository<IssueLike, UUID> {
    Optional<IssueLike> findByIssueIdAndUserId(UUID issueId, UUID userId);
    boolean existsByIssueIdAndUserId(UUID issueId, UUID userId);
}
