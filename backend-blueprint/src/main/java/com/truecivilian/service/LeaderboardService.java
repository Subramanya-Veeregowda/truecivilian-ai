package com.truecivilian.service;

import com.truecivilian.model.User;
import com.truecivilian.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class LeaderboardService {

    private final UserRepository userRepository;

    public LeaderboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> getLeaderboard() {
        // Find top 50 users by points
        List<User> topUsers = userRepository.findAll(
                PageRequest.of(0, 50, Sort.by(Sort.Direction.DESC, "points"))
        ).getContent();

        List<Map<String, Object>> leaderboard = new ArrayList<>();
        int rank = 1;
        for (User user : topUsers) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", rank++);
            entry.put("userId", user.getId());
            entry.put("username", user.getUsername());
            entry.put("firstName", user.getFirstName());
            entry.put("lastName", user.getLastName());
            entry.put("points", user.getPoints());
            entry.put("reputationScore", user.getReputationScore() != null ? user.getReputationScore() : 0.0);
            
            // Derive level from points
            int level = (user.getPoints() / 100) + 1;
            entry.put("level", level);
            
            leaderboard.add(entry);
        }
        return leaderboard;
    }
}
