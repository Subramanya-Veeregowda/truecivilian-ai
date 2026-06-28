package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorityDashboardResponse {
    private long totalAssigned;
    private long openIssues;
    private long urgentIssues;
    private long resolvedIssues;
    private double avgResolutionTimeDays;
    private long pendingApprovals;
    private List<ActivityDto> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityDto {
        private String id;
        private String description;
        private String timestamp;
        private String type; // E.g., ASSIGNMENT, RESOLUTION, STATUS_UPDATE
        private String reporterName;
        private String issueTitle;
    }
}
