package com.truecivilian.service;

import com.truecivilian.model.User;
import com.truecivilian.model.UserBadge;
import com.truecivilian.model.UserChallenge;
import com.truecivilian.repository.UserBadgeRepository;
import com.truecivilian.repository.UserChallengeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AchievementService {

    private final UserBadgeRepository userBadgeRepository;
    private final UserChallengeRepository userChallengeRepository;

    public AchievementService(UserBadgeRepository userBadgeRepository, UserChallengeRepository userChallengeRepository) {
        this.userBadgeRepository = userBadgeRepository;
        this.userChallengeRepository = userChallengeRepository;
    }

    public List<Map<String, Object>> getAchievementTimeline(User user) {
        List<Map<String, Object>> timeline = new ArrayList<>();

        // Get earned badges
        List<UserBadge> userBadges = userBadgeRepository.findByUserId(user.getId());
        for (UserBadge ub : userBadges) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", ub.getId());
            item.put("type", "BADGE");
            item.put("title", ub.getBadge().getName());
            item.put("description", ub.getBadge().getDescription());
            item.put("icon", ub.getBadge().getIconUrl());
            item.put("timestamp", ub.getAwardedAt());
            item.put("reward", "Badge unlocked & reputation boost");
            timeline.add(item);
        }

        // Get completed challenges
        List<UserChallenge> userChallenges = userChallengeRepository.findByUserId(user.getId());
        for (UserChallenge uc : userChallenges) {
            if (uc.getIsCompleted()) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", uc.getId());
                item.put("type", "CHALLENGE");
                item.put("title", uc.getChallenge().getTitle());
                item.put("description", uc.getChallenge().getDescription());
                item.put("icon", "lucide-trophy");
                item.put("timestamp", uc.getCompletedAt() != null ? uc.getCompletedAt() : uc.getUpdatedAt());
                item.put("reward", "+" + uc.getChallenge().getRewardPoints() + " XP");
                timeline.add(item);
            }
        }

        // Sort by timestamp descending
        timeline.sort((a, b) -> {
            LocalDateTime ta = (LocalDateTime) a.get("timestamp");
            LocalDateTime tb = (LocalDateTime) b.get("timestamp");
            if (ta == null) return 1;
            if (tb == null) return -1;
            return tb.compareTo(ta);
        });

        return timeline;
    }
}
