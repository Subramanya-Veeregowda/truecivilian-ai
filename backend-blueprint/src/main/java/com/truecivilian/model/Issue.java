package com.truecivilian.model;

import com.truecivilian.model.enums.IssuePriority;
import com.truecivilian.model.enums.IssueSeverity;
import com.truecivilian.model.enums.IssueStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "location_address", nullable = false, length = 500)
    private String locationAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssueStatus status = IssueStatus.REPORTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssuePriority priority = IssuePriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssueSeverity severity = IssueSeverity.MODERATE;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "ward_code", nullable = false, length = 50)
    private String wardCode;

    @Column(name = "upvote_count", nullable = false)
    @Builder.Default
    private Integer upvoteCount = 0;

    @Column(name = "downvote_count", nullable = false)
    @Builder.Default
    private Integer downvoteCount = 0;

    @Column(name = "is_anonymous", nullable = false)
    @Builder.Default
    private Boolean isAnonymous = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_department_id")
    private Department assignedDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(name = "estimated_completion_date")
    private java.time.LocalDateTime estimatedCompletionDate;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "before_repair_photo_url", length = 500)
    private String beforeRepairPhotoUrl;

    @Column(name = "after_repair_photo_url", length = 500)
    private String afterRepairPhotoUrl;

    @Column(name = "sla_deadline")
    private java.time.LocalDateTime slaDeadline;

    @Column(name = "is_escalated", nullable = false)
    @Builder.Default
    private Boolean isEscalated = false;
}
