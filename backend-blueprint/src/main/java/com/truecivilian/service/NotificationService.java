package com.truecivilian.service;

import com.truecivilian.model.Notification;
import com.truecivilian.model.User;
import com.truecivilian.model.enums.NotificationType;
import com.truecivilian.repository.NotificationRepository;
import com.truecivilian.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserId(user.getId());
    }

    public List<Notification> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByUserIdAndIsReadFalse(user.getId());
    }

    public Notification createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .notificationType(type)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(UUID id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to modify this notification");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(user.getId());
        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : unread) {
            notification.setIsRead(true);
            notification.setReadAt(now);
        }
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(UUID id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }
}
