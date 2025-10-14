package com.social.socialmedia.service;

import com.social.socialmedia.dto.response.NotificationResponse;
import com.social.socialmedia.entity.Notification;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.NotificationRepository;
import com.social.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

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
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // Realtime notification
        messagingTemplate.convertAndSendToUser(
                receiverId,
                "/queue/notifications",
                notification
        );
    }

    // Helper cho từng loại notification
    public void createFollowNotification(String receiverId, String senderId, String senderName) {
        String message = senderName + " đã bắt đầu theo dõi bạn.";
        createNotification(receiverId, senderId, "FOLLOW", null, message);
    }

    public void createLikeNotification(String receiverId, String senderId, String senderName, String postId) {
        String message = senderName + " đã thích bài viết của bạn.";
        createNotification(receiverId, senderId, "LIKE", postId, message);
    }

    public void createCommentNotification(String receiverId, String senderId, String senderName, String postId) {
        String message = senderName + " đã bình luận về bài viết của bạn.";
        createNotification(receiverId, senderId, "COMMENT", postId, message);
    }

    public List<NotificationResponse> getUserNotifications() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_FOUND));

        var notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(user.getId());

        // Convert sang dto kèm thông tin người dùng
        return notifications.stream().map(notification -> {
            User sender = userRepository.findById(notification.getSenderId()).orElse(null);

            return NotificationResponse.builder()
                    .id(notification.getId())
                    .message(notification.getMessage())
                    .type(notification.getType())
                    .postId(notification.getPostId())
                    .createdAt(notification.getCreatedAt())
                    .isRead(notification.isRead())
                    .senderId(notification.getSenderId())
                    .senderName(sender != null ? sender.getFullName() : "Người dùng")
                    .senderAvatar(sender != null ? sender.getProfilePic() : null)
                    .build();
        }).toList();
    }

    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(
                () -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
