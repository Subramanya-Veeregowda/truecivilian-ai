package com.truecivilian.controller;

import com.truecivilian.model.Notification;
import com.truecivilian.model.User;
import com.truecivilian.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user));
    }

    @PutMapping("/read")
    public ResponseEntity<Notification> readNotification(
            @RequestParam(required = false) UUID id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User user
    ) {
        UUID finalId = id;
        if (finalId == null && body != null && body.containsKey("id")) {
            finalId = UUID.fromString(body.get("id"));
        }
        if (finalId == null) {
            throw new IllegalArgumentException("Notification id is required");
        }
        return ResponseEntity.ok(notificationService.markAsRead(finalId, user));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> readAllNotifications(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        notificationService.deleteNotification(id, user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }
}
