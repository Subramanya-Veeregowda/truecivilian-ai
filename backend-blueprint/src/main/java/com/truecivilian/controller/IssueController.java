package com.truecivilian.controller;

import com.truecivilian.dto.*;
import com.truecivilian.model.User;
import com.truecivilian.service.CloudinaryService;
import com.truecivilian.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;
    private final CloudinaryService cloudinaryService;

    public IssueController(IssueService issueService, CloudinaryService cloudinaryService) {
        this.issueService = issueService;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping
    public ResponseEntity<IssueResponse> createIssue(
            @Valid @RequestBody IssueRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(issueService.createIssue(request, user));
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAllIssues(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String wardCode,
            @RequestParam(required = false) UUID reporterId
    ) {
        return ResponseEntity.ok(issueService.getAllIssues(status, wardCode, reporterId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable UUID id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IssueResponse> updateIssue(
            @PathVariable UUID id,
            @Valid @RequestBody IssueRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(issueService.updateIssue(id, request, user));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IssueResponse> updateIssueStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(issueService.updateIssueStatus(id, status, reason, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteIssue(@PathVariable UUID id) {
        issueService.deleteIssue(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Issue deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadMedia(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(cloudinaryService.upload(file));
    }
}
