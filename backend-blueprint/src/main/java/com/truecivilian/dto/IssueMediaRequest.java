package com.truecivilian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueMediaRequest {
    private String mediaUrl;
    private String cloudinaryPublicId;
    private String mediaType; // e.g. IMAGE, VIDEO, AUDIO, DOCUMENT
    private String caption;
}
