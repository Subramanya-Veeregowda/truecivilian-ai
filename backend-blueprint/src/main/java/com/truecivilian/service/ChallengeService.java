package com.truecivilian.service;

import com.truecivilian.model.Challenge;
import com.truecivilian.model.User;
import com.truecivilian.model.UserChallenge;
import com.truecivilian.model.enums.ChallengeType;
import com.truecivilian.model.enums.NotificationType;
import com.truecivilian.repository.ChallengeRepository;
import com.truecivilian.repository.UserChallengeRepository;
import com.truecivilian.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;
    private final XPService xpService;
    private final NotificationService notificationService;

    public ChallengeService(ChallengeRepository challengeRepository,
                            UserChallengeRepository userChallengeRepository,
                            XPService xpService,
                            NotificationService notificationService) {
        this.challengeRepository = challengeRepository;
        this.userChallengeRepository = userChallengeRepository;
        this.xpService = xpService;
        this.notificationService = notificationService;
    }

    @PostConstruct
    public void seedChallenges() {
        if (challengeRepository.count() == 0) {
            List<Challenge> challenges = new ArrayList<>();
            
            // Daily Challenges (Ends in 1 day)
            challenges.add(Challenge.builder()
                    .title("Daily Spotter")
                    .description("Report at least 1 neighborhood issue today.")
                    .challengeType(ChallengeType.REPORT_STREAK)
                    .targetCount(1)
                    .rewardPoints(20)
                    .startDate(LocalDateTime.now().minusHours(2))
                    .endDate(LocalDateTime.now().plusDays(1))
                    .isActive(true)
                    .build());

            challenges.add(Challenge.builder()
                    .title("Daily Auditor")
                    .description("Verify at least 1 reported issue near you.")
                    .challengeType(ChallengeType.VERIFICATION_STREAK)
                    .targetCount(1)
                    .rewardPoints(25)
                    .startDate(LocalDateTime.now().minusHours(2))
                    .endDate(LocalDateTime.now().plusDays(1))
                    .isActive(true)
                    .build());

            // Weekly Challenges (Ends in 7 days)
            challenges.add(Challenge.builder()
                    .title("Neighborhood Guardian")
                    .description("Verify 3 community issues this week to keep the ward secure.")
                    .challengeType(ChallengeType.CLEANUP)
                    .targetCount(3)
                    .rewardPoints(80)
                    .startDate(LocalDateTime.now().minusHours(2))
                    .endDate(LocalDateTime.now().plusDays(7))
                    .isActive(true)
                    .build());

            challenges.add(Challenge.builder()
                    .title("Civic Catalyst")
                    .description("Participate in 5 reports or verifications to fuel community recovery.")
                    .challengeType(ChallengeType.COMMUNITY_DRIVE)
                    .targetCount(5)
                    .rewardPoints(120)
                    .startDate(LocalDateTime.now().minusHours(2))
                    .endDate(LocalDateTime.now().plusDays(7))
                    .isActive(true)
                    .build());

            challengeRepository.saveAll(challenges);
        }
    }

    public List<Map<String, Object>> getChallengesForUser(User user) {
        List<Challenge> activeChallenges = challengeRepository.findByIsActiveTrue();
        List<UserChallenge> userChallenges = userChallengeRepository.findByUserId(user.getId());

        List<Map<String, Object>> result = new ArrayList<>();

        for (Challenge challenge : activeChallenges) {
            Optional<UserChallenge> ucOpt = userChallenges.stream()
                    .filter(uc -> uc.getChallenge().getId().equals(challenge.getId()))
                    .findFirst();

            UserChallenge uc;
            if (ucOpt.isPresent()) {
                uc = ucOpt.get();
            } else {
                // Initialize default empty UserChallenge on demand
                uc = UserChallenge.builder()
                        .user(user)
                        .challenge(challenge)
                        .progressCount(0)
                        .isCompleted(false)
                        .build();
                uc = userChallengeRepository.save(uc);
            }

            Map<String, Object> challengeMap = new HashMap<>();
            challengeMap.put("userChallengeId", uc.getId());
            challengeMap.put("challengeId", challenge.getId());
            challengeMap.put("title", challenge.getTitle());
            challengeMap.put("description", challenge.getDescription());
            challengeMap.put("challengeType", challenge.getChallengeType());
            challengeMap.put("targetCount", challenge.getTargetCount());
            challengeMap.put("progressCount", uc.getProgressCount());
            challengeMap.put("rewardPoints", challenge.getRewardPoints());
            challengeMap.put("isCompleted", uc.getIsCompleted());
            challengeMap.put("completedAt", uc.getCompletedAt());
            challengeMap.put("isExpired", challenge.getEndDate().isBefore(LocalDateTime.now()));
            challengeMap.put("endDate", challenge.getEndDate());

            // Is ready to be claimed: progress reaches target but not yet marked completed/claimed
            boolean isReadyToClaim = uc.getProgressCount() >= challenge.getTargetCount() && !uc.getIsCompleted();
            challengeMap.put("isReadyToClaim", isReadyToClaim);

            result.add(challengeMap);
        }

        return result;
    }

    public Map<String, Object> claimChallengeReward(UUID userChallengeId, User user) {
        UserChallenge uc = userChallengeRepository.findById(userChallengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge tracking not found with id: " + userChallengeId));

        if (!uc.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to claim reward for this challenge");
        }

        if (uc.getIsCompleted()) {
            throw new IllegalStateException("Challenge reward has already been claimed");
        }

        Challenge challenge = uc.getChallenge();
        if (uc.getProgressCount() < challenge.getTargetCount()) {
            throw new IllegalStateException("Challenge requirements are not met yet");
        }

        // Mark as completed
        uc.setIsCompleted(true);
        uc.setCompletedAt(LocalDateTime.now());
        userChallengeRepository.save(uc);

        // Award XP
        xpService.awardXP(user, challenge.getRewardPoints(), "Challenge Completed: " + challenge.getTitle());

        // Notify user
        notificationService.createNotification(
                user,
                "Challenge Completed: " + challenge.getTitle(),
                "Incredible effort! You completed the '" + challenge.getTitle() + "' challenge and claimed +" + challenge.getRewardPoints() + " XP.",
                NotificationType.CHALLENGE_COMPLETED
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("pointsEarned", challenge.getRewardPoints());
        response.put("challengeTitle", challenge.getTitle());
        return response;
    }

    public void incrementChallengeProgress(User user, ChallengeType challengeType, int count) {
        List<UserChallenge> userChallenges = userChallengeRepository.findByUserId(user.getId());
        for (UserChallenge uc : userChallenges) {
            Challenge challenge = uc.getChallenge();
            if (!uc.getIsCompleted() && challenge.getChallengeType().equals(challengeType) && challenge.getIsActive() && challenge.getEndDate().isAfter(LocalDateTime.now())) {
                int nextProgress = uc.getProgressCount() + count;
                uc.setProgressCount(Math.min(nextProgress, challenge.getTargetCount()));
                userChallengeRepository.save(uc);
                
                // If newly met target, send notification
                if (uc.getProgressCount() >= challenge.getTargetCount()) {
                    notificationService.createNotification(
                            user,
                            "Challenge Accomplished: " + challenge.getTitle(),
                            "You have met the goals for '" + challenge.getTitle() + "'. Claim your +" + challenge.getRewardPoints() + " XP now!",
                            NotificationType.CHALLENGE_UPDATE
                    );
                }
            }
        }
    }
}
