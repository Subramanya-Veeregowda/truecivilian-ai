package com.truecivilian.repository;

import com.truecivilian.model.PlatformSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformSettingRepository extends JpaRepository<PlatformSetting, UUID> {
    Optional<PlatformSetting> findByKey(String key);
    List<PlatformSetting> findByGroup(String group);
}
