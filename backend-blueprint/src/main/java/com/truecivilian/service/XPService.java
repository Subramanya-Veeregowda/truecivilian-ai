package com.truecivilian.service;

import com.truecivilian.model.User;
import com.truecivilian.model.enums.NotificationType;
import com.truecivilian.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class XPService {

    private final UserRepository userRepository;
    private final BadgeService badgeService;
    private final NotificationService notificationService;

    public XPService(UserRepository userRepository, BadgeService badgeService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.badgeService = badgeService;
        this.notificationService = notificationService;
    }

    public User awardXP(User user, int amount, String reason) {
        int previousPoints = user.getPoints();
        int newPoints = previousPoints + amount;
        user.setPoints(newPoints);
        
        // Update reputation score proportionally
        double previousRep = user.getReputationScore() != null ? user.getReputationScore() : 0.0;
        user.setReputationScore(previousRep + (amount * 0.1));

        User savedUser = userRepository.save(user);

        // Notify user about XP earned
        notificationService.createNotification(
                savedUser,
                "XP Earned!",
                "You earned +" + amount + " XP for: " + reason,
                NotificationType.SUCCESS
        );

        // Check and award badges
        badgeService.checkAndAwardBadges(savedUser);

        // Check if user leveled up
        int prevLevel = (previousPoints / 100) + 1;
        int nextLevel = (newPoints / 100) + 1;
        if (nextLevel > prevLevel) {
            notificationService.createNotification(
                    savedUser,
                    "Level Up!",
                    "Fantastic job! You've advanced to Level " + nextLevel + "!",
                    NotificationType.CHALLENGE_UPDATE
            );
        }

        return savedUser;
    }

    public Map<String, Object> getXPProfile(User user) {
        int totalPoints = user.getPoints();
        int level = (totalPoints / 100) + 1;
        int currentXP = totalPoints % 100;
        int nextLevelXP = 100;

        Map<String, Object> profile = new HashMap<>();
        profile.put("userId", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("points", totalPoints);
        profile.put("level", level);
        profile.put("currentXP", currentXP);
        profile.put("nextLevelXP", nextLevelXP);
        profile.put("reputationScore", user.getReputationScore());
        
        return profile;
    }
}
