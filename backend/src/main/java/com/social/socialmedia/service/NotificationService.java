package com.social.socialmedia.service;

import com.social.socialmedia.entity.Notification;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void createNotification(String receiverId, String senderId, String type, String postId, String message) {
        Notification notification = Notification.builder()
                .receiverId(receiverId)
                .senderId(senderId)
                .type(type)
                .postId(postId)
                .isRead(false)
                .message(message)
                .createAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // Realtime notification
        messagingTemplate.convertAndSendToUser(
                receiverId,
                "/queue/notifications",
                notification
        );
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(
                () -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
