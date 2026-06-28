package com.truecivilian.service;

import com.truecivilian.dto.CategoryDto;
import com.truecivilian.exception.BadRequestException;
import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.Category;
import com.truecivilian.model.User;
import com.truecivilian.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryManagementService {

    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    public CategoryManagementService(CategoryRepository categoryRepository, AuditLogService auditLogService) {
        this.categoryRepository = categoryRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto, User adminUser) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category name already exists");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Category saved = categoryRepository.save(category);

        auditLogService.logAction(
                "CREATE_CATEGORY",
                "Created category: " + saved.getName(),
                adminUser
        );

        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(UUID id, CategoryDto dto, User adminUser) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        categoryRepository.findByName(dto.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Category name already exists");
            }
        });

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getIsActive() != null) {
            category.setIsActive(dto.getIsActive());
        }

        Category saved = categoryRepository.save(category);

        auditLogService.logAction(
                "UPDATE_CATEGORY",
                "Updated category name to: " + saved.getName() + " with description: " + saved.getDescription(),
                adminUser
        );

        return mapToDto(saved);
    }

    @Transactional
    public void deleteCategory(UUID id, User adminUser) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        categoryRepository.delete(category);

        auditLogService.logAction(
                "DELETE_CATEGORY",
                "Deleted category: " + category.getName() + " with id: " + id,
                adminUser
        );
    }

    private CategoryDto mapToDto(Category cat) {
        return CategoryDto.builder()
                .id(cat.getId())
                .name(cat.getName())
                .description(cat.getDescription())
                .isActive(cat.getIsActive())
                .build();
    }
}
