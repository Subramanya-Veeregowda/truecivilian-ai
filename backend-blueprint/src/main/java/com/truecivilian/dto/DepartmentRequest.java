package com.truecivilian.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 150, message = "Department name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Department type is required")
    private String departmentType; // DepartmentType enum as String

    @Email(message = "Contact email must be valid")
    @Size(max = 150, message = "Contact email cannot exceed 150 characters")
    private String contactEmail;

    private String contactPhone;

    private String headOfDepartment;
}
