package com.truecivilian.dto;

import com.truecivilian.model.enums.IssuePriority;
import com.truecivilian.model.enums.IssueSeverity;
import com.truecivilian.model.enums.IssueStatus;
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
public class IssueResponse {
    private UUID id;
    private String title;
    private String description;
    private Double latitude;
    private Double longitude;
    private String locationAddress;
    private IssueStatus status;
    private IssuePriority priority;
    private IssueSeverity severity;
    private String wardCode;
    private Integer upvoteCount;
    private Integer downvoteCount;
    private Boolean isAnonymous;
    private String category;
    private java.util.List<String> hashtags;
    private java.util.List<IssueMediaResponse> media;
    private UUID reporterId;
    private String reporterName;
    private UUID assignedDepartmentId;
    private String assignedDepartmentName;
    private UUID assignedOfficerId;
    private String assignedOfficerName;
    private LocalDateTime estimatedCompletionDate;
    private String resolutionNotes;
    private String beforeRepairPhotoUrl;
    private String afterRepairPhotoUrl;
    private LocalDateTime slaDeadline;
    private Boolean isEscalated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
