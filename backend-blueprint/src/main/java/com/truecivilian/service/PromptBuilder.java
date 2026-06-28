package com.truecivilian.service;

import com.truecivilian.model.Issue;
import java.util.List;

public class PromptBuilder {

    public static String buildAnalysisPrompt(List<Issue> nearbyIssues) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert Civic Hazard Analyzer and Municipal Assistant for the TrueCivilian AI portal.\n");
        sb.append("Analyze the attached image and classify/predict various fields for filing a municipal report.\n\n");
        
        sb.append("--- STEP 1: IMAGE VALIDATION ---\n");
        sb.append("Validate the uploaded image. We ONLY accept photos showing actual civic hazards, public infrastructure issues, environmental concerns, etc. (e.g., potholes, broken roads, sewer bursts, illegal garbage dumping, damaged streetlights, exposed live wires, blocked drains, waterlogging, broken pavements).\n");
        sb.append("Strictly REJECT:\n");
        sb.append("- Selfies or portraits of people\n");
        sb.append("- Memes, screenshots, text-heavy images, or digital art\n");
        sb.append("- Blank, black, blurry, or completely unrecognizable images\n");
        sb.append("- Photos showing clean, normal streets with no visible civic issue or hazard\n");
        sb.append("- Any non-civic photo (e.g., home interiors, cute animals, food, products)\n");
        sb.append("If the image is invalid, set 'isValid' to false, fill 'validationError' with a friendly, detailed explanation, and you do not need to fill other fields (or keep them empty/default).\n\n");

        sb.append("--- STEP 2: METADATA PREDICTION ---\n");
        sb.append("If the image is valid, predict the following:\n");
        sb.append("1. **Category**: Must be exactly one of: ROADS_AND_TRANSPORT, WATER_AND_SEWERAGE, WASTE_MANAGEMENT, ELECTRICITY_AND_POWER, HEALTH_AND_SANITATION, GENERAL.\n");
        sb.append("2. **Title**: Generate a concise, clear, human-readable title (max 100 characters). E.g., 'Large pothole on active lane' or 'Exposed live wiring on streetlight pole'.\n");
        sb.append("3. **Description**: Generate a highly professional, detailed, and clear municipal description of the issue. Highlight potential dangers to pedestrian or vehicular transit, structural damage visible, and urgency of dispatch.\n");
        sb.append("4. **Severity**: Must be exactly one of: MINOR, MODERATE, MAJOR, CATASTROPHIC.\n");
        sb.append("5. **Priority**: Suggest a response priority. Must be exactly one of: LOW, MEDIUM, HIGH, CRITICAL.\n");
        sb.append("6. **Department**: Predict the responsible department. Must be exactly one of: ROADS_AND_TRANSPORT, WATER_AND_SEWERAGE, WASTE_MANAGEMENT, ELECTRICITY_AND_POWER, HEALTH_AND_SANITATION, GENERAL.\n");
        sb.append("Provide individual confidence scores between 0.0 and 1.0 for each prediction, and an overall confidence score.\n\n");

        sb.append("--- STEP 3: DUPLICATE DETECTION ---\n");
        sb.append("We have fetched nearby active issues in the same sector. Check if the hazard shown in the image is semantically or visually duplicate of any of the nearby issues listed below.\n");
        if (nearbyIssues == null || nearbyIssues.isEmpty()) {
            sb.append("No active nearby issues exist. Set 'duplicateIndex' to -1, 'isDuplicate' to false, 'duplicateSimilarity' to 0.0, and 'duplicateRecommendation' to empty.\n\n");
        } else {
            sb.append("Here is the list of nearby active issues:\n");
            for (int i = 0; i < nearbyIssues.size(); i++) {
                Issue issue = nearbyIssues.get(i);
                sb.append("Index ").append(i).append(":\n");
                sb.append("  - ID: ").append(issue.getId()).append("\n");
                sb.append("  - Title: ").append(issue.getTitle()).append("\n");
                sb.append("  - Description: ").append(issue.getDescription()).append("\n");
                sb.append("  - Category: ").append(issue.getCategory()).append("\n");
                sb.append("  - Status: ").append(issue.getStatus()).append("\n\n");
            }
            sb.append("If the uploaded image shows the same hazard or is extremely similar (e.g., similarity >= 75%), set 'isDuplicate' to true, 'duplicateIndex' to the index of that issue, and calculate 'duplicateSimilarity' as a percentage (e.g. 85.0). Otherwise, set 'isDuplicate' to false and 'duplicateIndex' to -1.\n");
            sb.append("Provide a friendly 'duplicateRecommendation' (e.g. 'This seems to be a duplicate of the existing reported issue about potholes. Consider upvoting the existing report to help get it resolved faster.').\n\n");
        }

        sb.append("--- OUTPUT FORMAT ---\n");
        sb.append("You MUST return your response as a valid JSON object matching the following structure:\n");
        sb.append("{\n");
        sb.append("  \"isValid\": boolean,\n");
        sb.append("  \"validationError\": \"string or empty\",\n");
        sb.append("  \"category\": \"string (ROADS_AND_TRANSPORT / WATER_AND_SEWERAGE / WASTE_MANAGEMENT / ELECTRICITY_AND_POWER / HEALTH_AND_SANITATION / GENERAL)\",\n");
        sb.append("  \"categoryConfidence\": float,\n");
        sb.append("  \"title\": \"string\",\n");
        sb.append("  \"titleConfidence\": float,\n");
        sb.append("  \"description\": \"string\",\n");
        sb.append("  \"descriptionConfidence\": float,\n");
        sb.append("  \"severity\": \"string (MINOR / MODERATE / MAJOR / CATASTROPHIC)\",\n");
        sb.append("  \"severityConfidence\": float,\n");
        sb.append("  \"priority\": \"string (LOW / MEDIUM / HIGH / CRITICAL)\",\n");
        sb.append("  \"priorityConfidence\": float,\n");
        sb.append("  \"department\": \"string (ROADS_AND_TRANSPORT / WATER_AND_SEWERAGE / WASTE_MANAGEMENT / ELECTRICITY_AND_POWER / HEALTH_AND_SANITATION / GENERAL)\",\n");
        sb.append("  \"departmentConfidence\": float,\n");
        sb.append("  \"overallConfidence\": float,\n");
        sb.append("  \"isDuplicate\": boolean,\n");
        sb.append("  \"duplicateIndex\": integer,\n");
        sb.append("  \"duplicateSimilarity\": float,\n");
        sb.append("  \"duplicateRecommendation\": \"string\"\n");
        sb.append("}\n");
        
        return sb.toString();
    }
}
