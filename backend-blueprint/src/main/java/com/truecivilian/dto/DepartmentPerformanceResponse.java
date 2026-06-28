package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentPerformanceResponse {
    private UUID departmentId;
    private String departmentName;
    private int activeBacklog;
    private int resolvedCount;
    private double resolutionRate; // percentage
    private double averageResolutionTimeHours;
    private double slaComplianceRate; // percentage
    private int overdueCount;
}
