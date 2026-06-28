package com.truecivilian.service;

import com.truecivilian.model.FollowArea;
import com.truecivilian.model.FollowUser;
import com.truecivilian.model.User;
import com.truecivilian.repository.FollowAreaRepository;
import com.truecivilian.repository.FollowUserRepository;
import com.truecivilian.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FollowService {

    private final FollowAreaRepository followAreaRepository;
    private final FollowUserRepository followUserRepository;
    private final UserRepository userRepository;

    public FollowService(
            FollowAreaRepository followAreaRepository,
            FollowUserRepository followUserRepository,
            UserRepository userRepository
    ) {
        this.followAreaRepository = followAreaRepository;
        this.followUserRepository = followUserRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, Object> toggleFollowArea(String wardCode, String coordinatesJson, User user) {
        boolean followed = followAreaRepository.existsByUserIdAndWardCode(user.getId(), wardCode);
        Map<String, Object> response = new HashMap<>();

        if (followed) {
            FollowArea followArea = followAreaRepository.findByUserIdAndWardCode(user.getId(), wardCode)
                    .orElseThrow(() -> new IllegalStateException("Follow area record missing"));
            followAreaRepository.delete(followArea);

            response.put("followed", false);
            response.put("message", "Stopped following ward: " + wardCode);
        } else {
            FollowArea followArea = FollowArea.builder()
                    .wardCode(wardCode)
                    .coordinatesJson(coordinatesJson != null ? coordinatesJson : "{}")
                    .user(user)
                    .followedAt(LocalDateTime.now())
                    .build();
            followAreaRepository.save(followArea);

            response.put("followed", true);
            response.put("message", "Started following ward: " + wardCode);
        }

        return response;
    }

    @Transactional
    public Map<String, Object> toggleFollowUser(UUID followedId, User user) {
        if (followedId.equals(user.getId())) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        User followedUser = userRepository.findById(followedId)
                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

        boolean followed = followUserRepository.existsByFollowerIdAndFollowedId(user.getId(), followedId);
        Map<String, Object> response = new HashMap<>();

        if (followed) {
            FollowUser followUser = followUserRepository.findByFollowerIdAndFollowedId(user.getId(), followedId)
                    .orElseThrow(() -> new IllegalStateException("Follow record missing"));
            followUserRepository.delete(followUser);

            response.put("followed", false);
            response.put("message", "Unfollowed user: " + followedUser.getFirstName() + " " + followedUser.getLastName());
        } else {
            FollowUser followUser = FollowUser.builder()
                    .follower(user)
                    .followed(followedUser)
                    .followedAt(LocalDateTime.now())
                    .build();
            followUserRepository.save(followUser);

            response.put("followed", true);
            response.put("message", "Followed user: " + followedUser.getFirstName() + " " + followedUser.getLastName());
        }

        return response;
    }
}
