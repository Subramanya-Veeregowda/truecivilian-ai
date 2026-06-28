package com.truecivilian.service;

import com.truecivilian.dto.DepartmentRequest;
import com.truecivilian.dto.DepartmentResponse;
import com.truecivilian.exception.BadRequestException;
import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.Department;
import com.truecivilian.model.User;
import com.truecivilian.model.enums.DepartmentType;
import com.truecivilian.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DepartmentManagementService {

    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;

    public DepartmentManagementService(DepartmentRepository departmentRepository, AuditLogService auditLogService) {
        this.departmentRepository = departmentRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request, User adminUser) {
        if (departmentRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Department with this name already exists");
        }

        DepartmentType type;
        try {
            type = DepartmentType.valueOf(request.getDepartmentType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid department type: " + request.getDepartmentType());
        }

        Department department = Department.builder()
                .name(request.getName())
                .departmentType(type)
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .headOfDepartment(request.getHeadOfDepartment())
                .build();

        Department saved = departmentRepository.save(department);

        auditLogService.logAction(
                "CREATE_DEPARTMENT",
                "Created department: " + saved.getName() + " of type " + saved.getDepartmentType(),
                adminUser
        );

        return mapToResponse(saved);
    }

    @Transactional
    public DepartmentResponse updateDepartment(UUID id, DepartmentRequest request, User adminUser) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        departmentRepository.findByName(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Department with this name already exists");
            }
        });

        DepartmentType type;
        try {
            type = DepartmentType.valueOf(request.getDepartmentType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid department type: " + request.getDepartmentType());
        }

        department.setName(request.getName());
        department.setDepartmentType(type);
        department.setContactEmail(request.getContactEmail());
        department.setContactPhone(request.getContactPhone());
        department.setHeadOfDepartment(request.getHeadOfDepartment());

        Department saved = departmentRepository.save(department);

        auditLogService.logAction(
                "UPDATE_DEPARTMENT",
                "Updated department id: " + id + " details",
                adminUser
        );

        return mapToResponse(saved);
    }

    @Transactional
    public void deleteDepartment(UUID id, User adminUser) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        departmentRepository.delete(department);

        auditLogService.logAction(
                "DELETE_DEPARTMENT",
                "Deleted department name: " + department.getName() + " with id: " + id,
                adminUser
        );
    }

    private DepartmentResponse mapToResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .departmentType(dept.getDepartmentType())
                .contactEmail(dept.getContactEmail())
                .contactPhone(dept.getContactPhone())
                .headOfDepartment(dept.getHeadOfDepartment())
                .build();
    }
}
