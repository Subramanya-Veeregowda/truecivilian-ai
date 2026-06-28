package com.truecivilian.controller;

import com.truecivilian.dto.*;
import com.truecivilian.model.AuditLog;
import com.truecivilian.model.PlatformSetting;
import com.truecivilian.model.User;
import com.truecivilian.service.*;
import com.truecivilian.exception.BadRequestException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserManagementService userManagementService;
    private final DepartmentManagementService departmentManagementService;
    private final CategoryManagementService categoryManagementService;
    private final AuditLogService auditLogService;
    private final SystemHealthService systemHealthService;
    private final PlatformSettingsService platformSettingsService;

    public AdminController(
            AdminService adminService,
            UserManagementService userManagementService,
            DepartmentManagementService departmentManagementService,
            CategoryManagementService categoryManagementService,
            AuditLogService auditLogService,
            SystemHealthService systemHealthService,
            PlatformSettingsService platformSettingsService
    ) {
        this.adminService = adminService;
        this.userManagementService = userManagementService;
        this.departmentManagementService = departmentManagementService;
        this.categoryManagementService = categoryManagementService;
        this.auditLogService = auditLogService;
        this.systemHealthService = systemHealthService;
        this.platformSettingsService = platformSettingsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable UUID id,
            @RequestParam(required = false) String role,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User adminUser
    ) {
        String roleName = role != null ? role : (body != null ? body.get("role") : null);
        if (roleName == null) {
            throw new BadRequestException("Role is required");
        }
        return ResponseEntity.ok(userManagementService.updateUserRole(id, roleName, adminUser));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable UUID id,
            @RequestParam(required = false) Boolean enabled,
            @RequestBody(required = false) Map<String, Boolean> body,
            @AuthenticationPrincipal User adminUser
    ) {
        Boolean isEnabled = enabled != null ? enabled : (body != null ? body.get("enabled") : null);
        if (isEnabled == null) {
            throw new BadRequestException("Enabled status is required");
        }
        return ResponseEntity.ok(userManagementService.updateUserStatus(id, isEnabled, adminUser));
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentManagementService.getAllDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentRequest request,
            @AuthenticationPrincipal User adminUser
    ) {
        return ResponseEntity.ok(departmentManagementService.createDepartment(request, adminUser));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable UUID id,
            @Valid @RequestBody DepartmentRequest request,
            @AuthenticationPrincipal User adminUser
    ) {
        return ResponseEntity.ok(departmentManagementService.updateDepartment(id, request, adminUser));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Map<String, String>> deleteDepartment(
            @PathVariable UUID id,
            @AuthenticationPrincipal User adminUser
    ) {
        departmentManagementService.deleteDepartment(id, adminUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Department deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryManagementService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(
            @Valid @RequestBody CategoryDto dto,
            @AuthenticationPrincipal User adminUser
    ) {
        return ResponseEntity.ok(categoryManagementService.createCategory(dto, adminUser));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryDto dto,
            @AuthenticationPrincipal User adminUser
    ) {
        return ResponseEntity.ok(categoryManagementService.updateCategory(id, dto, adminUser));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(
            @PathVariable UUID id,
            @AuthenticationPrincipal User adminUser
    ) {
        categoryManagementService.deleteCategory(id, adminUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Category deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllAuditLogs());
    }

    @GetMapping("/system-health")
    public ResponseEntity<SystemHealthResponse> getSystemHealth() {
        return ResponseEntity.ok(systemHealthService.getSystemHealth());
    }

    @PutMapping("/settings")
    public ResponseEntity<PlatformSetting> updateSetting(
            @RequestParam(required = false) String key,
            @RequestParam(required = false) String value,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User adminUser
    ) {
        String k = key != null ? key : (body != null ? body.get("key") : null);
        String v = value != null ? value : (body != null ? body.get("value") : null);
        if (k == null) {
            throw new BadRequestException("Setting key is required");
        }
        return ResponseEntity.ok(platformSettingsService.updateSetting(k, v, adminUser));
    }
}
