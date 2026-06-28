package com.truecivilian.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRequest {

    @NotNull(message = "Issue ID is required")
    private UUID issueId;

    @NotNull(message = "Approval decision is required")
    private Boolean isApproved;

    private String verificationNotes;

    @NotNull(message = "Verification latitude is required")
    private Double latitude;

    @NotNull(message = "Verification longitude is required")
    private Double longitude;

    private String onSitePhotoUrl;
}
