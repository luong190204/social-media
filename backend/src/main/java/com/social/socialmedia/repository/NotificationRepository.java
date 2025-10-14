package com.social.socialmedia.repository;

import com.social.socialmedia.dto.response.NotificationResponse;
import com.social.socialmedia.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<NotificationResponse> findByReceiverIdOrderByCreatedAtDesc(String userId);
}
