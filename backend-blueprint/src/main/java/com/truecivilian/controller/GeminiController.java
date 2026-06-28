package com.truecivilian.controller;

import com.truecivilian.dto.GeminiRequest;
import com.truecivilian.dto.GeminiResponse;
import com.truecivilian.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<GeminiResponse> analyzeImage(@RequestBody GeminiRequest request) {
        GeminiResponse response = geminiService.analyzeCivicIssue(request);
        return ResponseEntity.ok(response);
    }
}
