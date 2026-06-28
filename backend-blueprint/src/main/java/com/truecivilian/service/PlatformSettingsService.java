package com.truecivilian.service;

import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.PlatformSetting;
import com.truecivilian.model.User;
import com.truecivilian.repository.PlatformSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlatformSettingsService {

    private final PlatformSettingRepository settingRepository;
    private final AuditLogService auditLogService;

    public PlatformSettingsService(PlatformSettingRepository settingRepository, AuditLogService auditLogService) {
        this.settingRepository = settingRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public List<PlatformSetting> getAllSettings() {
        List<PlatformSetting> current = settingRepository.findAll();
        if (current.isEmpty()) {
            // Seed defaults
            return seedDefaultSettings();
        }
        return current;
    }

    @Transactional
    public PlatformSetting getSettingByKey(String key) {
        return settingRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Platform setting not found for key: " + key));
    }

    @Transactional
    public PlatformSetting updateSetting(String key, String value, User adminUser) {
        PlatformSetting setting = settingRepository.findByKey(key)
                .orElseGet(() -> PlatformSetting.builder()
                        .key(key)
                        .group(determineGroup(key))
                        .description("Dynamically configured system setting")
                        .build());

        String oldValue = setting.getValue();
        setting.setValue(value);
        PlatformSetting saved = settingRepository.save(setting);

        auditLogService.logAction(
                "UPDATE_PLATFORM_SETTING",
                "Updated platform setting: " + key + " from '" + oldValue + "' to '" + value + "'",
                adminUser
        );

        return saved;
    }

    @Transactional
    public List<PlatformSetting> seedDefaultSettings() {
        List<PlatformSetting> defaults = new ArrayList<>();

        defaults.add(createSetting("ai.prompt.triage", 
                "Identify category, prioritize severity (LOW, MEDIUM, HIGH, CRITICAL) and evaluate hazardous risk of municipal incidents.", 
                "Prompt template used by Gemini to triage incoming civic issues.", "AI"));
        
        defaults.add(createSetting("gemini.model.name", "gemini-1.5-flash", "Gemini Model Alias to route intelligence requests to.", "GEMINI"));
        defaults.add(createSetting("gemini.api.key.active", "true", "Whether server side LLM pipeline is operational.", "GEMINI"));
        
        defaults.add(createSetting("feature.social_sharing", "true", "Allow citizens to cross-post incidents onto external social circles.", "FEATURE_FLAG"));
        defaults.add(createSetting("feature.anonymous_reporting", "true", "Allows citizens to submit civic logs anonymously.", "FEATURE_FLAG"));
        defaults.add(createSetting("feature.automated_assignment", "false", "If enabled, auto-dispatches issues to departmental staff.", "FEATURE_FLAG"));
        
        defaults.add(createSetting("announcement.message", "Platform upgrades scheduled: Database schema stabilization Sunday at 02:00 UTC.", "Text banner showcased system-wide to logged-in users.", "ANNOUNCEMENT"));
        defaults.add(createSetting("announcement.enabled", "true", "Controls visibility of the broadcast alert banner.", "ANNOUNCEMENT"));
        
        defaults.add(createSetting("system.maintenance_mode", "false", "Put entire site in maintenance lockdown state.", "SYSTEM"));
        defaults.add(createSetting("system.rate_limit_per_min", "100", "Maximum API invocations per minute for non-admin accounts.", "SYSTEM"));

        return settingRepository.saveAll(defaults);
    }

    private PlatformSetting createSetting(String key, String val, String desc, String group) {
        return PlatformSetting.builder()
                .key(key)
                .value(val)
                .description(desc)
                .group(group)
                .build();
    }

    private String determineGroup(String key) {
        if (key.startsWith("ai.")) return "AI";
        if (key.startsWith("gemini.")) return "GEMINI";
        if (key.startsWith("feature.")) return "FEATURE_FLAG";
        if (key.startsWith("announcement.")) return "ANNOUNCEMENT";
        return "SYSTEM";
    }
}
