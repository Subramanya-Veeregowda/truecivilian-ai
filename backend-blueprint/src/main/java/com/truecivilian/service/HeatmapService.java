package com.truecivilian.service;

import com.truecivilian.model.Issue;
import com.truecivilian.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HeatmapService {

    private final IssueRepository issueRepository;

    public HeatmapService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    public static class HeatmapPoint {
        public double latitude;
        public double longitude;
        public double weight; // normalized between 1.0 and 5.0

        public HeatmapPoint(double latitude, double longitude, double weight) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.weight = weight;
        }
    }

    /**
     * Aggregates reported active issues into heatmap coordinates with severity-weighted density factors.
     */
    public List<HeatmapPoint> getHeatmapPoints() {
        List<Issue> issues = issueRepository.findAll();
        List<HeatmapPoint> points = new ArrayList<>();

        for (Issue issue : issues) {
            if (issue.getLatitude() != null && issue.getLongitude() != null) {
                double baseWeight = 1.0;
                switch (issue.getSeverity()) {
                    case MINOR:
                        baseWeight = 1.0;
                        break;
                    case MODERATE:
                        baseWeight = 2.0;
                        break;
                    case MAJOR:
                        baseWeight = 3.5;
                        break;
                    case CATASTROPHIC:
                        baseWeight = 5.0;
                        break;
                }
                // Reduce weight slightly if issue is already resolved
                if (issue.getStatus().toString().equals("RESOLVED") || issue.getStatus().toString().equals("REPAIRED")) {
                    baseWeight *= 0.2;
                }
                points.add(new HeatmapPoint(issue.getLatitude(), issue.getLongitude(), baseWeight));
            }
        }
        return points;
    }
}
