package com.truecivilian.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.truecivilian.dto.GeminiRequest;
import com.truecivilian.dto.GeminiResponse;
import com.truecivilian.model.Issue;
import com.truecivilian.repository.IssueRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final IssueRepository issueRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    public GeminiService(IssueRepository issueRepository, ObjectMapper objectMapper) {
        this.issueRepository = issueRepository;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public GeminiResponse analyzeCivicIssue(GeminiRequest request) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = this.geminiApiKey;
        }

        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.error("GEMINI_API_KEY is not configured in the system environment or properties.");
            return GeminiResponse.builder()
                    .isValid(false)
                    .validationError("Gemini AI Integration is currently offline due to missing API Key configuration.")
                    .build();
        }

        // 1. Fetch nearby issues for Duplicate Detection
        List<Issue> nearbyIssues = new ArrayList<>();
        if (request.getWardCode() != null && !request.getWardCode().trim().isEmpty()) {
            List<Issue> wardIssues = issueRepository.findByWardCode(request.getWardCode());
            // Filter issues that are reasonably close using latitude/longitude within ~0.05 degree offset (approx 5km)
            if (request.getLatitude() != null && request.getLongitude() != null) {
                double userLat = request.getLatitude();
                double userLon = request.getLongitude();
                for (Issue issue : wardIssues) {
                    if (issue.getLatitude() != null && issue.getLongitude() != null) {
                        double latDiff = Math.abs(issue.getLatitude() - userLat);
                        double lonDiff = Math.abs(issue.getLongitude() - userLon);
                        if (latDiff < 0.05 && lonDiff < 0.05) {
                            nearbyIssues.add(issue);
                        }
                    }
                }
            } else {
                nearbyIssues.addAll(wardIssues);
            }
        }

        // limit nearby issues list to avoid hitting token boundaries
        if (nearbyIssues.size() > 5) {
            nearbyIssues = nearbyIssues.subList(0, 5);
        }

        // 2. Build instructions and prompt
        String promptText = PromptBuilder.buildAnalysisPrompt(nearbyIssues);

        // 3. Prepare Image Base64 data if available
        String base64Image = null;
        String mimeType = "image/jpeg";
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            base64Image = fetchImageAsBase64(request.getImageUrl());
            if (request.getImageUrl().toLowerCase().endsWith(".png")) {
                mimeType = "image/png";
            } else if (request.getImageUrl().toLowerCase().endsWith(".webp")) {
                mimeType = "image/webp";
            }
        }

        // 4. Construct Request Payload for Gemini Rest API
        Map<String, Object> requestPayload = buildGeminiPayload(promptText, base64Image, mimeType);

        // 5. Invoke Gemini API with Retry Strategy
        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;
        
        String rawResponseText = null;
        int maxRetries = 3;
        int backoffMs = 1000;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "aistudio-build");

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);
                String rawResult = restTemplate.postForObject(geminiUrl, entity, String.class);
                
                if (rawResult != null) {
                    JsonNode rootNode = objectMapper.readTree(rawResult);
                    JsonNode textNode = rootNode.path("candidates")
                            .path(0)
                            .path("content")
                            .path("parts")
                            .path(0)
                            .path("text");
                    
                    if (!textNode.isMissingNode()) {
                        rawResponseText = textNode.asText();
                        break;
                    }
                }
            } catch (Exception e) {
                log.warn("Gemini API call attempt {} failed: {}", attempt, e.getMessage());
                if (attempt == maxRetries) {
                    log.error("Gemini API call failed after {} attempts.", maxRetries, e);
                    return GeminiResponse.builder()
                            .isValid(false)
                            .validationError("Server encountered issues contacting the Gemini AI service. Please try again.")
                            .build();
                }
                try {
                    Thread.sleep(backoffMs * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        if (rawResponseText == null || rawResponseText.trim().isEmpty()) {
            return GeminiResponse.builder()
                    .isValid(false)
                    .validationError("Gemini AI service returned an empty analysis payload.")
                    .build();
        }

        // 6. Clean and parse JSON response
        try {
            String cleanJson = cleanJsonText(rawResponseText);
            JsonNode jsonNode = objectMapper.readTree(cleanJson);

            boolean isValid = jsonNode.path("isValid").asBoolean(true);
            if (!isValid) {
                return GeminiResponse.builder()
                        .isValid(false)
                        .validationError(jsonNode.path("validationError").asText("Uploaded image does not appear to represent a public municipal hazard or concern."))
                        .build();
            }

            GeminiResponse responseDto = GeminiResponse.builder()
                    .isValid(true)
                    .category(jsonNode.path("category").asText("GENERAL"))
                    .categoryConfidence(jsonNode.path("categoryConfidence").asDouble(0.9))
                    .title(jsonNode.path("title").asText("Incident Filed via AI"))
                    .titleConfidence(jsonNode.path("titleConfidence").asDouble(0.9))
                    .description(jsonNode.path("description").asText(""))
                    .descriptionConfidence(jsonNode.path("descriptionConfidence").asDouble(0.9))
                    .severity(jsonNode.path("severity").asText("MODERATE"))
                    .severityConfidence(jsonNode.path("severityConfidence").asDouble(0.9))
                    .priority(jsonNode.path("priority").asText("MEDIUM"))
                    .priorityConfidence(jsonNode.path("priorityConfidence").asDouble(0.9))
                    .department(jsonNode.path("department").asText("GENERAL"))
                    .departmentConfidence(jsonNode.path("departmentConfidence").asDouble(0.9))
                    .overallConfidence(jsonNode.path("overallConfidence").asDouble(0.9))
                    .isDuplicate(jsonNode.path("isDuplicate").asBoolean(false))
                    .duplicateSimilarity(jsonNode.path("duplicateSimilarity").asDouble(0.0))
                    .duplicateRecommendation(jsonNode.path("duplicateRecommendation").asText(""))
                    .build();

            int duplicateIndex = jsonNode.path("duplicateIndex").asInt(-1);
            if (duplicateIndex >= 0 && duplicateIndex < nearbyIssues.size()) {
                Issue duplicateIssue = nearbyIssues.get(duplicateIndex);
                responseDto.setDuplicateIssueId(duplicateIssue.getId().toString());
            }

            return responseDto;

        } catch (Exception e) {
            log.error("Failed to parse clean JSON from Gemini response text: {}", rawResponseText, e);
            return GeminiResponse.builder()
                    .isValid(false)
                    .validationError("Failed to parse the structured response from the Gemini AI analyzer.")
                    .build();
        }
    }

    private String fetchImageAsBase64(String imageUrl) {
        try {
            byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);
            if (imageBytes != null) {
                return Base64.getEncoder().encodeToString(imageBytes);
            }
        } catch (Exception e) {
            log.error("Failed to fetch image from URL: {}", imageUrl, e);
        }
        return null;
    }

    private Map<String, Object> buildGeminiPayload(String promptText, String base64Image, String mimeType) {
        Map<String, Object> requestPayload = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> contentMap = new HashMap<>();
        List<Map<String, Object>> parts = new ArrayList<>();

        // Text Part
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", promptText);
        parts.add(textPart);

        // Multimodal Image Part if available
        if (base64Image != null) {
            Map<String, Object> imagePart = new HashMap<>();
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mimeType", mimeType);
            inlineData.put("data", base64Image);
            imagePart.put("inlineData", inlineData);
            parts.add(imagePart);
        }

        contentMap.put("parts", parts);
        contents.add(contentMap);
        requestPayload.put("contents", contents);

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        requestPayload.put("generationConfig", generationConfig);

        return requestPayload;
    }

    private String cleanJsonText(String rawText) {
        if (rawText == null) return "{}";
        rawText = rawText.trim();
        if (rawText.startsWith("```json")) {
            rawText = rawText.substring("```json".length());
        } else if (rawText.startsWith("```")) {
            rawText = rawText.substring("```".length());
        }
        if (rawText.endsWith("```")) {
            rawText = rawText.substring(0, rawText.length() - "```".length());
        }
        return rawText.trim();
    }
}
