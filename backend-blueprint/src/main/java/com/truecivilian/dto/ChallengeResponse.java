package com.truecivilian.dto;

import com.truecivilian.model.enums.ChallengeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeResponse {
    private UUID id;
    private String title;
    private String description;
    private ChallengeType challengeType;
    private Integer targetCount;
    private Integer rewardPoints;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}
