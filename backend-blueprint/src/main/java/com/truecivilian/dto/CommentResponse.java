package com.truecivilian.dto;

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
public class CommentResponse {
    private UUID id;
    private String content;
    private Boolean isFlagged;
    private UUID userId;
    private String username;
    private UUID issueId;
    private UUID parentId;
    private LocalDateTime createdAt;
}
