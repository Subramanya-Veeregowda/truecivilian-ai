package com.truecivilian.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private Cloudinary cloudinary;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:demo}") String cloudName,
            @Value("${cloudinary.api-key:demo}") String apiKey,
            @Value("${cloudinary.api-secret:demo}") String apiSecret
    ) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        try {
            if (!"demo".equals(cloudName) && !"demo".equals(apiKey) && !"demo".equals(apiSecret)) {
                this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiSecret
                ));
            }
        } catch (Exception e) {
            System.err.println("Cloudinary client failed to initialize: " + e.getMessage());
        }
    }

    public Map<String, Object> upload(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            return generateMockResponse(file);
        }
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            Map<String, Object> result = new HashMap<>();
            result.put("url", uploadResult.get("secure_url") != null ? uploadResult.get("secure_url").toString() : uploadResult.get("url").toString());
            result.put("public_id", uploadResult.get("public_id").toString());
            result.put("format", uploadResult.get("format") != null ? uploadResult.get("format").toString() : "bin");
            return result;
        } catch (Exception e) {
            System.err.println("Cloudinary upload failed, using fallback: " + e.getMessage());
            return generateMockResponse(file);
        }
    }

    public Map<String, Object> delete(String publicId) throws IOException {
        if (cloudinary == null || publicId == null || publicId.startsWith("mock-")) {
            Map<String, Object> result = new HashMap<>();
            result.put("result", "ok");
            return result;
        }
        try {
            Map destroyResult = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            Map<String, Object> result = new HashMap<>();
            result.put("result", destroyResult.get("result"));
            return result;
        } catch (Exception e) {
            System.err.println("Cloudinary delete failed: " + e.getMessage());
            Map<String, Object> result = new HashMap<>();
            result.put("result", "failed");
            return result;
        }
    }

    private Map<String, Object> generateMockResponse(MultipartFile file) {
        String randomId = UUID.randomUUID().toString();
        String originalFilename = file.getOriginalFilename();
        String extension = "jpg";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        }
        
        String mockUrl;
        if ("mp4".equalsIgnoreCase(extension) || "mov".equalsIgnoreCase(extension) || "avi".equalsIgnoreCase(extension)) {
            mockUrl = "https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp4";
        } else if ("mp3".equalsIgnoreCase(extension) || "wav".equalsIgnoreCase(extension) || "m4a".equalsIgnoreCase(extension)) {
            mockUrl = "https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp3";
        } else {
            mockUrl = "https://picsum.photos/seed/" + randomId + "/800/600";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("url", mockUrl);
        result.put("public_id", "mock-" + randomId);
        result.put("format", extension);
        return result;
    }
}
