package com.truecivilian.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_shares")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialShare extends BaseEntity {

    @Column(name = "platform_name", nullable = false, length = 100)
    private String platformName;

    @Column(name = "shared_url", nullable = false, length = 1000)
    private String sharedUrl;

    @Column(name = "shared_at", nullable = false)
    @Builder.Default
    private LocalDateTime sharedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;
}
