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
@Table(name = "follow_areas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowArea extends BaseEntity {

    @Column(name = "ward_code", nullable = false, length = 50)
    private String wardCode;

    @Column(name = "coordinates_json", columnDefinition = "TEXT")
    private String coordinatesJson;

    @Column(name = "followed_at", nullable = false)
    @Builder.Default
    private LocalDateTime followedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
