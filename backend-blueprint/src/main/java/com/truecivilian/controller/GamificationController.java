package com.truecivilian.controller;

import com.truecivilian.model.User;
import com.truecivilian.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    private final XPService xpService;
    private final LeaderboardService leaderboardService;
    private final BadgeService badgeService;
    private final ChallengeService challengeService;
    private final AchievementService achievementService;

    public GamificationController(XPService xpService,
                                  LeaderboardService leaderboardService,
                                  BadgeService badgeService,
                                  ChallengeService challengeService,
                                  AchievementService achievementService) {
        this.xpService = xpService;
        this.leaderboardService = leaderboardService;
        this.badgeService = badgeService;
        this.challengeService = challengeService;
        this.achievementService = achievementService;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal User user) {
        Map<String, Object> profile = xpService.getXPProfile(user);
        
        // Include unified achievement timeline and badge count
        profile.put("achievements", achievementService.getAchievementTimeline(user));
        profile.put("badgesEarnedCount", badgeService.getUserBadges(user).size());
        
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }

    @GetMapping("/badges")
    public ResponseEntity<Map<String, Object>> getBadges(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("allBadges", badgeService.getAllBadges());
        response.put("userBadges", badgeService.getUserBadges(user));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/challenges")
    public ResponseEntity<List<Map<String, Object>>> getChallenges(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(challengeService.getChallengesForUser(user));
    }

    @PostMapping("/claim")
    public ResponseEntity<Map<String, Object>> claimReward(
            @RequestParam(required = false) UUID userChallengeId,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User user
    ) {
        UUID id = userChallengeId;
        if (id == null && body != null && body.containsKey("userChallengeId")) {
            id = UUID.fromString(body.get("userChallengeId"));
        }
        if (id == null && body != null && body.containsKey("id")) {
            id = UUID.fromString(body.get("id"));
        }
        if (id == null) {
            throw new IllegalArgumentException("userChallengeId or id is required to claim challenge");
        }
        return ResponseEntity.ok(challengeService.claimChallengeReward(id, user));
    }
}
