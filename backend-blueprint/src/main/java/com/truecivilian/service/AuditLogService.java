package com.truecivilian.service;

import com.truecivilian.model.AuditLog;
import com.truecivilian.model.User;
import com.truecivilian.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void logAction(String actionName, String details, User user) {
        AuditLog auditLog = AuditLog.builder()
                .actionName(actionName)
                .details(details)
                .user(user)
                .timestamp(LocalDateTime.now())
                .ipAddress("127.0.0.1") // Simple mock IP
                .build();
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }
}
