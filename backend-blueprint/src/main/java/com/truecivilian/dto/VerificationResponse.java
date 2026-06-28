package com.truecivilian.dto;

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
public class VerificationResponse {
    private UUID id;
    private UUID issueId;
    private UUID volunteerId;
    private String volunteerName;
    private Boolean isApproved;
    private String verificationNotes;
    private Double latitude;
    private Double longitude;
    private String onSitePhotoUrl;
    private LocalDateTime createdAt;
}
