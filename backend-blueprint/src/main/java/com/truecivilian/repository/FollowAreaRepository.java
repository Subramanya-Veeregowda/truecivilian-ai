package com.truecivilian.repository;

import com.truecivilian.model.FollowArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FollowAreaRepository extends JpaRepository<FollowArea, UUID> {
    List<FollowArea> findByUserId(UUID userId);
    List<FollowArea> findByWardCode(String wardCode);
    java.util.Optional<FollowArea> findByUserIdAndWardCode(UUID userId, String wardCode);
    boolean existsByUserIdAndWardCode(UUID userId, String wardCode);
}
