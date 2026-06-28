package com.truecivilian.dto;

import com.truecivilian.model.enums.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueMediaResponse {
    private UUID id;
    private String mediaUrl;
    private String cloudinaryPublicId;
    private MediaType mediaType;
    private String caption;
}
