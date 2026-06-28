package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResolveIssueRequest {
    private String resolutionNotes;
    private String beforeRepairPhotoUrl;
    private String afterRepairPhotoUrl;
}
