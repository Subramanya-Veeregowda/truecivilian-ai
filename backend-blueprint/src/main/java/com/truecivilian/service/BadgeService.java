package com.truecivilian.service;

import com.truecivilian.model.Badge;
import com.truecivilian.model.User;
import com.truecivilian.model.UserBadge;
import com.truecivilian.model.enums.BadgeType;
import com.truecivilian.model.enums.NotificationType;
import com.truecivilian.repository.BadgeRepository;
import com.truecivilian.repository.UserBadgeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final NotificationService notificationService;

    public BadgeService(BadgeRepository badgeRepository,
                        UserBadgeRepository userBadgeRepository,
                        NotificationService notificationService) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.notificationService = notificationService;
    }

    @PostConstruct
    public void seedBadges() {
        if (badgeRepository.count() == 0) {
            List<Badge> badges = new ArrayList<>();
            badges.add(Badge.builder()
                    .name("Eagle Eye Reporter")
                    .description("Awarded for filing high-quality municipal reports.")
                    .badgeType(BadgeType.REPORTER)
                    .pointsRequired(50)
                    .iconUrl("lucide-eye")
                    .build());
            badges.add(Badge.builder()
                    .name("Truth Seeker Verifier")
                    .description("Awarded for validating civic complaints in the community.")
                    .badgeType(BadgeType.VERIFIER)
                    .pointsRequired(100)
                    .iconUrl("lucide-check-circle")
                    .build());
            badges.add(Badge.builder()
                    .name("Civic Dynamo")
                    .description("Awarded for showing exceptional positive impact and community coordination.")
                    .badgeType(BadgeType.IMPACT_PIONEER)
                    .pointsRequired(200)
                    .iconUrl("lucide-zap")
                    .build());
            badges.add(Badge.builder()
                    .name("Green Warden")
                    .description("Awarded for actively resolving sustainability and sanitation challenges.")
                    .badgeType(BadgeType.SUSTAINABILITY_CHAMPION)
                    .pointsRequired(300)
                    .iconUrl("lucide-leaf")
                    .build());
            badges.add(Badge.builder()
                    .name("District Guardian")
                    .description("The highest award for district-wide representation and heroic contribution.")
                    .badgeType(BadgeType.WARD_HERO)
                    .pointsRequired(500)
                    .iconUrl("lucide-shield-check")
                    .build());
            badgeRepository.saveAll(badges);
        }
    }

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    public List<UserBadge> getUserBadges(User user) {
        return userBadgeRepository.findByUserId(user.getId());
    }

    public List<Badge> checkAndAwardBadges(User user) {
        List<Badge> allBadges = getAllBadges();
        List<UserBadge> userBadges = getUserBadges(user);
        
        Set<String> earnedBadgeNames = userBadges.stream()
                .map(ub -> ub.getBadge().getName())
                .collect(Collectors.toSet());

        List<Badge> newlyAwarded = new ArrayList<>();

        for (Badge badge : allBadges) {
            if (!earnedBadgeNames.contains(badge.getName()) && user.getPoints() >= badge.getPointsRequired()) {
                UserBadge ub = UserBadge.builder()
                        .user(user)
                        .badge(badge)
                        .awardedAt(LocalDateTime.now())
                        .build();
                userBadgeRepository.save(ub);
                newlyAwarded.add(badge);

                // Create a notification for the earned badge
                notificationService.createNotification(
                        user,
                        "Badge Earned: " + badge.getName(),
                        "Congratulations! You have earned the '" + badge.getName() + "' badge for reaching " + badge.getPointsRequired() + " XP points.",
                        NotificationType.BADGE_EARNED
                );
            }
        }
        return newlyAwarded;
    }
}
