package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeminiResponse {
    private boolean isValid;
    private String validationError;
    private String category;
    private double categoryConfidence;
    private String title;
    private double titleConfidence;
    private String description;
    private double descriptionConfidence;
    private String severity;
    private double severityConfidence;
    private String priority;
    private double priorityConfidence;
    private String department;
    private double departmentConfidence;
    private double overallConfidence;
    
    private boolean isDuplicate;
    private double duplicateSimilarity;
    private String duplicateIssueId;
    private String duplicateRecommendation;
}
