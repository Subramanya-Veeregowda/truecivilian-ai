package com.truecivilian.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hashtags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hashtag extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String tag;

    @Column(name = "usage_count", nullable = false)
    @Builder.Default
    private Integer usageCount = 0;
}
