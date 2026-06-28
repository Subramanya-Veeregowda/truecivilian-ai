package com.truecivilian.controller;

import com.truecivilian.dto.IssueResponse;
import com.truecivilian.service.GeoLocationService;
import com.truecivilian.service.HeatmapService;
import com.truecivilian.service.MapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/maps")
public class MapController {

    private final MapService mapService;
    private final GeoLocationService geoLocationService;
    private final HeatmapService heatmapService;

    public MapController(MapService mapService, GeoLocationService geoLocationService, HeatmapService heatmapService) {
        this.mapService = mapService;
        this.geoLocationService = geoLocationService;
        this.heatmapService = heatmapService;
    }

    @GetMapping("/issues")
    public ResponseEntity<List<IssueResponse>> getIssues(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) Double centerLat,
            @RequestParam(required = false) Double centerLng,
            @RequestParam(required = false) Double radiusKm,
            @RequestParam(required = false) Double minLat,
            @RequestParam(required = false) Double minLng,
            @RequestParam(required = false) Double maxLat,
            @RequestParam(required = false) Double maxLng
    ) {
        List<IssueResponse> issues = mapService.getFilteredIssues(
                category, status, severity, priority, departmentId,
                centerLat, centerLng, radiusKm,
                minLat, minLng, maxLat, maxLng
        );
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Map<String, Object>>> getNearby(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10.0") double radius
    ) {
        List<Map<String, Object>> nearby = mapService.getNearbyIssues(latitude, longitude, radius);
        return ResponseEntity.ok(nearby);
    }

    @GetMapping("/heatmap")
    public ResponseEntity<List<HeatmapService.HeatmapPoint>> getHeatmap() {
        List<HeatmapService.HeatmapPoint> points = heatmapService.getHeatmapPoints();
        return ResponseEntity.ok(points);
    }

    @GetMapping("/route")
    public ResponseEntity<MapService.RouteResponse> getRoute(
            @RequestParam(required = false) Double startLat,
            @RequestParam(required = false) Double startLng,
            @RequestParam(required = false) List<UUID> issueIds
    ) {
        MapService.RouteResponse route = mapService.planOptimizedRoute(startLat, startLng, issueIds);
        return ResponseEntity.ok(route);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GeoLocationService.GeocodingResult>> searchLocation(
            @RequestParam String query
    ) {
        List<GeoLocationService.GeocodingResult> results = geoLocationService.geocodeAddress(query);
        return ResponseEntity.ok(results);
    }
}
