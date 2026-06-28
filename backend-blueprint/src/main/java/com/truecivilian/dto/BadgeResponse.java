package com.truecivilian.dto;

import com.truecivilian.model.enums.BadgeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadgeResponse {
    private UUID id;
    private String name;
    private String description;
    private String iconUrl;
    private BadgeType badgeType;
    private Integer pointsRequired;
}
