package com.truecivilian.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotBlank(message = "Location address is required")
    @Size(max = 500, message = "Location address cannot exceed 500 characters")
    private String locationAddress;

    private String priority; // IssuePriority as String

    private String severity; // IssueSeverity as String

    @NotBlank(message = "Ward code is required")
    @Size(max = 50, message = "Ward code cannot exceed 50 characters")
    private String wardCode;

    private String category;

    private java.util.List<String> hashtags;

    private java.util.List<IssueMediaRequest> media;

    @Builder.Default
    private Boolean isAnonymous = false;
}
