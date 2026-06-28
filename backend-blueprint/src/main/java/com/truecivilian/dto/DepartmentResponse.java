package com.truecivilian.dto;

import com.truecivilian.model.enums.DepartmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
    private UUID id;
    private String name;
    private DepartmentType departmentType;
    private String contactEmail;
    private String contactPhone;
    private String headOfDepartment;
}
