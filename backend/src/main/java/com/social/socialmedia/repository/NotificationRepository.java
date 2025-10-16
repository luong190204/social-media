package com.social.socialmedia.repository;

import com.social.socialmedia.dto.response.NotificationResponse;
import com.social.socialmedia.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    Page<Notification> findByReceiverIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    List<Notification> findByReceiverIdAndIsReadFalse(String userId);
}
