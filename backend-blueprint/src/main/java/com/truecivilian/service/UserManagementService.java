package com.truecivilian.service;

import com.truecivilian.exception.BadRequestException;
import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.Role;
import com.truecivilian.model.User;
import com.truecivilian.model.enums.UserRole;
import com.truecivilian.repository.RoleRepository;
import com.truecivilian.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;

    public UserManagementService(UserRepository userRepository, RoleRepository roleRepository, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserRole(UUID userId, String roleName, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            UserRole targetRole = UserRole.valueOf(roleName.toUpperCase());
            Role role = roleRepository.findByName(targetRole)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found in database: " + targetRole));

            user.getRoles().clear();
            user.getRoles().add(role);
            User saved = userRepository.save(user);

            auditLogService.logAction(
                    "UPDATE_USER_ROLE",
                    "Updated role of user " + user.getUsername() + " to " + roleName,
                    adminUser
            );

            return saved;
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role name: " + roleName);
        }
    }

    @Transactional
    public User updateUserStatus(UUID userId, boolean isEnabled, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIsEnabled(isEnabled);
        User saved = userRepository.save(user);

        auditLogService.logAction(
                "UPDATE_USER_STATUS",
                "Updated status of user " + user.getUsername() + " to " + (isEnabled ? "ENABLED" : "DISABLED"),
                adminUser
        );

        return saved;
    }
}
