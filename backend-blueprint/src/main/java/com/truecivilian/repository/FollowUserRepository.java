package com.truecivilian.repository;

import com.truecivilian.model.FollowUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FollowUserRepository extends JpaRepository<FollowUser, UUID> {
    List<FollowUser> findByFollowerId(UUID followerId);
    List<FollowUser> findByFollowedId(UUID followedId);
    boolean existsByFollowerIdAndFollowedId(UUID followerId, UUID followedId);
    java.util.Optional<FollowUser> findByFollowerIdAndFollowedId(UUID followerId, UUID followedId);
}
