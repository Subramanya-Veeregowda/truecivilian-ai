package com.truecivilian.repository;

import com.truecivilian.model.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, UUID> {
    Optional<Hashtag> findByTag(String tag);
    java.util.List<Hashtag> findTop10ByOrderByUsageCountDesc();
}
