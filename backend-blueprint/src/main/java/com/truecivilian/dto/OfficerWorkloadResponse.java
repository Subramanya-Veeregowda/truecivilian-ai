package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficerWorkloadResponse {
    private UUID officerId;
    private String officerName;
    private String officerRole;
    private int activeAssignmentsCount;
    private int completedCount;
    private double efficiencyRating; // percentage or score
    private List<BriefIssueDto> assignedIssues;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BriefIssueDto {
        private UUID id;
        private String title;
        private String status;
        private String priority;
        private String wardCode;
        private String category;
    }
}
