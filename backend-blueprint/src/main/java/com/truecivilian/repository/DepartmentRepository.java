package com.truecivilian.repository;

import com.truecivilian.model.Department;
import com.truecivilian.model.enums.DepartmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    Optional<Department> findByName(String name);
    Optional<Department> findByDepartmentType(DepartmentType departmentType);
}
