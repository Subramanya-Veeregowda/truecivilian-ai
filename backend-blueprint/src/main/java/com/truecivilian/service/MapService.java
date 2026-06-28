package com.truecivilian.service;

import com.truecivilian.dto.IssueResponse;
import com.truecivilian.model.Issue;
import com.truecivilian.model.enums.IssuePriority;
import com.truecivilian.model.enums.IssueSeverity;
import com.truecivilian.model.enums.IssueStatus;
import com.truecivilian.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MapService {

    private final IssueRepository issueRepository;
    private final IssueMapper issueMapper;
    private final DistanceCalculator distanceCalculator;

    public MapService(IssueRepository issueRepository, IssueMapper issueMapper, DistanceCalculator distanceCalculator) {
        this.issueRepository = issueRepository;
        this.issueMapper = issueMapper;
        this.distanceCalculator = distanceCalculator;
    }

    public static class RouteResponse {
        public List<IssueResponse> optimizedWaypoints;
        public double totalDistanceKm;
        public double totalDurationMin;
        public List<Map<String, Double>> pathCoordinates; // List of {lat, lng}
        public List<String> navigationInstructions;
    }

    /**
     * Filters all issues based on standard parameters, with optional bounding box and radius constraints.
     */
    public List<IssueResponse> getFilteredIssues(
            String category,
            String status,
            String severity,
            String priority,
            UUID departmentId,
            Double centerLat,
            Double centerLng,
            Double radiusKm,
            Double minLat,
            Double minLng,
            Double maxLat,
            Double maxLng
    ) {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream()
                .filter(issue -> {
                    // Category filter
                    if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
                        if (!category.equalsIgnoreCase(issue.getCategory())) {
                            return false;
                        }
                    }
                    // Status filter
                    if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                        try {
                            IssueStatus statusEnum = IssueStatus.valueOf(status.toUpperCase());
                            if (issue.getStatus() != statusEnum) {
                                return false;
                            }
                        } catch (IllegalArgumentException e) {
                            // If invalid enum, ignore filter or check string match
                            if (!status.equalsIgnoreCase(issue.getStatus().toString())) {
                                return false;
                            }
                        }
                    }
                    // Severity filter
                    if (severity != null && !severity.trim().isEmpty() && !"ALL".equalsIgnoreCase(severity)) {
                        try {
                            IssueSeverity severityEnum = IssueSeverity.valueOf(severity.toUpperCase());
                            if (issue.getSeverity() != severityEnum) {
                                return false;
                            }
                        } catch (IllegalArgumentException e) {
                            if (!severity.equalsIgnoreCase(issue.getSeverity().toString())) {
                                return false;
                            }
                        }
                    }
                    // Priority filter
                    if (priority != null && !priority.trim().isEmpty() && !"ALL".equalsIgnoreCase(priority)) {
                        try {
                            IssuePriority priorityEnum = IssuePriority.valueOf(priority.toUpperCase());
                            if (issue.getPriority() != priorityEnum) {
                                return false;
                            }
                        } catch (IllegalArgumentException e) {
                            if (!priority.equalsIgnoreCase(issue.getPriority().toString())) {
                                return false;
                            }
                        }
                    }
                    // Department filter
                    if (departmentId != null) {
                        if (issue.getAssignedDepartment() == null || !issue.getAssignedDepartment().getId().equals(departmentId)) {
                            return false;
                        }
                    }

                    // Latitude/Longitude validation
                    if (issue.getLatitude() == null || issue.getLongitude() == null) {
                        return false;
                    }

                    // Bounding Box constraint
                    if (minLat != null && maxLat != null && minLng != null && maxLng != null) {
                        double lat = issue.getLatitude();
                        double lng = issue.getLongitude();
                        if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) {
                            return false;
                        }
                    }

                    // Radius constraint
                    if (centerLat != null && centerLng != null && radiusKm != null) {
                        double dist = distanceCalculator.calculateDistance(centerLat, centerLng, issue.getLatitude(), issue.getLongitude());
                        if (dist > radiusKm) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Helper to find nearby issues around a coordinate with detailed distance metadata.
     */
    public List<Map<String, Object>> getNearbyIssues(double lat, double lng, double radiusKm) {
        List<Issue> issues = issueRepository.findAll();
        List<Map<String, Object>> nearbyList = new ArrayList<>();

        for (Issue issue : issues) {
            if (issue.getLatitude() != null && issue.getLongitude() != null) {
                double distance = distanceCalculator.calculateDistance(lat, lng, issue.getLatitude(), issue.getLongitude());
                if (distance <= radiusKm) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("issue", issueMapper.toResponse(issue));
                    item.put("distanceKm", distance);
                    nearbyList.add(item);
                }
            }
        }

        // Sort by distance ascending
        nearbyList.sort(Comparator.comparingDouble(m -> (Double) m.get("distanceKm")));
        return nearbyList;
    }

    /**
     * Solves Traveling Salesperson problem greedily and optimizes dispatch routes for authorities.
     */
    public RouteResponse planOptimizedRoute(Double startLat, Double startLng, List<UUID> issueIds) {
        List<Issue> targets = new ArrayList<>();
        if (issueIds != null && !issueIds.isEmpty()) {
            targets = issueRepository.findAllById(issueIds);
        } else {
            // Default to all active, non-resolved issues if none specified
            targets = issueRepository.findAll().stream()
                    .filter(i -> i.getStatus() != IssueStatus.RESOLVED && i.getLatitude() != null && i.getLongitude() != null)
                    .collect(Collectors.toList());
        }

        RouteResponse response = new RouteResponse();
        response.optimizedWaypoints = new ArrayList<>();
        response.pathCoordinates = new ArrayList<>();
        response.navigationInstructions = new ArrayList<>();

        if (targets.isEmpty()) {
            response.totalDistanceKm = 0.0;
            response.totalDurationMin = 0.0;
            return response;
        }

        double currentLat = (startLat != null) ? startLat : 12.9716;
        double currentLng = (startLng != null) ? startLng : 77.5946;

        // Initialize path with starting location
        Map<String, Double> startPoint = new HashMap<>();
        startPoint.put("lat", currentLat);
        startPoint.put("lng", currentLng);
        response.pathCoordinates.add(startPoint);

        List<Issue> unvisited = new ArrayList<>(targets);
        double totalDist = 0.0;

        response.navigationInstructions.add("Departing dispatch base at coordinate (" + String.format("%.4f", currentLat) + ", " + String.format("%.4f", currentLng) + ")");

        while (!unvisited.isEmpty()) {
            Issue nearest = null;
            double nearestDist = Double.MAX_VALUE;

            for (Issue candidate : unvisited) {
                double d = distanceCalculator.calculateDistance(currentLat, currentLng, candidate.getLatitude(), candidate.getLongitude());
                if (d < nearestDist) {
                    nearestDist = d;
                    nearest = candidate;
                }
            }

            if (nearest != null) {
                unvisited.remove(nearest);
                totalDist += nearestDist;

                IssueResponse resp = issueMapper.toResponse(nearest);
                response.optimizedWaypoints.add(resp);

                currentLat = nearest.getLatitude();
                currentLng = nearest.getLongitude();

                Map<String, Double> pt = new HashMap<>();
                pt.put("lat", currentLat);
                pt.put("lng", currentLng);
                response.pathCoordinates.add(pt);

                response.navigationInstructions.add("Navigate " + String.format("%.2f", nearestDist) + " km to inspect/resolve issue: '" + nearest.getTitle() + "' at address: " + nearest.getLocationAddress());
            }
        }

        response.navigationInstructions.add("All targets inspected. Dispatch patrol route complete.");

        response.totalDistanceKm = totalDist;
        // Assume avg speed of 30 km/h in urban settings (0.5 km per minute)
        response.totalDurationMin = totalDist * 2.0;

        return response;
    }
}
