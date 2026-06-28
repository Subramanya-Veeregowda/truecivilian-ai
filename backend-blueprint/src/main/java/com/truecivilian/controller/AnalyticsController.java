package com.truecivilian.controller;

import com.truecivilian.service.AnalyticsService;
import com.truecivilian.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'AUTHORITY')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ReportService reportService;

    public AnalyticsController(AnalyticsService analyticsService, ReportService reportService) {
        this.analyticsService = analyticsService;
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/issues")
    public ResponseEntity<Map<String, Object>> getIssuesAnalysis() {
        return ResponseEntity.ok(analyticsService.getIssuesAnalysis());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentsAnalysis() {
        return ResponseEntity.ok(analyticsService.getDepartmentsAnalysis());
    }

    @GetMapping("/ai")
    public ResponseEntity<Map<String, Object>> getAiAnalysis() {
        return ResponseEntity.ok(analyticsService.getAiAnalysis());
    }

    @GetMapping("/citizens")
    public ResponseEntity<Map<String, Object>> getCitizensAnalysis() {
        return ResponseEntity.ok(analyticsService.getCitizensAnalysis());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(@RequestParam(defaultValue = "csv") String format) {
        byte[] data;
        String filename;
        MediaType mediaType;

        if ("excel".equalsIgnoreCase(format)) {
            data = reportService.generateExcelReport();
            filename = "truecivilian_analytics_report.xls";
            mediaType = MediaType.parseMediaType("application/vnd.ms-excel");
        } else if ("pdf".equalsIgnoreCase(format)) {
            data = reportService.generatePDFReport();
            filename = "truecivilian_analytics_report.pdf";
            mediaType = MediaType.parseMediaType("text/plain"); // Plain-text printable format
        } else {
            data = reportService.generateCSVReport();
            filename = "truecivilian_analytics_report.csv";
            mediaType = MediaType.parseMediaType("text/csv");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(data);
    }
}
