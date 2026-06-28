package com.truecivilian.repository;

import com.truecivilian.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, UUID> {
    List<Verification> findByIssueId(UUID issueId);
    List<Verification> findByVolunteerId(UUID volunteerId);
}
