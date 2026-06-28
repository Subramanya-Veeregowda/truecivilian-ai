package com.truecivilian.dto;

import com.truecivilian.model.AuditLog;
import com.truecivilian.model.PlatformSetting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalIssues;
    private long totalDepartments;
    private long totalCategories;
    private long openIssues;
    private long resolvedIssues;
    private double systemUptimeRatio;
    private double databaseLatencyAvg;
    private List<AuditLogDto> recentActivities;
    private List<PlatformSetting> activeFlags;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditLogDto {
        private String id;
        private String actionName;
        private String details;
        private String username;
        private String timestamp;
    }
}
