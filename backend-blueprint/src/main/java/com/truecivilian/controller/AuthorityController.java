package com.truecivilian.controller;

import com.truecivilian.dto.*;
import com.truecivilian.model.User;
import com.truecivilian.service.AssignmentService;
import com.truecivilian.service.AuthorityService;
import com.truecivilian.service.DashboardService;
import com.truecivilian.service.ResolutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/authority")
public class AuthorityController {

    private final DashboardService dashboardService;
    private final AuthorityService authorityService;
    private final AssignmentService assignmentService;
    private final ResolutionService resolutionService;

    public AuthorityController(
            DashboardService dashboardService,
            AuthorityService authorityService,
            AssignmentService assignmentService,
            ResolutionService resolutionService
    ) {
        this.dashboardService = dashboardService;
        this.authorityService = authorityService;
        this.assignmentService = assignmentService;
        this.resolutionService = resolutionService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AuthorityDashboardResponse> getDashboard(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(user));
    }

    @GetMapping("/issues")
    public ResponseEntity<List<IssueResponse>> getIssues(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(authorityService.getIssues(user));
    }

    @PutMapping("/issues/{id}/assign")
    public ResponseEntity<IssueResponse> assignIssue(
            @PathVariable UUID id,
            @RequestBody AssignIssueRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(assignmentService.assignIssue(id, request, user));
    }

    @PutMapping("/issues/{id}/status")
    public ResponseEntity<IssueResponse> updateIssueStatus(
            @PathVariable UUID id,
            @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(authorityService.updateIssueStatus(id, request, user));
    }

    @PutMapping("/issues/{id}/resolve")
    public ResponseEntity<IssueResponse> resolveIssue(
            @PathVariable UUID id,
            @RequestBody ResolveIssueRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(resolutionService.resolveIssue(id, request, user));
    }

    @GetMapping("/workload")
    public ResponseEntity<List<OfficerWorkloadResponse>> getWorkload(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(assignmentService.getOfficerWorkloads());
    }

    @GetMapping("/department-performance")
    public ResponseEntity<List<DepartmentPerformanceResponse>> getDepartmentPerformance(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(resolutionService.getDepartmentPerformance());
    }
}
