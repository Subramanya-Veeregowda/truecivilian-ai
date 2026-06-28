package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemHealthResponse {
    private String status; // UP, DEGRADED, MAINTENANCE
    private double databaseLatencyMs;
    private double geminiLatencyMs;
    private long totalDbConnections;
    private long activeSessions;
    private Map<String, Object> jvmMetrics;
    private Map<String, Long> apiUsageStats;
}
